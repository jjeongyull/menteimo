
const header_html = `        
<!-- 헤더 로고, 로그인버튼 -->
<div class="addit-gnb">
    <div class="addit-inner addit-flex-inner">
        <img class="addit-main-logo" src="img/menlogo.png" alt="멘테이모 로고">
        <a class="addit-btn-login" id="btn_login_popup_open" href="javascript:void(0);">로그인</a>
        <a class="addit-btn-login" id="btn_logout" href="javascript:void(0);">로그아웃</a>
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

const footer_html = `        
<p>서울시 강남구 봉은사로 321 대화빌딩 3층 애드아이티</p>
<p>TEL. 02-6012-0007</p>
<p>개인정보처리방침 | COPYRIGHTⓒ Addit INC. All right reserved</p>`;
 

const Data_Per_Page_Count = 2;     // 한 화면에 출력될 데이터 갯수
const Per_Page_Count = 5;           // 한 화면에 출력될 페이지 갯수