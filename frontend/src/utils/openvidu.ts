import { OpenVidu, StreamEvent, StreamPropertyChangedEvent } from "openvidu-browser";
import { handleSpeechRecognition, fetchRecordings, getToken, stopSpeechRecognition } from "../api/openvidu";
import { OpenViduState, Recording, User } from "../types/openvidu";
import { getParentInfo } from "../api/Info";

export const joinSession = async (
  user: User,
  setOpenvidu: React.Dispatch<React.SetStateAction<OpenViduState>>,
  setIsSessionJoined: React.Dispatch<React.SetStateAction<boolean>>,
  setMyStreamId: React.Dispatch<React.SetStateAction<string | undefined>>, // 이 매개변수 추가
  setOtherVideoActive: React.Dispatch<React.SetStateAction<boolean>>, // 상대방 비디오 상태 추가
  retries: number = 3 // 재시도 횟수 추가
) => {
  if (!user.sessionId) return;
  const OV = new OpenVidu();
  OV.enableProdMode();
  const session = OV.initSession();

  // 이벤트 등록
  session.on("streamCreated", (event: StreamEvent) => {
    try {
      const subscriber = session.subscribe(event.stream, undefined, { insertMode: "REPLACE" });
      setOpenvidu((prevOpenvidu) => ({
        ...prevOpenvidu,
        subscribers: [...prevOpenvidu.subscribers, subscriber],
      }));
      console.log(subscriber);
    } catch (error) {
      console.error("Error during stream subscription:", error);
    }
  });

  session.on("streamDestroyed", (event: StreamEvent) => {
    setOpenvidu((prevOpenvidu) => {
      const streamManager = event.stream.streamManager;
      return {
        ...prevOpenvidu,
        subscribers: prevOpenvidu.subscribers.filter((sub) => sub !== streamManager),
      };
    });
  });

  session.on("exception", (exception) => {
    console.warn(exception);
  });

  session.on("streamPropertyChanged", (event: StreamPropertyChangedEvent) => {
    if (event.changedProperty === "videoActive") {
      setMyStreamId((myStreamId) => {
        if (event.stream.streamId !== myStreamId) {
          setOtherVideoActive(Boolean(event.newValue));
          console.log("Other participant's video state changed:", event.newValue);
        } else {
          console.log("My video state changed:", event.newValue);
        }
        return myStreamId;
      });
    }
  });

  session.on("participantLeft", (event) => {
    console.log("Participant left: ", event);
    const connectionId = event.connection.connectionId;
    setOpenvidu((prevOpenvidu) => ({
      ...prevOpenvidu,
      subscribers: prevOpenvidu.subscribers.filter((sub) => sub.stream.connection.connectionId !== connectionId),
    }));
  });

  try {
    const token = await getToken(user.sessionId);
    await session.connect(token, { clientData: user.username });
    const publisher = await OV.initPublisherAsync(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: "1260x720",
      frameRate: 30,
      insertMode: "REPLACE",
      mirror: true,
    });
    session.publish(publisher);
    setOpenvidu((p) => ({
      ...p,
      session: session,
      mainStreamManager: publisher,
      publisher: publisher,
    }));
    setMyStreamId(publisher.stream.streamId);
    setIsSessionJoined(true);
  } catch (error) {
    console.log("There was an error connecting to the session:", error.code, error.message);
    if (retries > 0) {
      console.log(`Retrying to join session... Attempts left: ${retries - 1}`);
      joinSession(user, setOpenvidu, setIsSessionJoined, setMyStreamId, setOtherVideoActive, retries - 1);
    } else {
      console.error("Failed to join session after multiple attempts.");
    }
  }
};

export const leaveSession = (
  openvidu: OpenViduState,
  setOpenvidu: React.Dispatch<React.SetStateAction<OpenViduState>>,
  setIsSessionJoined: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (openvidu.session) {
    openvidu.session.disconnect();
    stopSpeechRecognition();
    setOpenvidu((prevOpenvidu) => ({
      ...prevOpenvidu,
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
    }));
    setIsSessionJoined(false);
  }
};

export const fetchParentInfo = async (
  setParentInfo: React.Dispatch<React.SetStateAction<any>>,
  setUser: React.Dispatch<React.SetStateAction<User>>
) => {
  try {
    const fetchedParentInfo = await getParentInfo();
    setParentInfo(fetchedParentInfo);
    setUser((prevUser) => ({ ...prevUser, username: fetchedParentInfo.child.name }));
  } catch (error) {
    console.error('Failed to fetch parent info:', error);
  }
};

export const fetchRecordingsList = async (
  setRecordings: React.Dispatch<React.SetStateAction<Recording[]>>
) => {
  try {
    const recordings = await fetchRecordings();
    setRecordings(recordings);
  } catch (error) {
    console.error("Error fetching recordings:", error);
  }
};
