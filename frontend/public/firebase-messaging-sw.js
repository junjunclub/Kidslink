// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging.js");

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || "Default Title";
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || "Default Body",
        icon: payload.notification?.icon || "/firebase-logo.png",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
