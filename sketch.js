// 화면 상태 ('LOGIN', 'SIGNUP_STEP1', 'SIGNUP_STEP2', 'MAIN')
let currentScreen = 'LOGIN';

// 사용자 정보 저장 (학번을 ID로 사용)
let users = {}; 
let loggedInUser = '';
let tempVerifiedId = ''; // 인증된 학번 임시 저장

// UI 엘리먼트 변수
let loginIdInput, loginPwInput;
let loginBtn, goToSignupBtn;

let signupIdInput, verifyStudentBtn, backToLoginBtn;
let signupPwInput, signupFinalBtn, backToStep1Btn;

let logoutBtn;
let rentalBtns = [];

// 형남공학관 대여 장소 데이터
let locations = [
  { name: '형남공학관 지하 1층', available: 5, total: 5 },
  { name: '형남공학관 1층', available: 3, total: 5 },
  { name: '형남공학관 2층', available: 2, total: 5 }
];

let rentedLocationIndex = -1;

function setup() {
  // 브라우저 전체 화면 크기로 캔버스 생성
  createCanvas(windowWidth, windowHeight);
  
  // 1. 로그인 화면 UI
  loginIdInput = createInput('').attribute('placeholder', '학번 입력');
  loginPwInput = createInput('', 'password').attribute('placeholder', '비밀번호');
  loginBtn = createButton('로그인');
  loginBtn.mousePressed(handleLogin);
  goToSignupBtn = createButton('회원가입하러 가기');
  goToSignupBtn.mousePressed(() => switchScreen('SIGNUP_STEP1'));

  // 2. 회원가입 1단계 (학번 및 학생증 인증) UI
  signupIdInput = createInput('').attribute('placeholder', '학번 입력 (예: 20261234)');
  verifyStudentBtn = createButton('학생증 인증하기');
  verifyStudentBtn.mousePressed(handleStudentVerification);
  backToLoginBtn = createButton('로그인 화면으로');
  backToLoginBtn.mousePressed(() => switchScreen('LOGIN'));

  // 3. 회원가입 2단계 (비밀번호 설정) UI
  signupPwInput = createInput('', 'password').attribute('placeholder', '사용할 비밀번호 입력');
  signupFinalBtn = createButton('회원가입 완료');
  signupFinalBtn.mousePressed(handleSignupComplete);
  backToStep1Btn = createButton('이전으로');
  backToStep1Btn.mousePressed(() => switchScreen('SIGNUP_STEP1'));

  // 4. 메인 (우산 대여) 화면 UI
  logoutBtn = createButton('로그아웃');
  logoutBtn.mousePressed(handleLogout);

  for (let i = 0; i < locations.length; i++) {
    let btn = createButton('대여하기');
    let index = i;
    btn.mousePressed(() => handleRental(index));
    rentalBtns.push(btn);
  }

  // 초기 화면 설정
  switchScreen('LOGIN');
}

function draw() {
  background(245, 247, 250);

  // 화면별 안내 문구 렌더링 (반응형 중앙 정렬 기준)
  let cx = width / 2;

  if (currentScreen === 'LOGIN') {
    drawBoxTitle(cx, '우산 대여 시스템 - 로그인');
  } else if (currentScreen === 'SIGNUP_STEP1') {
    drawBoxTitle(cx, '회원가입 [1단계] - 학생증 인증');
  } else if (currentScreen === 'SIGNUP_STEP2') {
    drawBoxTitle(cx, '회원가입 [2단계] - 비밀번호 설정');
  } else if (currentScreen === 'MAIN') {
    drawMainScreen();
  }
}

// 공통 타이틀 그리기
function drawBoxTitle(cx, titleText) {
  fill(30);
  textAlign(CENTER, CENTER);
  textSize(24);
  text(titleText, cx, height / 2 - 140);
}

// 브라우저 창 크기가 바뀌어도 화면 비율에 맞춰 UI 재배치
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  switchScreen(currentScreen);
}

// ==========================================
// 화면 전환 및 UI 엘리먼트 배치 제어
// ==========================================
function switchScreen(screenName) {
  currentScreen = screenName;
  let cx = width / 2;
  let cy = height / 2;

  // 모든 DOM 요소 숨기기
  loginIdInput.hide();
  loginPwInput.hide();
  loginBtn.hide();
  goToSignupBtn.hide();
  
  signupIdInput.hide();
  verifyStudentBtn.hide();
  backToLoginBtn.hide();

  signupPwInput.hide();
  signupFinalBtn.hide();
  backToStep1Btn.hide();

  logoutBtn.hide();
  for (let btn of rentalBtns) {
    btn.hide();
  }

  // 현재 화면에 맞는 요소만 표시 및 위치 재조정
  if (screenName === 'LOGIN') {
    loginIdInput.position(cx - 100, cy - 80);
    loginPwInput.position(cx - 100, cy - 40);
    loginBtn.position(cx - 100, cy + 5);
    loginBtn.size(200, 35);
    goToSignupBtn.position(cx - 100, cy + 45);
    goToSignupBtn.size(200, 35);

    loginIdInput.size(190, 25);
    loginPwInput.size(190, 25);

    loginIdInput.show();
    loginPwInput.show();
    loginBtn.show();
    goToSignupBtn.show();

  } else if (screenName === 'SIGNUP_STEP1') {
    signupIdInput.position(cx - 100, cy - 60);
    verifyStudentBtn.position(cx - 100, cy - 15);
    verifyStudentBtn.size(200, 35);
    backToLoginBtn.position(cx - 100, cy + 25);
    backToLoginBtn.size(200, 35);

    signupIdInput.size(190, 25);

    signupIdInput.show();
    verifyStudentBtn.show();
    backToLoginBtn.show();

  } else if (screenName === 'SIGNUP_STEP2') {
    signupPwInput.position(cx - 100, cy - 60);
    signupFinalBtn.position(cx - 100, cy - 15);
    signupFinalBtn.size(200, 35);
    backToStep1Btn.position(cx - 100, cy + 25);
    backToStep1Btn.size(200, 35);

    signupPwInput.size(190, 25);

    signupPwInput.show();
    signupFinalBtn.show();
    backToStep1Btn.show();

  } else if (screenName === 'MAIN') {
    logoutBtn.position(width - 110, 30);
    logoutBtn.size(80, 30);
    logoutBtn.show();

    for (let i = 0; i < rentalBtns.length; i++) {
      let boxY = cy - 60 + i * 85;
      rentalBtns[i].position(cx + 120, boxY + 15);
      rentalBtns[i].size(90, 35);
      
      if (rentedLocationIndex === -1) {
        rentalBtns[i].html('대여하기');
        rentalBtns[i].show();
      } else if (rentedLocationIndex === i) {
        rentalBtns[i].html('반납하기');
        rentalBtns[i].show();
      } else {
        rentalBtns[i].hide();
      }
    }
  }
}

// 메인 화면 그리기 (반응형 카드 리스트 스타일)
function drawMainScreen() {
  let cx = width / 2;
  let cy = height / 2;

  fill(30);
  textAlign(LEFT, CENTER);
  textSize(16);
  text(`환영합니다, ${loggedInUser}님!`, 40, 40);

  textAlign(CENTER, CENTER);
  textSize(22);
  text('형남공학관 우산 대여소 목록', cx, cy - 130);

  for (let i = 0; i < locations.length; i++) {
    let loc = locations[i];
    let boxY = cy - 60 + i * 85;

    // 대여소 카드 배경
    fill(255);
    stroke(210, 215, 225);
    strokeWeight(1);
    rect(cx - 220, boxY, 440, 65, 8);

    noStroke();
    fill(40);
    textAlign(LEFT, CENTER);
    textSize(16);
    text(loc.name, cx - 200, boxY + 32);

    textSize(14);
    fill(100);
    text(`잔여 수량: ${loc.available} / ${loc.total}`, cx - 40, boxY + 32);
  }

  // 안내 메시지
  fill(70);
  textAlign(CENTER, CENTER);
  textSize(14);
  if (rentedLocationIndex !== -1) {
    text(`현재 [${locations[rentedLocationIndex].name}]에서 우산을 대여 중입니다.`, cx, cy + 185);
  } else {
    text('원하시는 대여소의 버튼을 눌러 우산을 대여하세요.', cx, cy + 185);
  }
}

// ==========================================
// 로직 및 이벤트 핸들러
// ==========================================

// 1단계: 학번 인증 처리
function handleStudentVerification() {
  let id = signupIdInput.value().trim();

  if (id === '') {
    alert('학번을 입력해주세요.');
    return;
  }

  if (users[id]) {
    alert('이미 가입된 학번입니다. 로그인해주세요.');
    switchScreen('LOGIN');
    return;
  }

  // (모의 인증 과정) 실제 구현 시 학생증 이미지 업로드나 API 연동 검증 로직이 들어갈 수 있는 자리입니다.
  let isVerified = confirm(`입력하신 학번 [ ${id} ]이(가) 맞습니까?\n[확인]을 누르면 학생증 인증이 완료됩니다.`);
  
  if (isVerified) {
    tempVerifiedId = id; // 인증된 학번 임시 저장
    alert('학생증 인증이 성공적으로 완료되었습니다! 비밀번호를 설정해주세요.');
    signupIdInput.value('');
    switchScreen('SIGNUP_STEP2');
  }
}

// 2단계: 비밀번호 설정 후 회원가입 완료
function handleSignupComplete() {
  let pw = signupPwInput.value().trim();

  if (pw === '') {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  // 회원 정보 등록
  users[tempVerifiedId] = pw;
  alert(`회원가입이 완료되었습니다!\n인증된 학번: ${tempVerifiedId}`);
  
  signupPwInput.value('');
  tempVerifiedId = '';
  switchScreen('LOGIN');
}

// 로그인 처리
function handleLogin() {
  let id = loginIdInput.value().trim();
  let pw = loginPwInput.value().trim();

  if (users[id] && users[id] === pw) {
    loggedInUser = id;
    loginIdInput.value('');
    loginPwInput.value('');
    switchScreen('MAIN');
  } else {
    alert('학번 또는 비밀번호가 일치하지 않습니다.');
  }
}

// 로그아웃
function handleLogout() {
  loggedInUser = '';
  rentedLocationIndex = -1;
  switchScreen('LOGIN');
}

// 대여 / 반납 처리
function handleRental(index) {
  if (rentedLocationIndex === -1) {
    if (locations[index].available > 0) {
      locations[index].available -= 1;
      rentedLocationIndex = index;
      alert(`${locations[index].name}에서 우산을 대여했습니다.`);
    } else {
      alert('현재 남은 우산이 없습니다.');
    }
  } else if (rentedLocationIndex === index) {
    locations[index].available += 1;
    rentedLocationIndex = -1;
    alert(`${locations[index].name}에 우산을 반납했습니다.`);
  }

  switchScreen('MAIN');
}