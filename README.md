# 🌱 키즈링크
![썸네일](./docs/assets/images/thumbnail.PNG)

## 💛 프로젝트 소개

<b>부모님</b>, 등하원 버스 위치를 실시간으로 확인할 수 있다면 얼마나 안심이 될까요? <br/> 상담 때문에 유치원에 방문하는 것이 부담되지 않나요?

<b>선생님</b>, 학부모의 갑질로 인한 스트레스, 어떻게 해결할 수 있을까요? <br/>  매일 수백 장의 사진을 일일이 분류하느라 힘드시지 않나요?

이제 키즈링크로 모든 걱정을 덜어보세요! 키즈링크와 함께라면 유치원 생활이 더 안전하고 편리해집니다😄

[배포 링크 🔗](https://www.kidslink.xyz/)

## 💛 프로젝트 기간
2024.07.01 ~ 2024.08.16 (7주)

## 💛 기술스택
![기술스택](./docs/assets/images/tech_stack.png)

## 💛 주요 기능
- ### 학사 일정 관리
  - 유치원 내 행사 일정 및 개인 일정을 관리할 수 있는 서비스
- ### 알림장
  - 온라인으로 작성하는 알림장 서비스
- ### 성장일지
  - 원생들의 특별한 하루를 기록하는 서비스
  - 학부모분들에게 아이의 하루 모습을 전달할 수 있습니다.
- ### 서류관리
  - 아이들과 관련한 서류를 제출할 수 있습니다.
  - 원에서 관리되는 투약 신청서 및 결석 사유서 등 서류 내역을 제출하고 처리할 수 있습니다.
- ### 원생 앨범
  - 원생들의 추억을 남긴 사진들을 저장할 수 있습니다.
  - 여러 아이들의 사진으로 앨범을 만들어 학부모에게 전달하세요.
  - **얼굴 인식 AI**를 도입하여 학부모 자식에 해당하는 아이 앨범을 자동으로 만들어 줍니다.
  - 아이별 누적 사진 개수를 계산하여 학부모 불만 사전 예방
- ### 유치원 정기 상담
  - 선생님, 학부모간 정기 화상 상담 진행 서비스
  - 온라인 상으로 학부모들에게 상담을 예약받고, 상담 내역을 기반으로 유치원 정기 상담 진행합니다.
  - **백트래킹 알고리즘**을 적용시켜 상담 일정을 자동으로 조율할 수 있어요.
  - 상담 중 발생하는 폭언, 욕설 등을 감지하여 녹화본을 추출할 수 있습니다.

## 💛 주요 기술

**Backend - Spring**
- IntelliJ IDE
- SpringBoot 3.3.1
- Spring Data JPA
- Spring Security
- Spring Web
- WebSocket
- Redis
- Thumbnailator
- Swagger-annotation 2.2.22
- MySQL
- AWS S3
- Openvidu: 2.3.0

**Backend - Flask**
- face_recognition
- numpy
- dlib
- sklearn

**Frontend**
- Visual Studio Code IDE
- Node: 20.15.0
- Vite: 5.3.1
- React: 18.3.1
- Typescript: 5.2.2
- Vuex 3.4.0
- TailwindCss : 3.4.4
- zustand
- Openvidu: 2.3.0
- Kakao Map API
- WebSocket
- Three.js

**CI/CD**
- AWS EC2
- Jenkins
- Docker
- Docker Compose
- NGINX
- SSL

**Communication**
- Git(Gitlab)
- Jira
- Notion
- Mattermost
- Figma


## 프로젝트 폴더 구조
### Back-end
<details>
  <summary>펼쳐보기</summary>
  
  ```plantext
  KidsLink.
  ├───java
  │   └───com
  │   └───ssafy
  │   └───kidslink
  │   ├───application
  │   │   ├───album
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───bus
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───child
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───diary
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───document
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───image
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───imagealbum
  │   │   │    ├───domain
  │   │   │    └───repository
  │   │   ├───kindergarten
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───meeting
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───noticeboard
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───notification
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───parent
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───schedule
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   └───teacher
  │   │        ├───controller
  │   │        ├───domain
  │   │        ├───dto
  │   │        ├───mapper
  │   │        ├───repository
  │   │        └───service
  │   ├───common
  │   │   ├───controller
  │   │   ├───dto
  │   │   ├───enums
  │   │   ├───exception
  │   │   ├───jwt
  │   │   ├───oauth2
  │   │   ├───redis
  │   │   ├───repository
  │   │   ├───security
  │   │   ├───service
  │   │   ├───storage
  │   │   ├───util
  │   │   └───websocket
  │   └───config
  └───resources
      └───static
          └───profiles
  ```
</details>

### Front-end
<details>
<summary>펼쳐보기</summary>

```plantext
KidsLink.
  ├───node_modules
  ├───public
  ├───api
  │   └───token
  ├───assets
  │   ├───common
  │   ├───join
  │   ├───parent
  │   │   ├───emoji
  │   │   └───meeting
  │   └───teacher
  ├───components
  │   ├───common
  │   ├───join
  │   │   └───form
  │   ├───login
  │   ├───meeting
  │   ├───openvidu
  │   ├───parent
  │   │   ├───album
  │   │   ├───bus
  │   │   ├───common
  │   │   ├───document
  │   │   ├───growth
  │   │   ├───main
  │   │   ├───meeting
  │   │   └───notice
  │   └───teacher
  │       ├───album
  │       ├───bus
  │       ├───common
  │       ├───consulting
  │       ├───document
  │       ├───growth
  │       ├───main
  │       ├───notice
  │       ├───ourclass
  │       ├───schedule
  │       └───support
  ├───hooks
  │   └───teacher
  ├───layouts
  ├───pages
  │   ├───common
  │   ├───parent
  │   └───teacher
  ├───stores
  ├───types
  └───utils
      ├───parent
      └───teacher
```
</details>

## 팀원 소개
| ![김범수](https://avatars.githubusercontent.com/u/121588874?&v=4) | ![이상민](https://avatars.githubusercontent.com/u/134148399?v=4) | ![김지원](https://avatars.githubusercontent.com/u/102503653?v=4) | ![김민선](https://avatars.githubusercontent.com/u/76653033?v=4) | ![김여준](https://avatars.githubusercontent.com/u/151982401?v=4) | ![정현수](https://avatars.githubusercontent.com/u/109744927?v=4) |
|---------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| 김범수([@Kimbumsoo99](https://github.com/Kimbumsoo99)) | 이상민([@sangmin0806](https://github.com/sangmin0806)) | 김지원([@wonxxikim](https://github.com/wonxxikim)) | 김민선([@minseonkkim](https://github.com/minseonkkim)) | 김여준([@junjunclub](https://github.com/junjunclub)) | 정현수([@surina125](https://github.com/surina125)) |
| Leader / Back End | Back End | Back End | Front End | Front End | Front End |

## 협업 방식

- Git
  - [브랜치 전략 🔗](https://topaz-planet-38b.notion.site/Commit-branch-conventions-0218d4baf6c14dd992c6e39b914df28f)
  - MR시, 팀원이 코드리뷰를 진행하고 피드백 게시
- JIRA
  - 작업 단위에 따라 `Epic-Story-Task` 분류
  - 매주 목표량을 설정하여 Sprint 진행
  - 업무의 할당량을 정하여 Story Point를 설정하고, In-Progress -> Done 순으로 작업  
- 회의
  - 데일리 스크럼 10시 전날 목표 달성량과 당일 업무 브리핑
  - 문제 상황 1시간 이상 지속 시 MatterMost 메신저를 활용한 공유 및 도움 요청
- Notion
  - 회의록 기록하여 보관
  - 컨벤션, 트러블 슈팅, 개발 산출물 관리
  - GANTT CHART 관리

## 프로젝트 산출물
- [요구사항명세서](./docs/요구사항명세서.md)
- [기능명세서](./docs/기능명세서.md)
- [와이어프레임](./docs/와이어프레임.md)
- [API명세서](./docs/API명세서.md)
- [ERD](./docs/ERD.md)
- [목업](./docs/목업.md)
- [아키텍처](./docs/아키텍처.md)

## 프로젝트 결과물
- [포팅메뉴얼](./docs/assets/pdf/포팅_메뉴얼.pdf)
- [중간발표자료](http://www.kidslink.xyz)
- [최종발표자료](http://www.kidslink.xyz)