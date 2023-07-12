const cryptobox = document.getElementById("crypto-box");
const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=tr';
const itemsPerPage = 20; // Her sayfada gösterilecek öğe sayısı
let currentPage = 1; // Şu anki sayfa numarası
let data = []; // API'den gelen tüm verilerin listesi
let totalPages = 0; // Toplam sayfa sayısı

fetch(apiUrl)
    .then(response => response.json())
    .then(apiData => {
        data = apiData;
        totalPages = Math.ceil(data.length / itemsPerPage);
        displayItems(currentPage);
        createPaginationButtons();
    })
    .catch(error => {
        console.error('Hata:', error);
    });

function displayItems(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = data.slice(startIndex, endIndex);

    cryptobox.innerHTML = "";

    for (const item of paginatedItems) {
        const name = item.name;
        const image = item.image;
        const current_price = item.current_price;

        cryptobox.innerHTML += `
            <div class="card" id="card">
              <h3>${name}</h3>
              <div class="image">
                <img src="${image}" id="image">
              </div>
              <p>Price: $ ${current_price}</p>
              <div class="button-container">
                <button class="btns">Buy</button>
              </div>
            </div>
          `;
    }
     // Yeni sayfa görüntülendikten sonra scroll'u en üste taşı
     window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createPaginationButtons() {
  const paginationElement = document.getElementById("pagination");
  paginationElement.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.addEventListener("click", function () {
          currentPage = parseInt(this.textContent);
          displayItems(currentPage);

          // Aktif sayfa düğmesine .active sınıfını ekleyin
          const activeButton = document.querySelector(".active");
          if (activeButton) {
              activeButton.classList.remove("active");
          }
          this.classList.add("active");
      });
      paginationElement.appendChild(button);
  }

  // İlk sayfa düğmesine .active sınıfını ekleyin
  const firstButton = paginationElement.querySelector("button");
  if (firstButton) {
      firstButton.classList.add("active");
  }
}

