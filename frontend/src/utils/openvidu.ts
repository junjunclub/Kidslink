import { OpenVidu, StreamEvent, StreamPropertyChangedEvent } from "openvidu-browser";
import { fetchRecordings, getToken, handleSpeechRecognitionSignalByParent, startMainRecording } from "../api/openvidu";
import { OpenViduState, Recording, User } from "../types/openvidu";
import { getParentInfo } from "../api/Info";

export const joinSession = async (
  user: User,
  setOpenvidu: React.Dispatch<React.SetStateAction<OpenViduState>>,
  setIsSessionJoined: React.Dispatch<React.SetStateAction<boolean>>,
  setMyStreamId: React.Dispatch<React.SetStateAction<string | undefined>>, // 이 매개변수 추가
  setOtherVideoActive: React.Dispatch<React.SetStateAction<boolean>>, // 상대방 비디오 상태 추가
  setIsReadyToStart: React.Dispatch<React.SetStateAction<boolean>>, // 추가된 매개변수: 시작 준비 상태 관리
) => {
  if (!user.sessionId) {
    console.log("user", user);
    return;
  }
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

  // 참가자들이 모두 세션에 참여했는지 확인하는 로직
  session.on("signal:readyToStart", (event) => {
    console.log("readyToStart 이벤트 동작", user)
    if (event.data === "ready") {
      console.log("상대방도 세션에 참여함");
      setIsReadyToStart(true);
    }
  });

  // 새로운 이벤트 등록: streamPropertyChanged
  // 수정 필요한 부분
  session.on("streamPropertyChanged", (event: StreamPropertyChangedEvent) => {
    console.log(session);
    console.log("session");
    if (event.changedProperty === "videoActive") {
      console.log("Video state changed for stream", event.stream.streamId, ":", event.newValue);

      const streamId = session.remoteStreamsCreated.keys();
      const streamKey = Array.from(streamId);
      const otherVideoActive = streamKey[0] === event.stream.streamId;

      // 자신의 스트림 ID와 비교하여 상태 로그 출력
      setMyStreamId((myStreamId) => {
        if (event.stream.streamId === myStreamId) {
          console.log("내 비디오 상태가 변경되었습니다:", event.newValue);
        } else {
          console.log("상대방 비디오 상태가 변경되었습니다:", event.newValue);
          setOtherVideoActive(Boolean(event.newValue)); // boolean으로 캐스팅
          console.log(otherVideoActive);
          console.log("openvidu에서 otherVideoActive");
        }
        return myStreamId;
      });
    }
  });

  session.on("signal:readyToStart", (event) => {
    // 상대방이 입장했음을 알리는 신호를 받으면
    if (event.data === "ready") {
      console.log("상대방도 세션에 참여했습니다.");
      setIsReadyToStart(true);
    }
  });

  const token = await getToken(user.sessionId);

  session
    .connect(token, { clientData: user.username })
    .then(async () => {
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

      // 자신의 스트림 ID 저장
      setMyStreamId(publisher.stream.streamId);
      
      // 자신이 세션에 참여했다고 알림 (커스텀 이벤트 등록)
      session.signal({
        data: "ready", // 전송할 데이터
        to: [], // 수신자 배열 (빈 배열은 모든 참가자에게 보냄)
        type: "readyToStart", // 커스텀 이벤트 이름
      });

      // 상대방이 이미 입장해 있었는지 확인
      session.on("signal:readyToStart", (event) => {
        if (event.data === "ready") {
          console.log("상대방이 이미 세션에 참여했습니다.", user);
          setIsReadyToStart(true);
          console.log("세션 시작하기")
          // 상대방이 준비된 상태라면 세션을 시작
          // if (user.sessionId) {
          //   startMainRecording(user.sessionId); // 선생님 측에서 녹화 시작
          // 녹화는 선생님 컴포넌트에서 진행 
          // }
        }
      });

      setIsSessionJoined(true);


      // 양쪽 모두 준비되면 비디오 스트림과 녹화를 시작
      // setIsReadyToStart((ready) => {
      //   if (ready) {
      //     // 오디오/비디오 활성화
      //     // publisher.publishAudio(true);
      //     // publisher.publishVideo(true);

      //     // 녹화 시작
      //     startMainRecording(user.sessionId);
      //   }
      //   return ready;
      // });
    })
    .catch((error) => {
      console.log("There was an error connecting to the session:", error.code, error.message);
    });

  console.log(session);
  console.log("session");
};

export const leaveSession = async (
  openvidu: OpenViduState,
  setOpenvidu: React.Dispatch<React.SetStateAction<OpenViduState>>,
  setIsSessionJoined: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: (path: string) => void
) => {
  if (openvidu.session) {
    try {
      // 세션을 안전하게 종료
      openvidu.session.disconnect();
    } catch (error) {
      console.error("Error during session disconnect:", error);
    } finally {
      // 상태를 초기화하고, 세션 종료 플래그를 false로 설정
      setOpenvidu((prevOpenvidu) => ({
        ...prevOpenvidu,
        session: undefined,
        mainStreamManager: undefined,
        publisher: undefined,
        subscribers: [],
      }));
      setIsSessionJoined(false);
      navigate('/meeting'); // /meeting 페이지로 이동
    }
  } else {
    console.warn("No active session to leave.");
    navigate("/meeting");
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
    console.error("Failed to fetch parent info:", error);
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
