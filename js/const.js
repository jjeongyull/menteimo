
const HEADER_HTML = `        
<!-- 헤더 로고, 로그인버튼 -->
<div class="addit-gnb">
    <div class="addit-inner addit-flex-inner">
        <a href="index.html"><img class="addit-main-logo" src="img/menlogo.png" alt="멘테이모 로고"></a>
        <div class="addit-flex-inner3">
            <a class="addit-btn-login" id="btn_login_popup_open" href="javascript:void(0);">관리자모드</a>
            <a class="addit-btn-login div-before-login" id="btn_signIn_popup_open" href="javascript:void(0);">회원가입</a>
            <a class="addit-btn-login" id="btn_logout" href="javascript:void(0);">로그아웃</a>
            <a class="div-after-login-2 addit-signIn-alarm" id="btn_alarm_popup" href="javascript:void(0);"><i class="fa-solid fa-bell"></i></a>
        </div>
    </div>
</div>
<!-- 배너 이미지 및 텍스트 -->
<div class="addit-inner addit-flex-inner">
    <div class="addit-banner-inner-text">
        <h1>요기는 멘탈테스트 이벤트모음</h1>
        <p>다양한 이벤트를 모아! 저 세상 텐션을 모아!
            애드아이티가 모아놓은 꿀잼테스트</p>
    </div>
    <img class="addit-banner-phone-img" src="img/banner_phone_img.png" alt="">
</div>
`;

const FOOTER_HTML = `        
<p>서울시 강남구 봉은사로 321 대화빌딩 3층 애드아이티</p>
<p>TEL. 02-6012-0007</p>
<a class="addit-a-1" href="http://additdev.iptime.org:8000/test/privacy/privacy.html">개인정보처리방침</a>
<span>|</span>
<a class="addit-a-1" href="http://additdev.iptime.org:8000/test/privacy/privacyEmail.html">이메일무단수집거부</a>
<p> COPYRIGHTⓒ Addit INC. All right reserved</p>`;
 
const LOGIN_HTML = `
<div class="addit-login-popup-inner">
            <div class="addit-login-top">
                <img src="img/menlogo.png" alt="멘테이모 로고">
                <div class="addit-login-popup-close"><i id="btn_login_popup_close" class="fa-solid fa-xmark"></i></div>
            </div>
            <input class="addit-input-text" type="text" id="txt_login_id" placeholder="아이디를 입력하세요.">
            <input class="addit-input-text" type="password" id="txt_login_password" placeholder="비밀번호를 입력하세요.">
            <div class="addit-id-remember-area"><input type="checkbox" id="check_id_remember"><label for="id_remember">아이디 저장</label></div>
            <div class="addit-login-popup-btn">
                <button class="addit-login-btn" id="btn_login">로그인</button>
                <button class="addit-reset-pw" id="btn_reset_password">비밀번호 초기화</button>
            </div>
        </div>
`
const SIGNIN_HTML = ` <div class="addit-signIn-popup">
                            <h1 class="addit-h1-1">회원가입</h1>
                            <div class="addit-signIn-inner">
                                <label class="addit-label-1" for="customer_name">고객사</label>
                                <input class="addit-input-type1 addit-input-width-1" type="text" maxlength="200" id="customer_name">
                            </div>
                            <div class="addit-signIn-inner">
                                <label class="addit-label-1" for="signIn_name">이름</label>
                                <input class="addit-input-type1 addit-input-width-1" type="text" maxlength="200" id="signIn_name">
                            </div>
                            <div class="addit-signIn-inner">
                                <label class="addit-label-1" for="signIn_position">직책</label>
                                <input class="addit-input-type1 addit-input-width-1" type="text" maxlength="200" id="signIn_position">
                            </div>
                            <div class="addit-signIn-inner">
                                <label class="addit-label-1" for="signIn_email">이메일</label>
                                <input class="addit-input-type1 addit-input-width-1" type="text" maxlength="200" id="signIn_email">
                            </div>
                            <div class="addit-signIn-inner">
                                <label class="addit-label-1" for="signIn_id">아이디</label>
                                <input class="addit-input-type1 addit-input-width-1" type="text" maxlength="200" id="signIn_id">
                            </div>
                            <div class="addit-signIn-inner">
                                <label class="addit-label-1" for="signIn_pw">비밀번호</label>
                                <input class="addit-input-type1 addit-input-width-1" type="text" maxlength="200" id="signIn_pw">
                            </div>
                            <div class="addit-signIn-inner">
                                <label class="addit-label-1" for="signIn_pw_check">비밀번호 확인</label>
                                <input class="addit-input-type1 addit-input-width-1" type="text" maxlength="200" id="signIn_pw_check">
                            </div>
                            <div class="addit-signIn-inner">
                                <label class="addit-label-1" for="chk_signIn_agreed">개인정보이용동의</label>
                                <input class="addit-input-type1" type="checkbox" id="chk_signIn_agreed">
                            </div>
                            <div class="addit-btn-box">
                                <button class="addit-signIn-btn" id="btn_signIn">가입신청</button>
                                <button class="addit-signIn-close-btn" id="btn_signIn_popup_close">닫기</button>
                            </div>
                        </div>`;

                        
const Data_Per_Page_Count = 10;         // 한 화면에 출력될 데이터 갯수
const MAX_Data_Per_Page_Count = 5000;   // 한 화면에 출력될 데이터 갯수
const Per_Page_Count = 5;               // 한 화면에 출력될 페이지 갯수
let G_NOWPAGE = 1;                      // 현재 페이지 정보 (파라미터로 전달 받는다, nowpage)

// JSON 구조체 상수명
/*
 주의 : event_plus.html 내의 입력 인터페이스 정적 생성 ID 변경 및 추가 시 
        상수명도 동일하게 변경
*/
let baseinfo_eventid = "eventid";
let baseinfo_customerid = "customerid";
let baseinfo_mainimage = "mainimage";
let baseinfo_event_start_date = "event_start_date";
let baseinfo_event_end_date = "event_end_date";
let baseinfo_event_title = 'event_title';
let baseinfo_event_description = 'event_description';
let baseinfo_Notice = "Notice";               // 배열
let baseinfo_bgColor = "bgColor";
let baseinfo_bgColor_End = "bgColor_End";
let baseinfo_fontSize = "fontSize";

let baseinfo_sns_share = "sns_share";         // JSON
let baseinfo_sns_share_kakao = "kakao_sns_share";
let baseinfo_sns_share_facebook = "facebook_sns_share";
let baseinfo_sns_share_blog = "blog_sns_share";
let baseinfo_sns_share_band = "band_sns_share";
let baseinfo_sns_share_instagram = "instagram_sns_share";
// sns 공유 메타정보 
let baseinfo_sns_share_title = "ogtitle";         // JSON
let baseinfo_sns_share_description = "ogdescription";         // JSON
let baseinfo_sns_share_imageurl = "ogogimage";         // JSON

let baseinfo_sns_friend = "sns_friend";       // JSON
let baseinfo_sns_friend_kakao = "kakao_sns_friend";
let baseinfo_sns_friend_facebook = "facebook_sns_friend";
let baseinfo_sns_friend_blog = "blog_sns_friend";
let baseinfo_sns_friend_band = "band_sns_friend";
let baseinfo_sns_friend_instagram = "instagram_sns_friend";
// 트위터 추가
let baseinfo_sns_friend_twiter = "twiter_sns_friend";
let baseinfo_sns_friend_youtube = "youtube_sns_friend";

// 유튜브 아이디 추가
let baseinfo_youtube_id = "youtube_id";

let QuizPreInfo_linkType = "prelinkType";
let QuizPreInfo_preInfoLink = "preInfoLink";

let QuizInfo_type = "quizType";                           // 퀴즈 유형 (객관식 0, 주관식 1)
let QuizInfo_quizTitle = "quizTitle";
let QuizInfo_quizAns = "quizAns";
let QuizInfo_quizAnsType = "quizAnsType";                 // Text,단일선택 : 0, TextArea,다중선택 : 1
let QuizInfo_quizInfoType = "quizInfoType";               // 문제 정보 (이미지, 비디오)
let QuizInfo_quizInfoFileName = "quizInfoFileName";   
let QuizInfo_hint = "hint";
let QuizInfo_subVal = "subVal";                                  // 배열, 문제 보기, 세부는 JSON 구조
let QuizInfo_subVal_type = "viewType";                           // 보기 유형 (텍스트, 이미지)
let QuizInfo_subVal_data = "viewData";                           // 배열, 문제 보기

let shot_type = "shotType";                               // 구독인증샷 0, 댓글인증샷 1
let shot_title = "shotTitle";                               // 샷 링크를 출력할 타이틀
let shot_shotUrl = "shotUrl";                             // 구독인증샷일 경우 유튜브 링크

let privacy_name = "privacy_name";
let privacy_phone = "privacy_phone";
let privacy_email = "privacy_email";
let privacy_address = "privacy_address";
let privacy_customer = "privacy_customer";

//sns 뷰 관련 id고정값
let sns_view_type = "snsViewType"

//2023.05.15 파일 다운로드 id 고정값
let file_down_type = "fileDownType"

var uploadfileList = [];

var ResultList = [];        // 정답 체크를 위한 ID리스트

// 퀴즈 개수 배열
let Problem_Array = [];

// TextArea 글자 입력 수 제한
const MAX_INPUT_LENGTH = 200;

// 사용자 접근 경로 저장
let inpath_Array = [0,0,0,0,0];    // 첫번째부터 페이스북, 블로그, 인스타그램, 애드아이티, 기타
let inpathChart = Object();        // 유입 관련 차트 변수
let analyzeChart = Object();
let dataChart = Object();


let chart_label_array = [];
let chart_data_array = [];

let g_event_title = "";
let g_total_result_count = 0;

// 2023.02.23 정용재
// 임의 버튼 추가
// 임의 버튼 값
let webzine_chk = "webzine_chk";
let webzine_url = "webzine_url";
let webzine_img = "webzine_img";

// ox퀴즈 결과페이지 개수 배열
let rPage_Array = [];
let baseinfo_OImg = "oimage";
let baseinfo_XImg = "ximage";
let Quiz_img = "ox_quiz_img";
let Quiz_Title = "ox_quiz_title";
let Quiz_Score = "ox_quiz_score";
let Quiz_Answer = "ox_answer";
let Quiz_Desc = "ox_answer_desc";
let result_img = "ox_result_img";
let result_text = "result_text";
let result_score = "result_score";

// ox퀴즈 슬라이드 내용
// let slide_content_count = "";
// 유저 스코어 배열
let user_score = [];

// ox퀴즈 결과페이지 새창 띄우는 url
let oxQuizeUrl = "";

// 이벤트 날짜 값
let event_start_day = "";
let event_end_day = "";

// 유튜브
let Youtube_ko = "";

// 테스트 모드를 위해
let g_debug = "0";

