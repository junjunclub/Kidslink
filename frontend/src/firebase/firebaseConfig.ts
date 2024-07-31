import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import axios from "axios";

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export const getFcmToken = async () => {
    try {
        const registration = await navigator.serviceWorker.ready;
        const currentToken = await getToken(messaging, {
            vapidKey: "BM-iYGct2RQphax2ORcavHc_CIFrS3jqpLQ80WlBIEdHBu_TW03rjEJ_pZf0Ms9v72xfyQH5aU2L2Ot4mtYotnQ",
            serviceWorkerRegistration: registration,
        });
        if (currentToken) {
            console.log("FCM Token:", currentToken);
            // 서버에 FCM 토큰을 보내는 등의 작업을 진행하세요
        } else {
            console.log("No registration token available.");
        }
    } catch (error) {
        console.error("Error getting FCM token:", error);
    }
};

// FCM 토큰을 서버에 저장하는 함수 (선생님)
export const saveTokenToServer = async (userId) => {
    try {
        const registration = await navigator.serviceWorker.ready;
        const currentToken = await getToken(messaging, {
            vapidKey: "YOUR_VAPID_KEY", // VAPID 키를 사용
            serviceWorkerRegistration: registration,
        });

        if (currentToken) {
            // 서버에 FCM 토큰 저장
            await axios.post("/save-token", {
                userId: userId, // Teacher의 사용자 ID
                token: currentToken,
            });
        } else {
            console.log("No registration token available.");
        }
    } catch (error) {
        console.error("Error getting FCM token:", error);
    }
};

// Parent 로그인 후 메시지 전송
export const onParentLogin = async (teacherUsername, title, body) => {
    await axios.post("/send-message", {
        teacherUsername: teacherUsername, // Teacher의 사용자 이름
        title: title,
        body: body,
    });
};
