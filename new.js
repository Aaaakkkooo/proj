let items = [];
let favorites = [];
let isLoggedIn = false; // Состояние авторизации

const translations = {
    ru: {
        addTitle: "Добавление товара",
        name: "Название",
        description: "Описание",
        phone: "Номер телефона",
        owner: "Имя",
        category: "Выберите категорию",
        type: "Тип товара",
        addItem: "Добавить товар",
        itemList: "Список товаров",
        allCategories: "Все категории",
        allTypes: "Все типы",
        newest: "Сначала новые",
        oldest: "Сначала старые",
        search: "Поиск по ключевой букве",
        showAll: "Показать все",
    },
    kk: {
        addTitle: "Тауар қосу",
        name: "Атауы",
        description: "Сипаттама",
        phone: "Телефон нөмірі",
        owner: "Есімі",
        category: "Санатты таңдаңыз",
        type: "Тауар түрі",
        addItem: "Тауарды қосу",
        itemList: "Тауарлар тізімі",
        allCategories: "Барлық санаттар",
        allTypes: "Барлық түрлері",
        newest: "Алдымен жаңалары",
        oldest: "Алдымен ескілері",
        search: "Кілт сөзі бойынша іздеу",
        showAll: "Барлығын көрсету",
    },
};

let currentLang = "ru";

function translateInterface() {
    const texts = translations[currentLang];
    document.getElementById("addTitle").textContent = texts.addTitle;
    document.getElementById("name").placeholder = texts.name;
    document.getElementById("description").placeholder = texts.description;
    document.getElementById("phone").placeholder = texts.phone;
    document.getElementById("owner").placeholder = texts.owner;
    document.getElementById("category").options[0].textContent = texts.category;
    document.getElementById("type").options[0].textContent = texts.type;
    document.querySelector("button[type='submit']").textContent = texts.addItem;
    document.getElementById("itemListTitle").textContent = texts.itemList;
    document.getElementById("search").placeholder = texts.search;
    document.querySelector("button[onclick='showAllItems()']").textContent = texts.showAll;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

function addItem(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const owner = document.getElementById('owner').value.trim();
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;
    const imageInput = document.getElementById('image');
    const dateAdded = new Date();

    if (!name || !description || !phone || !owner || !category || !type || !imageInput.files.length) {
        showNotification("Заполните все поля!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        items.push({
            name,
            description,
            phone,
            owner,
            category,
            type,
            dateAdded,
            image: e.target.result
        });
        document.getElementById('addForm').reset();
        showNotification('Товар добавлен!');
        renderItems();
    };
    reader.readAsDataURL(imageInput.files[0]);
}

function renderItems(filteredItems = items) {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';
    filteredItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="img-fluid">
            <div class="item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>${item.phone}</p>
                <p>${item.owner}</p>
                <p>${item.category}</p>
                <p>${item.type}</p>
                <p>${item.dateAdded.toLocaleDateString()}</p>
                <button class="btn btn-outline-danger favorite-btn" onclick="toggleFavorite('${item.name}')">❤️ В избранное</button>
            </div>
        `;
        container.appendChild(itemElement);
    });
}

function toggleFavorite(itemName) {
    const item = items.find(i => i.name === itemName);
    if (!item) return;

    if (favorites.some(fav => fav.name === itemName)) {
        favorites = favorites.filter(fav => fav.name !== itemName);
        showNotification(`Удалено из избранного: ${itemName}`);
    } else {
        favorites.push(item);
        showNotification(`Добавлено в избранное: ${itemName}`);
    }
    updateFavorites();
}

function updateFavorites() {
    const favoritesContainer = document.getElementById('favoritesContainer');
    favoritesContainer.innerHTML = '';
    favorites.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="img-fluid">
            <div class="item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>${item.phone}</p>
                <p>${item.owner}</p>
                <p>${item.category}</p>
                <p>${item.type}</p>
                <button class="btn btn-outline-danger favorite-btn" onclick="toggleFavorite('${item.name}')">❤️ Убрать из избранного</button>
            </div>
        `;
        favoritesContainer.appendChild(itemElement);
    });
}

function toggleLanguage() {
    currentLang = currentLang === "ru" ? "kk" : "ru";
    translateInterface();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
}

window.onload = () => {
    translateInterface();
    renderItems();
};


function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500); // Удалить через 500 мс после начала анимации
    }, 1000); // Уведомление отображается 1 секунду
}


function searchItems() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery)
    );
    renderItems(filteredItems);
}



function filterItems() {
    const category = document.getElementById('filterCategory').value;
    const type = document.getElementById('filterType').value;
    const sortDate = document.getElementById('sortDate').value;
    const search = document.getElementById('search').value.toLowerCase();

    let filteredItems = items.filter(item => {
        return (category === 'all' || item.category === category) &&
               (type === 'all' || item.type === type) &&
               (!search || item.name.toLowerCase().includes(search));
    });

    if (sortDate === 'newest') {
        filteredItems.sort((a, b) => b.dateAdded - a.dateAdded);
    } else {
        filteredItems.sort((a, b) => a.dateAdded - b.dateAdded);
    }

    renderItems(filteredItems);
}

document.getElementById('filterCategory').addEventListener('change', filterItems);
document.getElementById('filterType').addEventListener('change', filterItems);
document.getElementById('sortDate').addEventListener('change', filterItems);
document.getElementById('search').addEventListener('input', filterItems);