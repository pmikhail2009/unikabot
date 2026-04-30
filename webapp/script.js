// Получаем данные пользователя из Telegram WebApp
let tg = window.Telegram ? window.Telegram.WebApp : null;
let usernameForGreeting = "гость";

if (tg) {
  tg.ready();
  const initDataUnsafe = tg.initDataUnsafe || {};
  const user = initDataUnsafe.user;
  if (user && (user.first_name || user.username)) {
    usernameForGreeting = user.first_name || "@" + user.username;
  }
  tg.expand();
}

const welcomeText = document.getElementById("welcomeText");
const preloader = document.getElementById("preloader");
const app = document.getElementById("app");
const cardsContainer = document.getElementById("cardsContainer");
const contactButton = document.getElementById("contactButton");

// Модалка
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalMainImage = document.getElementById("modalMainImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalGallery = document.getElementById("modalGallery");

welcomeText.textContent = `Приветствуем, ${usernameForGreeting}!`;

// После небольшой паузы скрываем приветствие и показываем магазин
setTimeout(() => {
  preloader.classList.add("hidden");
  app.classList.remove("hidden");
  loadCatalog();
}, 1300);

// Кнопка "Написать для заказа"
contactButton.addEventListener("click", () => {
  if (tg) {
    tg.openTelegramLink("https://t.me/unika_flowers");
  } else {
    window.open("https://t.me/unika_flowers", "_blank");
  }
});

// Загрузка каталога из catalog.xlsx
async function loadCatalog() {
  try {
    const response = await fetch("catalog.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    renderCards(json);
  } catch (e) {
    console.error("Ошибка загрузки каталога:", e);
  }
}

function renderCards(items) {
  cardsContainer.innerHTML = "";
  items.forEach((item, index) => {
    const name = item.name || "";
    const description = item.description || "";
    const cardPhoto = item.card_photo || item.cardPhoto || "";
    const photos = [
      cardPhoto,
      item.photo2 || "",
      item.photo3 || "",
      item.photo4 || ""
    ].filter(Boolean);

    const card = document.createElement("div");
    card.className = "card-outer fade-in";

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "card-image-wrapper";

    const img = document.createElement("img");
    img.className = "card-image";
    img.src = cardPhoto || "logo.png";
    img.alt = name;

    imgWrapper.appendChild(img);

    const titleEl = document.createElement("div");
    titleEl.className = "card-title";
    titleEl.textContent = name;

    inner.appendChild(imgWrapper);
    inner.appendChild(titleEl);
    card.appendChild(inner);

    inner.addEventListener("click", () => {
      openModal({
        name,
        description,
        photos
      });
    });

    cardsContainer.appendChild(card);
  });
}

// Открытие модалки с плавной анимацией
function openModal(item) {
  modalMainImage.src = item.photos[0] || "logo.png";
  modalTitle.textContent = item.name;
  modalDescription.textContent = item.description;
  modalGallery.innerHTML = "";

  item.photos.slice(1).forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = item.name;
    modalGallery.appendChild(img);
  });

  modalOverlay.classList.remove("hidden");
  modalOverlay.classList.add("fade-in");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

modalClose.addEventListener("click", () => {
  closeModal();
});