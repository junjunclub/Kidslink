import axios from "axios";

const APPLICATION_SERVER_URL = import.meta.env.VITE_OPENVIDU_URL;
const OPENVIDU_SERVER_SECRET = import.meta.env.VITE_OPENVIDU_SECRET;

interface Recording {
  id: string;
  name: string;
  url: string; // Assuming the URL to access the recording is available
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const getToken = async (mySessionId: string): Promise<string> => {
  const sessionId = await createSession(mySessionId);
  return await createToken(sessionId);
};

const createSession = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions`,
    { customSessionId: sessionId },
    {
      headers: {
        "Content-Type": "application/json",
        // 0807 1403 김범수 추가 문제 시 삭제
        "Authorization": `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`
      }
    }
  );
  return response.data;  // 세션 ID 반환, data.id를 통해 올바른 값 추출
};

const createToken = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/sessions/${sessionId}/connections`,
    {},
    {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`
      }
    }
  );
  return response.data; // 토큰 반환
};

// 녹화 시작
export const startRecording = async (sessionId: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/recordings/start`,
      {
        session: sessionId,
        outputMode: "COMPOSED",
        hasAudio: true,
        hasVideo: true
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`
        }
      }
    );
    return response.data.id;
  } catch (error) {
    console.error("Error starting recording:", error);
    throw error;
  }
};

// 녹화 중지
export const stopRecording = async (recordingId: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/recordings/stop/${recordingId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error stopping recording:", error);
    throw error;
  }
};

// 녹화된 영상 가져오기
export const fetchRecordings = async (): Promise<Recording[]> => {
  try {
    const response = await axios.get(`${APPLICATION_SERVER_URL}/recordings`, {
      headers: {
        "Authorization": `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`
      }
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching recordings:", error);
    throw error;
  }
};

// 욕설 감지
const detectProfanity = (text: string): boolean => {
  const profanityList = ["김범수", "바보"]; // Add more words as needed
  return profanityList.some((word) => text.includes(word));
};

// STT 시작 함수
export const handleSpeechRecognition = async ( 
  sessionId: string,
  setRecordingId: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("SpeechRecognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = async (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript;
        console.log(transcript);
        if (detectProfanity(transcript)) {
          console.log("Profanity detected. Starting recording...");
          alert("욕설이 감지되었습니다. 녹화가 시작됩니다.");
          const recordingId = await startRecording(sessionId);
          console.log("Recording started with ID:", recordingId);
          setRecordingId(recordingId);
          recognition.stop();
        }
      }
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
};

// STT 중지 함수
export const stopSpeechRecognition = () => {
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (recognition) {
    recognition.stop();
  }
};
