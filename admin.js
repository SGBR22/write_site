// Конфигурация (замени на свои данные из консоли Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyAIaL-kSIuy1GfnEXeDdeP92shDdbqT0tI",
  authDomain: "file-dump-2a5ba.firebaseapp.com",
  projectId: "file-dump-2a5ba",
  storageBucket: "file-dump-2a5ba.firebasestorage.app",
  messagingSenderId: "626874517340",
  appId: "1:626874517340:web:24b542f773926277172399",
  measurementId: "G-D4XR2BR5X9"
};

// Инициализация
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Функция входа
window.login = function() {
    const email = prompt("Email:");
    const password = prompt("Пароль:");
    if (email && password) {
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => alert("Ошибка: " + error.message));
    }
};

// Функция выхода
window.logout = function() {
    auth.signOut();
};

// Сохранение текста
window.saveData = async function() {
    const text = document.getElementById('editor-area').value;
    try {
        await db.collection("content").doc("mainPage").set({
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Сохранено!");
    } catch (e) {
        alert("Нет прав на запись! Проверь Rules в Firebase.");
    }
};

// Загрузка текста
async function loadData() {
    const doc = await db.collection("content").doc("mainPage").get();
    if (doc.exists) {
        document.getElementById('editor-area').value = doc.data().text;
    }
}

// Следим за пользователем: вошел или вышел
auth.onAuthStateChanged(user => {
    const adminPanel = document.getElementById('admin-panel');
    const loginBtn = document.getElementById('login-btn');

    if (user) {
        // Если залогинен — показываем редактор
        if(adminPanel) adminPanel.style.display = 'block';
        if(loginBtn) loginBtn.style.display = 'none';
        loadData();
    } else {
        // Если вышел — скрываем
        if(adminPanel) adminPanel.style.display = 'none';
        if(loginBtn) loginBtn.style.display = 'block';
    }
});
