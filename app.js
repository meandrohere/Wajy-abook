import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA9dfAX6QsQb2b5WQcg4x41oBw7UVnGrcA",
    authDomain: "qdjeizjeheidjd.firebaseapp.com",
    projectId: "qdjeizjeheidjd",
    storageBucket: "qdjeizjeheidjd.firebasestorage.app",
    messagingSenderId: "790923875489",
    appId: "1:790923875489:web:76ce647204360a15d80ce0",
    measurementId: "G-KZY036P274",
    databaseURL: "https://qdjeizjeheidjd-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

// الحصول على اسم المستخدم
let username = localStorage.getItem("username");
if (!username) {
    username = prompt("أدخل اسمك:");
    if (!username) username = "Anonymous";
    localStorage.setItem("username", username);
}

// إرسال الرسالة
window.sendText = function () {
    const textInput = document.getElementById("textInput");
    const text = textInput.value.trim();
    const loader = document.getElementById("loader");

    if (!text) {
        alert("يرجى إدخال نص!");
        return;
    }

    loader.style.display = "block";
    const timestamp = new Date().toLocaleTimeString();

    const messageData = { text, username, timestamp };

    push(messagesRef, messageData).then(() => {
        textInput.value = "";
        loader.style.display = "none";
    }).catch(() => {
        alert("خطأ في إرسال الرسالة.");
        loader.style.display = "none";
    });
};

// استقبال الرسائل من Firebase
onChildAdded(messagesRef, (snapshot) => {
    const messageData = snapshot.val();
    
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    
    if (messageData.username === username) {
        messageElement.classList.add("sent");
    } else {
        messageElement.classList.add("received");
    }

    messageElement.innerHTML = `
        <strong>${messageData.username}</strong>: ${messageData.text}
        <br>
        <small>🕒 ${messageData.timestamp}</small>
    `;

    document.getElementById("messages").appendChild(messageElement);
});