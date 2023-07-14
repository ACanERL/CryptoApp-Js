const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const kayitRouter = require('./kayit');
const app = express();
const User = require('./user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Users', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

app.use(express.static("."));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', kayitRouter);

// Oturum yönetimi için Express-session yapılandırması
app.use(session({
  secret: 'abcde61612222',
  resave: false,
  saveUninitialized: true
}));
app.get('/session', (req, res) => {
  const sessionData = {
    loggedIn: req.session.loggedIn,
    username: req.session.username
  };
  res.json(sessionData);
});
app.use(express.urlencoded({ extended: true }));

const checkAuth = (req, res, next) => {
  if (req.session.loggedIn) {
    next(); // Kullanıcı giriş yapmış, devam et
  } else {
    res.redirect('/login'); // Kullanıcı giriş yapmamış, giriş sayfasına yönlendir
  }
};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password)
          .then(result => {
            if (result=password===user.password) {
              req.session.loggedIn = true; // Oturumu başlat
              req.session.username = username; // Kullanıcı adını oturum verilerine ekle
              console.log(result);
              res.redirect('/crypto');
            } else {
              console.log("Hatalı şifre");
              res.redirect('/login');
            }
          })
          .catch(err => {
            console.error('Şifre karşılaştırma hatası:', err);
            res.redirect('/login');
          });
      } else {
        res.redirect('/login');
      }
    })
    .catch(err => {
      console.error('Veritabanı hatası:', err);
      res.redirect('/login');
    });
});

app.get('/crypto', checkAuth, (req, res) => {
  res.sendFile(__dirname + '/crypto.html');
});

app.get('/crypto', (req, res) => {
  const username = req.session.username;
  res.render('crypto', { username: username });
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
  console.log('Uygulama http://localhost:3000/ adresinde çalışıyor');
});
