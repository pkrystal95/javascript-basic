# 나만의 🍎사과게임🎮 만들기

참고한 게임 : https://www.gamesaien.com/game/fruit_box_a/

간단한 JavaScript 연습용 게임 프로젝트입니다.  
타이머, 드래그 선택, 점수판 기능 등을 구현하며 JS DOM 조작과 이벤트 핸들링을 연습할 수 있습니다.

## [PREVIEW]
![ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/bbefa717-43a9-4bfb-865d-70f5469f25ae)

## [기능]
- ⏰ **타이머 기능**: 제한 시간 내 점수 획득
- 🎯 **드래그 선택**: 마우스로 드래그하여 아이템 선택
- 🏆 **점수판**: 점수 실시간 표시 및 최종 점수 모달
- 🔄 **게임 재시작**: 게임 종료 후 다시 시작 가능

## [실행 방법]
```bash
# 레포 클론
git clone git@github.com-pkrystal95/javascript-basic.git

# 프로젝트 폴더 이동
cd javascript-basic
```

브라우저에서 `index.html` 열기

## [프로젝트 구조]
```bash
javascript-basic/
│
├─ index.html       # 메인 HTML
├─ style.css        # 스타일
├─ script.js        # JS 로직
├─ README.md        # 프로젝트 설명
└─ screenshot-game.png # 게임 화면 예시 이미지
```

## [회고]
1. 타이머 문제
처음에는 seconds++를 사용하여 1초 단위로 증가시키는 방식으로 타이머를 구현했지만,
시작 시 1초 멈추고 종료 시 1초 빨리 끝나는 느낌이 있었습니다.
원인은 setInterval과 남은 시간 계산 순서 때문이었습니다.

> 해결:
remaining 변수를 사용하여 남은 시간을 직접 감소시키고,
종료 체크를 remaining < 0으로 변경하여 0초까지 정확히 표시되도록 수정했습니다.
추가로 Date.now() 기반 경과 시간 계산으로 브라우저 지연 문제까지 해결할 수 있었습니다.

2. 다시 시작 기능 구현
기존 타이머를 재사용하면, 다시 시작할 때 이전 상태가 남아 푸시되지 않거나 UI가 꼬이는 문제가 있었습니다.

> 해결:
setInterval을 새로 생성할 때 기존 타이머를 clearInterval(timer)로 제거
remaining과 UI 요소를 초기화하여 매번 깔끔하게 시작
