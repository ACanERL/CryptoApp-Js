const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./user');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Users', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Kullanıcı kayıt formunu göster
router.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

router.post('/register', (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  // Veri kaydetme işlemleri
  const user = new User({email, username, password });

  if (user != null) {
    user.save()
      .then(() => {
        console.log("Kayıt başarılı.");
        res.redirect('/login'); // Kayıt başarılı olduğunda login sayfasına yönlendir
      })
      .catch(err => {
        console.error('Veri kaydetme hatası:', err);
        res.redirect('/register'); // Kayıt başarısız olduğunda yönlendirilecek sayfa
      });
  } else {
    console.log("User Model Hatasi");
  }
});

function showLoader() {
  document.getElementById('loader').style.display = 'block';
}
module.exports = router;
