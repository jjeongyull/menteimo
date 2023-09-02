// desc : 관리자페이지 질문리스트 뷰 (정용재 | 2022-02-21)
//  pColor : color 헥사 코드 
$(document).on("click", "#btn_list_more" ,function(){
    $(".addit-quiz-list-div").addClass('active')
});
$(document).on("click", ".btn-list-prev" ,function(){
    $(".addit-quiz-list-div").removeClass('active')
});

// desc 정용재 2023-02-22 / 질문리스트 팝업
// 결과페이지 질문 리스트 클릭시 -> 차트보기 버튼 클릭시 

$(document).on('click', ".btn-addit-quiz-list", function(){
  $("#quiz_list_popup").fadeIn();
  $( "#quiz_list_popup" ).draggable();
});

$(document).on('click', "#quiz_list_popup_close", function(){
  $("#quiz_list_popup").fadeOut();
});

// desc 정용재 2023-02-22 / 텍스트리스트 팝업
// 사용자 입력값보기 클릭시 나오는 팝업
$(document).on('click', ".btn-addit-quiz-text", function(){
  $("#quiz_text_list_popup").fadeIn();
  $( "#quiz_text_list_popup" ).draggable();
});
$(document).on('click', "#quiz_text_list_popup_close", function(){
  $("#quiz_text_list_popup").fadeOut();
});

// desc 정용재 2023-02-21 / 인입률 보기 팝업
// 인입률 보기 버튼 클릭시 
$(document).on('click', "#btn_result_inpath", function(){
  $("#lending_popup").fadeIn();
  $( "#lending_popup" ).draggable();
  // chart 데이터를 그린다.
  var labelsArray = ['facebook', 'blog', 'instagram', 'menteimo', 'etc'];
  draw_chart(inpathChart, labelsArray, inpath_Array, '# 사용자 유입 경로', '사용자 유입 경로 분석');
  // 표를 그린다.
  draw_inpath_table('#sns_lending_view');
});
$(document).on('click', "#lending_popup_close", function(){
  $("#lending_popup").fadeOut();
});


// 긴글 입력 시 글자 수 제한 및 특수문자 입력 방지
$(document).on('keyup', 'textarea', function() {
    var tmpID = $(this).attr('id');
    if (tmpID != 'privacy_customer'){             // 사용자 입력값이 아닐 경우 (고객사 개인정보보호 입력값은 예외)
      chkChar(this);
      var tmp = $(this).val();
      if (tmp.length > MAX_INPUT_LENGTH){
          alert(MAX_INPUT_LENGTH + '자 이내로 작성하셔야 합니다.');
          $(this).val(tmp.substring(0, MAX_INPUT_LENGTH-1));
      }
    }
});

// 유의사항 체크박스 클릭
$(document).on("click", "#checkbox_event_info" ,function(){
    var bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, "#event_info_count", "disabled");
    toggelCheckBox(bchecked, "#btn_event_info_count", "disabled");
    if (bchecked){
        $('#event_info_count').focus();
        setElementCSS('#div_event_info_text', 'display', 'block');
    }
    else{
        setElementCSS('#div_event_info_text', 'display', 'none');
    }
});

// 웹진 바로가기 체크박스 클릭
$(document).on("click", "#btn_npbs_plus" ,function(){
    var bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, "#npbs_url", "disabled");
    toggelCheckBox(bchecked, "#webzine_img", "disabled");
});

// 사전정보 체크박스 클릭
$(document).on("click", "#checkbox_event_prev_info" ,function(){
    var bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, "#event_prev_info_count", "disabled");
    toggelCheckBox(bchecked, "#btn_event_prev_info_count", "disabled");
    if (bchecked){
        $('#event_prev_info_count').focus();
        setElementCSS('#div_event_prev_info_text', 'display', 'block');
    }
    else{
        setElementCSS('#div_event_prev_info_text', 'display', 'none');
    }
});

// 인증샷 체크박스 클릭
$(document).on("click", "#checkbox_shot" ,function(){
    var bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, "#shot_count", "disabled");
    toggelCheckBox(bchecked, "#btn_shot_count", "disabled");
    if (bchecked){
        $('#shot_count').focus();
        setElementCSS('#shot_list_print', 'display', 'block');
    }
    else{
        setElementCSS('#shot_list_print', 'display', 'none');
    }
});

// 퀴즈정보 체크박스 클릭
$(document).on("click", ".checkbox_quiz_pinfo" ,function(){
    var bchecked = $(this).is(":checked");
    var targetDiv = $(this).parent().siblings();
    if (bchecked){
        setElementCSS(targetDiv, 'display', 'flex');
    }
    else{
        setElementCSS(targetDiv, 'display', 'none');
    }
});

// 배경색상 checkbox 선택
$(document).on("click", "#checkbox_gradient" ,function(){
    var bchecked = $(this).is(":checked");
    var targetDiv = "#bgColor_End";
    if (bchecked){
        setElementCSS(targetDiv, 'display', 'inline-block');
    }
    else{
        setElementCSS(targetDiv, 'display', 'none');
    }
});

// 고객사방침추가
$(document).on("click", "#checkbox_privacy_customer" ,function(){
    if ($(this).is(':checked'))
      setElementCSS(rtnIDString(privacy_customer), 'display', 'block');
    else
      setElementCSS(rtnIDString(privacy_customer), 'display', 'none');
});

// SNS 공유 체크박스 클릭
/*
$(document).on("click", "#checkbox_share_kakao_url" ,function(key){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});
$(document).on("click", "#checkbox_share_facebook_url" ,function(key){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});
$(document).on("click", "#checkbox_share_blog_url" ,function(key){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});
$(document).on("click", "#checkbox_share_band_url" ,function(key){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});
$(document).on("click", "#checkbox_share_instagram_url" ,function(key){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});
*/

// SNS 친구 체크박스 클릭
$(document).on("click", "#checkbox_friend_kakao_url" ,function(){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});
$(document).on("click", "#checkbox_friend_facebook_url" ,function(){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});
$(document).on("click", "#checkbox_friend_blog_url" ,function(){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});
$(document).on("click", "#checkbox_friend_band_url" ,function(){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});
$(document).on("click", "#checkbox_friend_instagram_url" ,function(){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});
$(document).on("click", "#checkbox_friend_youtube_url" ,function(){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, $(this).parent().siblings(), "disabled");
    $(this).parent().siblings().focus();
});


// 사전정보 체크박스 클릭
$(document).on("click", "#checkbox_event_prev_info" ,function(){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, "#event_prev_info_count", "disabled");
    $('#event_prev_info_count').focus();
});

// 인증샷 체크박스 클릭
$(document).on("click", "#checkbox_shot" ,function(){
    bchecked = $(this).is(":checked");
    toggelCheckBox(bchecked, "#shot_count", "disabled");
    $('#shot_count').focus();
});

// 인증샷 체크박스 클릭
$(document).on("click", "#btn_event_list" ,function(){
    goToPage('index.html', '');
});



// 엔터키를 누르는 효과
$(document).on("keydown", "#txt_login_id" ,function(key){
    if(key.keyCode === 13) {
        $('#btn_login').trigger('click');
    }
});
$(document).on("keydown", "#txt_login_password" ,function(key){
    if(key.keyCode === 13) {
        $('#btn_login').trigger('click');
    }
});

//로그인 팝업 버튼 클릭
$(document).on('click', '#btn_login_popup_open', function(){
    posY = $(window).scrollTop();
    $("#login_popup").fadeIn();
    $("html, body").addClass("not_scroll");
    $("#txt_login_id").focus();
});

//로그인 팝업창 닫기 버튼 클릭
$(document).on('click', '#btn_login_popup_close', function(){

    $("#login_popup").fadeOut();
    $("html, body").removeClass("not_scroll");
    posY = $(window).scrollTop();
});

//로그아웃 버튼 클릭
$(document).on('click', '#btn_logout', function(){
    setCookie("login", "", 1);
    deleteCookie("login", "");
    ToggleLoginDiv(false);
    goToPage("logout.php", "");
    goToPage("index.html", "");
});

//고객사추가 팝업
$(document).on('click', '#btn_customer_popup_open', function(){
    $("#customer_popup").fadeIn();
    posY = $(window).scrollTop();
    $("html, body").addClass("not_scroll");
})

//고객사추가 팝업 닫기
$(document).on('click', '#btn_customer_popup_close', function(){
    $("#customer_popup").fadeOut();
    posY = $(window).scrollTop();
    $("html, body").removeClass("not_scroll");
})

//종료이벤트 버튼 클릭시
$(document).on('click', '#btn-event-list-end', function(){
    $('#btn-event-list-all').removeClass('active');
    $(this).addClass('active');
})

//전체 버튼 클릭시
$(document).on('click', '#btn-event-list-all', function(){
    $('#btn-event-list-end').removeClass('active');
    $(this).addClass('active');
})

// 로그인 버튼 클릭
$(document).on('click', "#btn_login", function(){
  var login_id = TrimData('#txt_login_id');
  var login_password = TrimData('#txt_login_password');
  if (isEmptyToFocus(login_id, '아이디를 입력하세요.', '#txt_login_id', 0)){
     return;
  }    
  if (isEmptyToFocus(login_password, '패스워드를 입력하세요.', '#txt_login_password', 0)){
    return;
  } 

  params = {};
  params.cmd = "login";
  params.login_id = login_id;
  params.login_password = login_password;

  if (send_paramdata(params) === 'success' ){
    setCookie("login", "logined", 1);
    ToggleLoginDiv(true);
    alert('로그인 성공');
  }else{
    alert('로그인 실패');
    $('#txt_login_id').focus();
  }
});

// 비밀번호 초기화 클릭
$(document).on('click', "#btn_reset_password", function(){
    var login_id = TrimData('#txt_login_id');
    if (isEmptyToFocus(login_id, '아이디를 입력하세요.', '#txt_login_id', 0)){
        return;
    }      
    if (!confirm('비밀번호를 초기화 하시겠습니까?\n\n비빌번호는 !addit2022# 으로 초기화 됩니다.')) {
        return;
    }    

    params = {};
    params.cmd = "init_password";
    params.login_id = login_id;
    send_paramdata(params);
});

// 이벤트 삭제
$(document).on('click', "#btn_event_delete", function(){
    if (!confirm('이벤트를 삭제하시겠습니까?')) {
        return;
    }    
    var e_idx = $(this).data("e_idx");
    if (isEmpty(e_idx)){
        e_idx = $('#e_idx').val();
    }
    if (isEmpty(e_idx)){
        alert('이벤트 번호가 존재하지 않습니다.');
        return;
    }
    params = {};
    params.cmd = "delete_event";
    params.e_idx = e_idx;
    alert(send_paramdata(params));
    // 이벤트 목록을 새로 고친다.
    params = {};
    params.nowpage = G_NOWPAGE;
    params.loadcount = Data_Per_Page_Count;
    params.searchtype = "";         // 검색 유형
    params.searchdata = "";         // 검색 데이터
    params.cmd = "load_event";
    global_event_list_json = load_data(params);
    draw_event_list(global_event_list_json, '#event-list', "#page_div", 1);
});

// desc : 관리자페이지 랜덤추첨 팝업 (정용재 | 2022-02-21)
//  pColor : color 헥사 코드 
// 랜덤 추첨 팝업 열기
$(document).on('click', '#btn_result_random', function(){
    $("#random_result_popup").fadeIn();
    $('#txt_random_count').focus();
    $('#txt_random_count').val(10);
});

// 랜덤 추첨하기
$(document).on('click', '#btn_result_select', function(){
  var nCount = $('#txt_random_count').val();
  if (isEmpty(nCount))
  {
    alert('추첨할 인원수를 입력하세요.');
    $('#txt_random_count').focus(); 
    return;
  }
  var randomArray = generateRandom(parseInt(nCount), global_event_result_json.tabledata.length);
  draw_random_list(global_event_result_json, randomArray, '#random_list_view');
});


// 랜덤 추첨 팝업 닫기
$(document).on('click', '#btn_result_popup_close', function(){
    $("#random_result_popup").fadeOut();
});

// 고객사 정보를 읽어온다.
$(document).on('click', "#btn_load_customer_list", function(){
  goToPage('customer_list',"")
});

// 이벤트 추가 버튼
$(document).on('click', "#btn_event_plus", function(){
    goToPage('event_plus.html',"")
});

// OX이벤트 추가 버튼
$(document).on('click', "#btn_oxQuiz_plus", function(){
    goToPage('oxquiz_plus.html',"")
});

// 수정필요 : 클릭 이벤트 등 Action의 경우 클랙스 보다 ID를 사용할 것
//            아이디의 경우 중복이 되지 않지만 클래스는 중복으로 사용할 수 있으므로
//            실제 행위 시 퀴즈가 발생할 수 있음. (디버깅 어려움. 동일한 클래그가
//            사용된 곳에서 동일한 이벤트가 발생할 가능성 존재)
$(document).on('click', '.div-before-login', function(){
  var szIdx = $(this).data('e_idx');
  var szParam = 'e_idx=' + szIdx;
  if (!isEmpty(szIdx)){
    goToPage("eventpage.html", szParam);
  }
})

$(document).on('click', '.addit-btn-event-go', function(){
  var e_idx = $(this).data('e_idx');
  var szParam = 'e_idx=' + e_idx;
  if (!isEmpty(e_idx)){
    let params = {};
    params.cmd = "load_event";
    params.e_idx = e_idx;
    $("#e_idx").val(e_idx);
    global_evnet_json = load_data(params);
    EventGo(global_evnet_json, szParam);
  }
})

// Action : 폰트 사이즈 조절
$(document).on('click', '.button', function(){
    var $speech = $("div.speech");
    var currentSize = $speech.css("fontSize");	/* 폰트사이즈를 알아낸다. */
    var num = parseFloat(currentSize, 10);	/* parseFloat()은 숫자가 아니면 숫자가 아니라는 뜻의 NaN을 반환한다. */
    var unit = currentSize.slice(-2);	/* 끝에서부터 두자리의 문자를 가져온다. */

    if(this.id == "fontSize_up"){
        num *= 1.2;	/* num = num * 1.2 와 동일하다. */
    } else if(this.id == "fontSize_down") {
        num /= 1.2;	/* num = num / 1.2 와 동일하다. */
    }

    $speech.css("fontSize", num + unit);
});

// 퀴즈 삭제 버튼
// 퀴즈 DIV를 삭제 후 Problem_Array내에 포함된 퀴즈 Index를 삭제
$(document).on('click', '#btn_delete_problem', function(){
    // 퀴즈 인덱스를 구한다.
    if (confirm('(주의) 해당 퀴즈를 삭제하시겠습니까?')){
        var pblnum = $(this).data('pblnum');
        $(this).parent('div').remove();
        // Problem_Array내에 포함된 퀴즈 Index를 삭제한다.
        DeleteArray(pblnum, Problem_Array);
        console.log(Problem_Array);
    }
});

// 결과페이지 삭제 버튼
// 퀴즈 DIV를 삭제 후 Problem_Array내에 포함된 퀴즈 Index를 삭제
$(document).on('click', '#btn_delete_Rpage', function(){
    // 퀴즈 인덱스를 구한다.
    if (confirm('(주의) 해당 결과페이지를 삭제하시겠습니까?')){
        var rpnum = $(this).data('rpnum');
        $(this).parent('div').remove();
        // Problem_Array내에 포함된 퀴즈 Index를 삭제한다.
        DeleteArray(rpnum, rPage_Array);
        console.log(rPage_Array);
    }
});

// Action : 이벤트 참여
// Desc : 중복 참여 방지를 위해 POST로 구현
$(document).on('click', '#btn_join_event', function(){
    var e_idx = TrimData('#e_idx');
    if (isEmpty(e_idx)){
        return;
    }
    // 이벤트 참가자 정보 체크
    if ($(rtnIDString(privacy_name)).length) {
        if (isEmptyMsg(TrimData(rtnIDString(privacy_name)), "이름을 입력하세요.")){ 
            $(rtnIDString(privacy_name)).focus();
            return 
        };
    }
    if ($(rtnIDString(privacy_phone)).length) {
        if (isEmptyMsg(TrimData(rtnIDString(privacy_phone)), "연락처를 입력하세요.")){ 
            $(rtnIDString(privacy_phone)).focus();
            return 
        };
    }
    if ($(rtnIDString(privacy_email)).length) {
        if (isEmptyMsg(TrimData(rtnIDString(privacy_email)), "이메일을 입력하세요.")){ 
            $(rtnIDString(privacy_email)).focus();
            return 
        };
    }

    if (!$('#checbox_agreed').is(':checked')){
        alert('경품 발송을 위해 개인정보처리방침에 동의하셔야 합니다.');
        return;
    }

    // 결과를 전송하기 위한 JSON 구조체를 생성한다.
    /* 
        [
            // 정답에는 체크된 실제 값을 넣는다.
            {"idx":"1"}, {"answer":"실제정답"}, {"user-answer":"사용자정답"}, {"result":"정답체크값(1:정답)"},
            {"idx":"1"}, {"answer":"실제정답"}, {"user-answer":"사용자정답"}, {"result":"정답체크값(1:정답)"}
        ]
    */
    var resultArray = [];
    var nResultIdx = 0;
    var bCheckUserAnswer = true;
    var nUserScore = 0;
    for (var i=0; i<ResultList.length; i++){
        var tmpJSON = ResultList[i];
        var userAnswerJSON = {};
        $.each(tmpJSON, function(key, items){   
            // 퀴즈유형이 체크박스 유형일 경우 (모두 고르시오는 현재 처리 불가)
            if (items == "checkbox"){           
                userAnswerJSON['idx'] = String(nResultIdx + 1);
                userAnswerJSON['answer'] = tmpJSON.answer;          // 정답
                let chk_arr = []; //체크박스 정답 어레이
                var tmpIDArray = tmpJSON.id.split(',');         // chechbox 유형일 경우 아이디가 ","로 구분
                for (var i=0; i<tmpIDArray.length; i++){
                    var tmpID = rtnIDString(tmpIDArray[i]);
                    if ($(tmpID).is(':checked'))
                        chk_arr.push($(tmpID).val());
                }
                userAnswerJSON['reuslt'] = "";                  
                userAnswerJSON['user-answer'] = chk_arr;
            }else if (items == "radio"){
                userAnswerJSON['idx'] = String(nResultIdx + 1);
                userAnswerJSON['answer'] = tmpJSON.answer;          // 정답
                // TODO : ID에 해당되는 Radio 선택값 구하기 
                let radioVal = $(`input[name="${tmpJSON.id}"]:checked`).val();
                // 선택되어진 라디오 아이디 구해 Text 값을 얻어온다.
                var radiocheckedID = $(`input[name="${tmpJSON.id}"]:checked`).attr('id');
                let radioText = $("label[for='" + radiocheckedID +"']").text();
                // 정답이 공백이 아니면 결과를 구한다.
                if (!isEmpty(tmpJSON.answer)){
                    userAnswerJSON['reuslt'] = compareText(tmpJSON.answer, radioVal);
                    nUserScore = nUserScore + 1;
                }
                else{
                    userAnswerJSON['reuslt'] = "";                  
                }
                userAnswerJSON['user-answer'] = radioText;
            }else if (items == "text"){
                userAnswerJSON['idx'] = String(nResultIdx + 1);
                userAnswerJSON['answer'] = tmpJSON.answer;          // 정답
                let textVal = $(`#${tmpJSON.id}`).val();   
                // 정답이 공백이 아니면 결과를 구한다.
                if (!isEmpty(tmpJSON.answer)){
                    userAnswerJSON['reuslt'] = compareText(tmpJSON.answer, textVal);
                    nUserScore = nUserScore + 1;
                }
                else{
                    userAnswerJSON['reuslt'] = "";                  
                }
                userAnswerJSON['user-answer'] = textVal;
            }
            if (isEmpty(userAnswerJSON['user-answer'])){
                //bCheckUserAnswer = false;
                //return;
            }
        });
        if (!bCheckUserAnswer){
            //break;
        }
        nResultIdx = nResultIdx + 1;
        resultArray.push(userAnswerJSON);
    }
    if (!bCheckUserAnswer)
    {
        //alert('퀴즈 답은 반드시 입력해야 합니다.');
        //return;
    }


    //인증샷 값 받기  
    var uploadstamp = getTimeStamp();
    let shot_arr = [];
    var tmpUpload_arr = [];         // 실제 등록할 파일
    let fileCount = $(".file-count").length;
    for(var i = 0; i <fileCount; i++){
        let fileupLoad = $(`#uploadshotType${i}`).val();
        tmpUpload_arr.push(`#uploadshotType${i}`);  // 파일 관련 엘리먼트 ID
        let fileName = getFileNameExceptPath(fileupLoad);
        // 인증샷이 있을 경우 인증샷을 등록하지 않으면 return
        if (isEmpty(fileName)){
            alert('인증샷을 첨부하셔야 합니다.');
            return;
        }
        shot_arr.push(uploadstamp + '_' + fileName);
    }
    // 개인정보 값 받기
    let user_name = TrimData(rtnIDString(privacy_name));
    let user_email = TrimData(rtnIDString(privacy_email));
    let user_phone = TrimData(rtnIDString(privacy_phone));


    // 인증샷이 있을 경우 폼을 생성해 파일 전송
    var szUpload = "";
    var nUploadFileCount = tmpUpload_arr.length;
    //alert(g_inpath);
    if (nUploadFileCount > 0){
        // 사용자 인증샷을 업로드 하기 위한 폴더 - file/idx
        for (var i=0; i<nUploadFileCount; i++){
            var formData = new FormData();
            var tmpID = tmpUpload_arr[i];
            var file = $(tmpID)[0].files[0];
            formData.append("uploadfile", file);
            formData.append("uploadstamp", uploadstamp);
            formData.append("eventdir", "event_" + e_idx);
            szUpload = send_formdata(formData, false, "js/upload.php"); 
        }
        if (szUpload === "success"){
            // 결과 전송
            var pParms = {};
            pParms.cmd = "send_event_result";
            pParms.e_idx = e_idx;
            pParms.user_name = user_name;
            pParms.user_email = user_email;
            pParms.user_phone = user_phone;
            pParms.user_score = nUserScore;
	        pParms.user_inpath = g_inpath;
            pParms.shot = shot_arr.join(",");
            pParms.resultArray = JSON.stringify(resultArray);
            var sendResult = send_paramdata(pParms, false, false);
            if (sendResult === "success"){
                alert('이벤트 참가를 완료했습니다.');
            }
            else{
                alert(sendResult);
            }
        }
        else{
            alert('인증샷 등록 과정에서 오류가 발생했습니다.');
        }
    }
    else{
        // 결과 전송
        var pParms = {};
        pParms.cmd = "send_event_result";
        pParms.e_idx = e_idx;
        pParms.user_name = user_name;
        pParms.user_email = user_email;
        pParms.user_phone = user_phone;
        pParms.user_score = nUserScore;
        pParms.user_inpath = g_inpath;
        pParms.shot = shot_arr.join(",");
        pParms.resultArray = JSON.stringify(resultArray);
        var sendResult = send_paramdata(pParms, false, true);
        if (sendResult === "success"){
            $(".layer-popup").css({ visibility: " visible" , opacity : "1" });
            $(".layer-popup .popup_content").css({ display: "block" });
        }
        else{
            alert('이벤트 결과를 전송할 수 없습니다.');
        }
    }
});

$(document).on('click', ".popup-next", function(){
    $(".layer-popup").css({ visibility: " hidden" , opacity : "0" });
    $(".layer-popup .popup_content").css({ display: "none" });
});

// 답변 차트 다운로드
function downloadURI(uri, name){
    var link = document.createElement("a")
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
}
$(document).on('click', "#saveButton", function(){
    //이미지(png)로 다운로드
      html2canvas(document.querySelector('#chart_view')).then(canvas => {
          var myImage = canvas.toDataURL();
          downloadURI(myImage, "저장이미지이름.png");
    });

});

$(document).on('click', "#save2Button", function(){
    //이미지(png)로 다운로드
      html2canvas(document.querySelector('#lending_chart')).then(canvas => {
          var myImage = canvas.toDataURL();
          downloadURI(myImage, "저장이미지이름.png");
    });

});


// 페이징 클릭 - PC일 경우
$(document).on("click", ".addit-page-a", function(){
    
    var nowpage = $(this).data("page");
    var type = $(this).data("type");

    var params = {};
    params.nowpage = nowpage;
    params.loadcount = Data_Per_Page_Count;
    params.searchtype = "";         // 검색 유형
    params.searchdata = "";         // 검색 데이터

    switch(type){
        case "event":
            params.cmd = "load_event";
            global_event_list_json = load_data(params);
            // goToPage('index.html', pages)
            draw_event_list(global_event_list_json, '#event-list', "#page_div", 1);
            break;
        case "customer":
            params.cmd = "load_customer";
            global_customer_list_json = load_data(params);
            draw_customer_list(global_customer_list_json, '#all_customer_list_view', "#page_div", 1);
            break;
        default:
            break;
    }
});
  
// 페이징 클릭 - 모바일일 경우
$(document).on("click", ".paging2 a", function(){
    var nowpage = $(this).data("page");
    G_NOWPAGE = nowpage;
    var params = {};
    params.nowpage = G_NOWPAGE;
    params.loadcount = Data_Per_Page_Count;
    params.searchtype = "";         // 검색 유형
    params.searchdata = "";         // 검색 데이터
    params.cmd = "load_event";
  
    global_event_list_json = load_data(params);
    draw_event_list(global_event_list_json, '#event-list', "#page_div", 1);
});

// 유의 사항 확인 버튼 클릭
$(document).on('click', "#btn_event_info_count", function(){
    var count = parseInt(TrimData('#event_info_count'));
    if (!fn_isNumeric(count, '+')){
        alert('숫자(정수값, 양수)만 입력해야 합니다.');
        return;
    }
    DrawEventInfo(count, '#div_event_info_text');
});

//사전정보 확인 버튼 클릭
$(document).on('click', "#btn_event_prev_info_count", function(){
    var count = parseInt(TrimData('#event_prev_info_count'));
    if (!fn_isNumeric(count, '+')){
        alert('숫자(정수값, 양수)만 입력해야 합니다.');
        return;
    }
    DrawPrevInfo(count, "#div_event_prev_info_text");
});

// 인증샷 확인 버튼 클릭
$(document).on('click', "#btn_shot_count", function(){
    var count = parseInt(TrimData('#shot_count'));
    if (!fn_isNumeric(count, '+')){
        alert('숫자(정수값, 양수)만 입력해야 합니다.');
        return;
    }
    DrawShotInfo(count, "#shot_list_print");
});

// 퀴즈 갯수 버튼 클릭
$(document).on('click', "#btn_event_quiz_count", function(){
    var count = parseInt(TrimData('#event_quiz_count'));
    if (!fn_isNumeric(count, '+')){
        alert('숫자(정수값, 양수)만 입력해야 합니다.');
        return;
    }
    if (Problem_Array.length > 0){
        alert('현재 퀴즈 개수는 ' + String(Problem_Array.length) + '개 입니다.\n\n퀴즈 개수를 추가합니다.');
    }
    DrawQuizInfo(count, "#make_event_quiz_list");
});

// 보기 아이디 또는 이름은 퀴즈 번호에 따라 부여 p1_viewcount, p1_view1, p1_view2

// 퀴즈 출력 DIV 클릭 시
// 퀴즈 타입별 출력(주관식, 객관식)
$(document).on('click', '#make_event_quiz_list', function(e){
    DrawQuiz(e, '', 0);
});

// 보기 생성 버튼을 클리했을 경우
// addit-subText-btn 클래스는 보기를 위해 부여한 class
// 객관식이 2개 이상일 경우 버튼이 중복되는 퀴즈 존재
$(document).on('click', ".addit-subText-btn", function(){
    //if($(e.target).attr('class') == "addit-btn-type1 addit-subText-btn"){
    // 버튼에 지정된 정보를 구한다.
    // 퀴즈 번호를 구한다.
    var tmppoblcount = $(this).data('areanum');
    DrawView(tmppoblcount);
});

// 보기 세부 내용을 그린다. (텍스트 / 이미지 클릭 시)
$(document).on('click', ".quiz-info-type", function(){
    DrawViewSub($(this))
});

// 인증샷 Radio 선택 시
$(document).on('click', ".shot-class", function(){
    var szType = $(this).children().val();
    if (szType == "1")          // 구독인증샷일 경우
    {
        $(this).siblings(':input').css("display", "none");
    }
    else{                       // 댓글 인증샷일 경우
        $(this).siblings(':input').css("display", "block");
    }
 });

 $(document).on('click', "#btn_customer_plus", function(){
    alert("고객사가 생성되었습니다.");
    goToPage('customer_list.html');
 });
 $(document).on('click', "#btn_result_page", function(){
    alert("관리자페이지로 이동합니다");
    var tmpIdx = $(this).data("e_idx");
    if (isEmpty(tmpIdx)){
        tmpIdx = $('#e_idx').val();
    }
    if (isEmpty(tmpIdx)){
        alert("이벤트 번호가 올바르지 않습니다.");
        return;
    }
    // 수정을 위한 페이지 호출
    goToPage("resultPage.html", "e_idx=" + tmpIdx);

 });


$(document).on('click', '#btn_event_modify', function(){
    if (confirm("이벤트를 수정 하시겠습니까?"))
    {   
        var tmpIdx = $(this).data("e_idx");
        if (isEmpty(tmpIdx)){
            tmpIdx = $('#e_idx').val();
        }
        if (isEmpty(tmpIdx)){
            alert("이벤트 번호가 올바르지 않습니다.");
            return;
        }
        // 수정을 위한 페이지 호출
        goToPage("event_plus.html", "e_idx=" + tmpIdx);
    }
});


$(document).on('click', '#btn_modify_customer', function(){
    alert("고객사 정보 수정");
});

$(document).on('click', '#btn_delete_customer', function(){
    alert("고객사 정보 삭제");
});

$(document).on('click', '#btn-_customer_plus', function(){
    var customer_name = TrimData('#customer_name');;
    if (isEmptyToFocus(customer_name, '고객사명을 입력하세요.', '#customer_name', 0)){
        return;
     }   

    var params = {};
    params.cmd = "insert_customer";
    params.customer_name = customer_name;
    send_paramdata(params);
});


//전화번호 정규식
$(document).on("keyup", ".phoneNumber", function() { 
	$(this).val( $(this).val().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-") );
})

// 이벤트 만들기 버튼 클릭
// 유의사항 체크(checkbox_event_info), 사전정보체크(checkbox_event_prev_info), 인증샷(checkbox_shot), 
// 퀴즈정보(checkbox_quiz_pinfo + 문제인덱스) 체크되었을 경우에만 값을 등록 -> 히든 처리
$(document).on('click', "#btn_event_makes", function(){

    var baseinfo_json = new Object();
    // 이벤트 전체 구조 JSON 
    var sendJSON = new Object();

    var tmpdata = "";

    // 파일명 중복을 피하기 위해 timestamp를 함께 전송해 timestamp + "_" + 파일명 으로 구성
    var uploadstamp = getTimeStamp();

    // BaseInfo
    tmpdata = TrimData("#select_customer_list option:selected");
    // 정용재 20230228 추가 | 고객사 이름
    var customer_name = $("#select_customer_list option:checked").text();
    baseinfo_json["customer_name"] = customer_name;
    baseinfo_json[baseinfo_customerid] = tmpdata;

    // 메인이미지

    tmpdata = TrimData(rtnIDString(baseinfo_mainimage));
    // 이미지 출력 소스에 정보가 있을 경우 또는 이미지 소스와 선택된 파일명이 다를 경우는 업데이트
    // 메인이미지가 없을 경우 _img 엘리먼트의 값을 조사한다.
    var sztmpsrcID = rtnIDString(baseinfo_mainimage + "_img");
    if (isEmpty(tmpdata)){      // 메인이미지를 지정하지 않았을 경우
        // img src 엘리먼트는 공백이거나 null일 경우 baseURL을 리턴한다.
        var tmp = ($(sztmpsrcID).attr('src') === "") ? "" : $(sztmpsrcID).attr('src');
        if (isEmpty(tmp))
        {
            alert("메인 이미지는 반드시 지정해야 합니다.")
            $(rtnIDString(baseinfo_mainimage)).focus();
            return;
        }
        else{
            baseinfo_json[baseinfo_mainimage] = getOfFileNameFromUrl(tmp);
        }
    }
    else{
        // 변경될 이미지가 존재할 경우에는 타임스탬프를 붙인다.
        baseinfo_json[baseinfo_mainimage] = uploadstamp + "_" + getFileNameExceptPath(tmpdata);    
    }

    // encoding
    baseinfo_json[baseinfo_mainimage] = baseinfo_json[baseinfo_mainimage];
        
  
    tmpdata = TrimData(rtnIDString(baseinfo_event_start_date));
    if (isEmptyMsg(tmpdata, "이벤트 시작 날짜는 반드시 지정해야 합니다.")){ 
        $(rtnIDString(baseinfo_event_start_date)).focus();
        return 
    };
    baseinfo_json[baseinfo_event_start_date] = tmpdata;

    tmpdata = TrimData(rtnIDString(baseinfo_event_end_date));
    if (isEmptyMsg(tmpdata, "이벤트 종료 날짜는 반드시 지정해야 합니다.")){ 
        $(rtnIDString(baseinfo_event_end_date)).focus();
        return 
    };
    baseinfo_json[baseinfo_event_end_date] = tmpdata;
    // 입력 값 체크
    if (!compareDate(rtnIDString(baseinfo_event_start_date), rtnIDString(baseinfo_event_end_date))){
        alert("종료 날짜는 시작 날짜 보다 커야 합니다.");
        $(rtnIDString(baseinfo_event_start_date)).focus();
        return 
    }

    tmpdata = TrimData(rtnIDString(baseinfo_event_title));
    if (isEmptyMsg(tmpdata, "이벤트 제목은 반드시 지정해야 합니다.")){ 
        $(rtnIDString(baseinfo_event_title)).focus();
        return 
    };
    baseinfo_json[baseinfo_event_title] = encodeURIComponent(tmpdata);

    // 이벤트 설명 (sns공유를 위해 사용)
    tmpdata = TrimData(rtnIDString(baseinfo_event_description));
    if (isEmptyMsg(tmpdata, "SNS 공유를 위한 이벤트 설명은 반드시 지정해야 합니다.")){ 
        $(rtnIDString(baseinfo_event_description)).focus();
        return 
    };
    baseinfo_json[baseinfo_event_description] = encodeURIComponent(tmpdata);

    // 유의사항 값 받기 (받기 전 한번 더 숫자인지 유효성 검사)
    if ($('#checkbox_event_info').is(":checked")){
        var noticecount = TrimData('#event_info_count');
        if (!isEmpty(noticecount)){
            if (!fn_isNumeric(noticecount, '+')){
                alert('숫자(정수값, 양수)만 입력해야 합니다.');
                return;
            }
        }

        // 유의 사항 정보를 배열에 입력
        var notice_array = [];
        for(var i = 0; i < parseInt(noticecount); i++){
            var tmpName = rtnIDString(baseinfo_Notice) + String(i);
            tmpdata = TrimDataEncoding(tmpName);
            notice_array.push(tmpdata);
        }
        baseinfo_json[baseinfo_Notice] = notice_array;
    }
    else{
        baseinfo_json[baseinfo_Notice] = "";
    }

    //sns공유값 받기
    var snsShare_json = new Object();

    snsShare_json[baseinfo_sns_share_kakao] = getElementCheckValue('#checkbox_share_kakao_url');
    snsShare_json[baseinfo_sns_share_facebook] = getElementCheckValue('#checkbox_share_facebook_url');
    snsShare_json[baseinfo_sns_share_blog] = getElementCheckValue('#checkbox_share_blog_url');
    snsShare_json[baseinfo_sns_share_band] = getElementCheckValue('#checkbox_share_band_url');
    
    // 메타태그 정보 설정
    snsShare_json[baseinfo_sns_share_title] = baseinfo_json[baseinfo_event_title];
    snsShare_json[baseinfo_sns_share_description] = baseinfo_json[baseinfo_event_description];
    snsShare_json[baseinfo_sns_share_imageurl] = baseinfo_json[baseinfo_mainimage];
    
    // sns 공유 Json 할당
    baseinfo_json[baseinfo_sns_share] = snsShare_json;

    //sns친구값 받기
    var snsFriend_json = new Object();
    snsFriend_json[baseinfo_sns_friend_kakao] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_kakao));
    snsFriend_json[baseinfo_sns_friend_facebook] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_facebook));
    snsFriend_json[baseinfo_sns_friend_blog] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_blog));
    snsFriend_json[baseinfo_sns_friend_band] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_band));
    snsFriend_json[baseinfo_sns_friend_instagram] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_instagram));
    snsFriend_json[baseinfo_sns_friend_youtube] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_youtube));

    baseinfo_json[baseinfo_sns_friend] = snsFriend_json;
    
    // 이벤트 배경색상 받기
    if ($('#checkbox_gradient').is(':checked')){
        var tmpColor = TrimData(rtnIDString(baseinfo_bgColor));
        if (isEmpty(tmpColor)){
            alert('시작 색상을 지정하세요.');
            return;
        }
        var tmpColor2 = TrimData(rtnIDString(baseinfo_bgColor_End));
        if (!isEmpty(tmpColor2)){
            tmpColor = tmpColor + "," + tmpColor2;
        }
        else{
            alert('종료 색상을 지정하세요.');
            return;
        }
    }
    else{
        var tmpColor = TrimData(rtnIDString(baseinfo_bgColor));
        if (isEmpty(tmpColor)){
            alert('시작 색상을 지정하세요.');
            return;
        }
    }
    baseinfo_json[baseinfo_bgColor] = tmpColor;

    // 글자크기옵션 받기
    if ($(rtnIDString(baseinfo_fontSize)).is(':checked'))
        baseinfo_json[baseinfo_fontSize] = "1";
    else
        baseinfo_json[baseinfo_fontSize] = "0";

    // 퀴즈사전정보 받기
    var preInfoList = new Array();
    if ($('#checkbox_event_info').is(":checked")){
        var preInfo_count = TrimData('#event_prev_info_count');
        if (!isEmpty(preInfo_count)){
            if (!fn_isNumeric(preInfo_count, '+')){
                alert('숫자(정수값, 양수)만 입력해야 합니다.');
                return;
            }
        }
        for(var i = 0; i < parseInt(preInfo_count); i++){
            // json을 초기화 후 배열에 입력해야 한다. 
            var preInfo_json = new Object();
            // 라디오는 이름으로 값을 검색해야 한다. $("input[name='radioName']:checked").val();
            var sztmpID = QuizPreInfo_linkType + String(i);
            var tmpValue = $("input[name='" + sztmpID + "']:checked").val();
            preInfo_json[QuizPreInfo_linkType] = tmpValue;
            preInfo_json[QuizPreInfo_preInfoLink] = TrimData(rtnIDString(QuizPreInfo_preInfoLink) + String(i));
            preInfoList.push(preInfo_json)
        }
    };
    
    // 퀴즈정보 값 받기
    quizCount = Problem_Array.length;
    // if (quizCount === 0){
    //     alert("퀴즈 개수는 반드시 지정해야 합니다.");
    //     $('#event_quiz_count').focus();
    //     return 
    // };

    
    var quizList = new Array();
    for(var i = 0; i< parseInt(quizCount); i++){
        // 퀴즈 JSON
        var quiz_Json = new Object();
        // 보기 JSON
        var viewArray = new Array();

        // 퀴즈 유형
        var tmpName = 'input:radio[name =rname' + String(Problem_Array[i]) + ']:checked';
        var quizType = $(tmpName).val();
        quiz_Json[QuizInfo_type] = quizType;
        // 퀴즈 제목
        quiz_Json[QuizInfo_quizTitle] = TrimDataEncoding(rtnIDString(QuizInfo_quizTitle)+ String(Problem_Array[i]));
        // 퀴즈 정답
        quiz_Json[QuizInfo_quizAns] = TrimDataEncoding(rtnIDString(QuizInfo_quizAns) + String(Problem_Array[i]));
        // 퀴즈 정보 (이미지 : 0, 비디오 : 1)
        var tmpName = 'input:radio[name=' + QuizInfo_quizInfoType + String(Problem_Array[i]) + ']:checked';
        quiz_Json[QuizInfo_quizInfoType] = TrimData(tmpName);

        // 퀴즈 정보 (퀴즈 정보가 없을 수도 있지 않나?)
        if ($('#checkbox_quiz_pinfo' + Problem_Array[i]).is(":checked")){
            quiz_Json[QuizInfo_quizInfoFileName] = getFileNameExceptPath(TrimData(rtnIDString(QuizInfo_quizInfoFileName) + String(Problem_Array[i])));
            sztmpsrcID = rtnIDString(QuizInfo_quizInfoFileName) + String(Problem_Array[i]) + "_img";

            // 등록한 파일이 없으며, 미리보기 이미지가 존재할 경우
            if (isEmpty(quiz_Json[QuizInfo_quizInfoFileName])){
                var tmp = ($(sztmpsrcID).attr('src') === "") ? "" : $(sztmpsrcID).attr('src');
                if (!isEmpty(tmp))
                {
                    quiz_Json[QuizInfo_quizInfoFileName] = encodeURIComponent(getOfFileNameFromUrl(tmp));
                }
            }else{
                quiz_Json[QuizInfo_quizInfoFileName] = uploadstamp + "_" + encodeURIComponent(quiz_Json[QuizInfo_quizInfoFileName]);
            }
        }else{
            quiz_Json[QuizInfo_quizInfoFileName] = "";
        }

        // 힌트
        quiz_Json[QuizInfo_hint] = TrimDataEncoding(rtnIDString(QuizInfo_hint) + String(Problem_Array[i]));
        // 주관식일 경우 
        if(quizType === "1"){
            // 퀴즈 정답 유형 (Text : 0, TextArea : 1)
            var tmpName = 'input:radio[name=' + QuizInfo_quizAnsType + String(Problem_Array[i]) + ']:checked';
            quiz_Json[QuizInfo_quizAnsType] = TrimData(tmpName);

        }else if(quizType === "0"){
            // 보기갯수 구하기
            var nVeiwCount = parseInt(TrimData(rtnIDString(QuizInfo_subVal) + String(Problem_Array[i])));
            // 보기유형 (1: 다중선택, 0: 단일선택)
            var tmpName = 'input:radio[name=' + QuizInfo_quizAnsType + String(Problem_Array[i]) + ']:checked';
            quiz_Json[QuizInfo_quizAnsType] = TrimData(tmpName);
            // 보기 갯수 만큼 반복(보기 값 받기)
            for(var j = 0; j <nVeiwCount; j++){
                var view_Json = new Object();
                var tmpName = 'input:radio[name=' + QuizInfo_subVal_type + String(Problem_Array[i]) + String(j) + ']:checked';
                view_Json[QuizInfo_subVal_type] = TrimData(tmpName);
                if (view_Json[QuizInfo_subVal_type] == "0"){ // 텍스트일 경우
                    view_Json[QuizInfo_subVal_data] = TrimData(rtnIDString(QuizInfo_subVal_type) + String(Problem_Array[i]) + String(j) + "_sub" + QuizInfo_subVal_data);
                    if (isEmpty(view_Json[QuizInfo_subVal_data])){
                        alert('보기 정보는 반드시 입력해야 합니다.');
                        return false;
                    }
                }
                else{        // 이미지일 경우
                    view_Json[QuizInfo_subVal_data] = getFileNameExceptPath(TrimData(rtnIDString(QuizInfo_subVal_type) + String(Problem_Array[i]) + String(j) + "_sub" + QuizInfo_subVal_data));
                    // 보기 이미지 파일이 없을 경우 이전에 등록된 미리보기 src 정보가 있는지 확인 후 존재 시 등록
                    if (isEmpty(view_Json[QuizInfo_subVal_data])){
                        // 미리보기 이미지 엘리먼트 ID
                        sztmpsrcID = rtnIDString(QuizInfo_subVal_type) + String(Problem_Array[i]) + String(j) + "_sub" + QuizInfo_subVal_data + "_img";
                        // 등록한 파일이 없으며, 미리보기 이미지가 존재할 경우
                        var tmp = ($(sztmpsrcID).attr('src') === "") ? "" : $(sztmpsrcID).attr('src');
                        if (!isEmpty(tmp))
                        {
                            view_Json[QuizInfo_subVal_data] = getOfFileNameFromUrl(tmp);
                        }
                        else{
                            alert('보기를 위한 이미지 파일이 지정되지 않았습니다.');
                            return false;
                        }
                    }else{
                        // 파일명 앞에 타임스탬프를 붙인다.
                        view_Json[QuizInfo_subVal_data] = uploadstamp + "_" + view_Json[QuizInfo_subVal_data];
                    }
                }
                viewArray.push(view_Json);
            }
            quiz_Json[QuizInfo_subVal] = viewArray;
        }
        quizList.push(quiz_Json);
    };

    // 인증샷 값 받아오기
    var shotList = new Array();
    if ($('#checkbox_shot').is(":checked")){
        var nshotCount = TrimData("#shot_count");
        if (!isEmpty(nshotCount)){
            if (!fn_isNumeric(nshotCount, '+')){
                alert('숫자(정수값, 양수)만 입력해야 합니다.');
                return;
            }
        }

        for(var i = 0; i < parseInt(nshotCount); i ++){
            var shot_json = new Object(); 
            var tmpName = 'input:radio[name=' + shot_type + String(i) + ']:checked';
            shot_json[shot_type] = TrimData(tmpName);
            shot_json[shot_shotUrl] = TrimDataEncoding(rtnIDString(shot_shotUrl) + String(i));
            shot_json[shot_title] = TrimDataEncoding(rtnIDString(shot_title) + String(i));
            shotList.push(shot_json);
        }
    };

    //개인정보처리방침 값 받기
    var agreed_json = new Object();
    agreed_json[privacy_name] = getElementCheckValue(rtnIDString(privacy_name));
    agreed_json[privacy_phone] = getElementCheckValue(rtnIDString(privacy_phone));
    agreed_json[privacy_email] = getElementCheckValue(rtnIDString(privacy_email));
    if ($('#checkbox_privacy_customer').is(':checked'))
      agreed_json[privacy_customer] = TrimDataEncoding(rtnIDString(privacy_customer));


    //장기요양병원 웹진 체크
    let url_btn = new Object();
    var url_btn_true = $("input[id='btn_npbs_plus']:checked").val();
    var btn_url = $("#npbs_url").val();

    webzinedata = TrimData(rtnIDString(webzine_img));
    // 이미지 출력 소스에 정보가 있을 경우 또는 이미지 소스와 선택된 파일명이 다를 경우는 업데이트
    // 메인이미지가 없을 경우 _img 엘리먼트의 값을 조사한다.
    var sztmpsrcID = rtnIDString(webzine_img + "_img");
    if (isEmpty(webzinedata)){      // 메인이미지를 지정하지 않았을 경우
        // img src 엘리먼트는 공백이거나 null일 경우 baseURL을 리턴한다.
        var tmp = ($(sztmpsrcID).attr('src') === "") ? "" : $(sztmpsrcID).attr('src');
        url_btn[webzine_img] = getOfFileNameFromUrl(tmp);
    }
    else{
        // 변경될 이미지가 존재할 경우에는 타임스탬프를 붙인다.
        url_btn[webzine_img] = uploadstamp + "_" + getFileNameExceptPath(webzinedata);    
    } 
    
    // encoding
    url_btn[webzine_img] = url_btn[webzine_img];
    url_btn[webzine_chk] = url_btn_true;
    url_btn[webzine_url] = btn_url;

    var quiz_type = "event";

    sendJSON['quiz_type'] = quiz_type;
    sendJSON['baseinfo'] = baseinfo_json;
    sendJSON['quizepreinfo'] = preInfoList;
    sendJSON['quize'] = quizList;
    sendJSON['shot'] = shotList;
    sendJSON['agree'] = agreed_json;
    sendJSON['url_btn'] = url_btn;

    // uploadfileList에 등록된 모든 input type=file 을 등록한다. 
    // 동일한 파일명이 존재할 경우 오류 처리 된다.
    /*
    var bUpload = "";
    var nUploadFileCount = uploadfileList.length;
    for (var i=0; i<nUploadFileCount; i++){
        var tmpID = rtnIDString(uploadfileList[i]);
        var file = $(tmpID)[0].files[0];
        var formData = new FormData();
        formData.append("uploadfile", file);
        formData.append("uploadstamp", uploadstamp);
        formData.append("customeridx", baseinfo_json[baseinfo_customerid]);
        bUpload = send_formdata(formData, "js/upload.php"); 
    }
    */

    // 퀴즈 인덱스가 존재할 경우 Update, 없을 경우 Insert
    var e_idx = TrimData('#e_idx');
    var params = {};   
    var rtnMessage = ""; 
    if (isEmpty(e_idx)){
        params.cmd = "insert_event";
        rtnMessage = '이벤트를 등록했습니다.';
    }
    else{    
        params.cmd = "update_event";
        params.e_idx = e_idx;
        rtnMessage = '이벤트를 수정했습니다.';
    }    

    // 특수문자 처리를 위해 encodeURIComponent decodeURIComponent
    params.e_title = baseinfo_json[baseinfo_event_title];
    params.e_description = baseinfo_json[baseinfo_event_description];            // 이벤트명은 미사용
    params.e_customer_idx = baseinfo_json[baseinfo_customerid];
    params.e_startdate = baseinfo_json[baseinfo_event_start_date];
    params.e_enddate = baseinfo_json[baseinfo_event_end_date];
    params.e_mainimage = baseinfo_json[baseinfo_mainimage];
    params.e_data = JSON.stringify(sendJSON);

    var eventdir = send_paramdata(params, false, true);
    if (!isEmpty(e_idx)){
        eventdir = e_idx;          
    }
    var szUpload = "";
    if ($.isNumeric(eventdir)){
        var nUploadFileCount = uploadfileList.length;
        if (nUploadFileCount != 0){  // 업로드할 파일이 존재할 경우    
            for (var i=0; i<nUploadFileCount; i++){
                var tmpID = rtnIDString(uploadfileList[i]);
                //var file = encodeURIComponent($(tmpID)[0].files[0]);
                var file = $(tmpID)[0].files[0];
                var formData = new FormData();
                formData.append("uploadfile", file);
                formData.append("uploadstamp", uploadstamp);
                formData.append("eventdir", eventdir);
                szUpload  = send_formdata(formData, false, "js/upload.php"); 
                if (szUpload != 'success'){
                    alert('파일 업로드 도중 오류가 발생했습니다.\n\n파일명 : ' + file);
                    return;
                }
            }
        }
        alert(rtnMessage);
        goToPage("eventpage.html", "e_idx=" + eventdir);
    }
    else{
        alert('이벤트를 등록에 실패했습니다.');
    }
});

// Body내의 input[type=file]에 파일이 등록될 경우 
// 파일을 등록하기 위해 ID를 리스트에 등록한다.
$(document).on('change', 'input[type="file"]', function(){
    uploadfileList.push($(this).attr('id'));
})

/********************************************************************************
 * 테스트 인터페이스
 *******************************************************************************/
$(document).on('click', "#btn_upload_file", function(){
    // fileidlist에 등록된 모든 input type=file 을 등록한다. 
    var bUpload = true;
    for (var i=0; i<fileidList.length; i++){
        var tmpID = rtnIDString(fileidList[i]);
        var file = $(tmpID)[0].files[0];
        var formData = new FormData();
        formData.append("uploadfile", file);
        formData.append("customerName", "애드아이티");
        bUpload = send_formdata(formData, "js/upload.php"); 
    }
});

// JSON Data 전송
$(document).on('click', '#btn_json_data', function(){
    var sendJSON = new Object;
    sendJSON['title'] = "test";
    sendJSON['title1'] = "test1";
    sendJSON['title2'] = "test2";
    sendJSON['title3'] = "test3";
    var tmpArray = new Array;    
    for (var i=0; i<2; i++){
        var tmpJSON = new Object;
        tmpJSON["aaa"] = "aaaa" + String(i);
        tmpJSON["aaa"] = "aaaa"; + String(i);
        tmpArray.push(tmpJSON);
    }
    sendJSON['array'] = tmpArray;
    var sendJSON2 = new Object;
    sendJSON2['1'] = "test";
    sendJSON2['2'] = "test1";
    sendJSON2['3'] = "test2";
    sendJSON2['4'] = "test3";

    sendJSON['b'] = sendJSON2;

    var params = {};
    params.cmd = "test";
    params.e_data= JSON.stringify(sendJSON);
    send_paramdata(params);
    console.log(JSON.stringify(sendJSON));
    //goToPage('index.html', '');

    var params = {};
    params.cmd = "test_load";
    var test_json = load_data(params);
})

// 이벤트 활성화
// 활성화 시에 결과 테이블이 생성된다.
$(document).on('click', '#btn_event_active', function(){
    var params = {}
    var szTemp = $(this).text();
    if (szTemp === '비활성화'){
        szMsg = '해당 이벤트를 비활성화하시겠습니까?\n\n사용자는 이벤트에 접근이 불가능합니다.';
        params.e_active = "0";
    }
    else{
        szMsg = '해당 이벤트를 활성화하시겠습니까?\n\n활성화 후에 사용자는 이벤트에 접근가능합니다.';
        params.e_active = "1";
    }

    if (!confirm(szMsg))
    {
        return;
    }

    var e_idx = $(this).data('e_idx');
    if (!isEmpty(e_idx)){
        params.cmd = "active_event";
        params.e_idx = e_idx;
        alert(send_paramdata(params));

        goToPage("index.html", "");

        // 리스트를 다시 불러온다.
        // event 테이블로 부터 이벤트 리스트를 불러와 출력한다.
        /*
        var params = {};
        params.cmd = "load_event";
        params.nowpage = "1";
        params.searchtype = "";         // 검색 유형
        params.searchdata = "";         // 검색 데이터
        params.loadcount = Data_Per_Page_Count;

        global_event_list_json = load_data(params);
        draw_event_list(global_event_list_json, '#event-list', "#page_div", 1);
        */
    }
});

//페이지네이션 클릭
$(document).on('click','.addit-page-a', function(){
    $('.addit-page-a').removeClass('active');
    var pageId = $(this).data('page');
    $('#addit_page_a' + pageId + '').addClass('active')
})

// 이벤트 리스트 Selectbox를 선택했을 경우
$(document).on('change', '#customer_event_list', function(){
  var e_idx = $(this).val();

  inpath_Array = [0,0,0,0,0]; 
  // 문제 리스트를 읽어온다.
  var params = {};
  params.e_idx = e_idx;
  params.cmd = "load_event";
  global_event_list_json = load_data(params);
  draw_event_quiz_list(global_event_list_json.tabledata[0]['e_data'], '#div_event_quiz_list');


  var params = {};
  params.e_idx = e_idx;
  params.cmd = "load_event_result";
  global_event_result_json = load_data(params);
  draw_result_button('#div_result_button');
  draw_event_result(global_event_result_json, '#table_td');
});

// 2023-02-22 | 정용재
// 기존 질문 리스트를 클릭시 차트가 보이는것에서 차트보기 버튼을 따로 구현해 버튼 클릭시 차트 보이게 
// 퀴즈 질문 리스트 클릭 시
$(document).on('click', '.btn-addit-quiz-list', function(){
  var idx = $(this).siblings().data("idx");
  // 결과 리스트 테이블 정보를 분석 후 테이블을 그린다 (result_td 의 7번째가 사용자 답, /로 구분)
  //$('#result_td').children().eq(1).children().eq(6).text();
  var tmpArray = [];
  $('#table_td').children().each(function(index, tr){
    var tmpUserArray = $(tr).children().eq(5).text();   // "/"로 구분
    tmpUserArray = tmpUserArray.split("/");
    tmpArray.push($.trim(tmpUserArray[idx]));        // 선택한 index에 해당되는 답을 얻어온 후, 앞뒤 공백 제거
  });

  // 배열을 GrouBy
  var reducer = function(accumulator, value, index, array) {
    if (accumulator.hasOwnProperty(value)) {
      accumulator[value] = accumulator[value] + 1;
    } else {
      accumulator[value] = 1;
    }
    return accumulator;
  }
  var initialValue = {};
  var resultJSON = {};
  resultJSON = tmpArray.reduce(reducer, initialValue);

  // 챠트를 위한 Label(범례)와 Data를 생성한다.
  chart_label_array = []; chart_data_array = [];
  $.each(resultJSON, function(key, value){
    chart_label_array.push(key);
    chart_data_array.push(value);
  });

  // 챠크를 그린다.
  draw_chart(analyzeChart, chart_label_array, chart_data_array, '# 분석', $(this).parent().html().split('<')[0]);
  
});

// 2023.02.23 | 정용재
// 인증샷 보기 팝업
$(document).on('click', '.shot_view', function(){
    var e_idx = decodeURI(decodeURIComponent($.urlParam("e_idx")));
    var s_idx = $(this).data("shotcount");
    var shotUrl = `file/event_${e_idx}/${s_idx}`;
    OpenWindow(shotUrl, '인증샷팝업', "700px", "800px")
})

// 2023-02-23 | 정용재
// 질문리스트 내에 사용자입력값보기 버튼 클릭시 리스트 구현
// 사용자 입력 값 표시(질문리스트 내에) 클릭시
$(document).on('click', '.btn-addit-quiz-text', function(){
  var idx = $(this).parent().data("idx");
  // 결과 리스트 테이블 정보를 분석 후 테이블을 그린다 (result_td 의 7번째가 사용자 답, /로 구분)
  //$('#result_td').children().eq(1).children().eq(6).text();
  var tmpArray = [];
  $('#table_td').children().each(function(index, tr){
    var tmpUserArray = $(tr).children().eq(5).text();   // "/"로 구분
    tmpUserArray = tmpUserArray.split("/");
    tmpArray.push($.trim(tmpUserArray[idx]));        // 선택한 index에 해당되는 답을 얻어온 후, 앞뒤 공백 제거
  });

  // 배열을 GrouBy
  var reducer = function(accumulator, value, index, array) {
    if (accumulator.hasOwnProperty(value)) {
      accumulator[value] = accumulator[value] + 1;
    } else {
      accumulator[value] = 1;
    }
    return accumulator;
  }
  var initialValue = {};
  var resultJSON = tmpArray.reduce(reducer, initialValue);

  // 챠트를 위한 Label(범례)와 Data를 생성한다.
  chart_label_array = []; chart_data_array = [];
  $.each(resultJSON, function(key, value){
    chart_label_array.push(key);
    chart_data_array.push(value);
  });

  var draw_target = $("#table_ans")
  // 챠크를 그린다.
//   draw_list(analyzeChart, chart_label_array, chart_data_array, $(this).parent().html().split('<')[0], draw_target);
  draw_list_table(chart_label_array, chart_data_array, $(this).parent().html().split('<')[0], draw_target, 'asc', tmpArray);
  
});

// Table을 Export 한다.
$(document).on('click', '#btn_result_select_down', function(){
  $("#random_list_select").table2excel({
    exclude: ".excludeThisClass",
    name: "이벤트당첨자",
    filename: g_event_title + "이벤트당첨자명단.xls", // do include extension
    exclude_img: true,
    exclude_links: true,
    exclude_inputs: true,
    preserveColors: false // set to true if you want background colors and font colors preserved
  });
});

$(document).on('click', '#btn_result_answer', function(){
  var szTemp = $('#btn_result_answer').text();
  if (szTemp == '사용자 입력값 보기'){
    $('#result_th').children().each(function(index, tr){
      $(tr).children().eq(6).css('display', 'block');   // "/"로 구분
    });
    
    $('#result_td').children().each(function(index, tr){
      $(tr).children().eq(6).css('display', 'block');   // "/"로 구분
    });
    $('#btn_result_answer').text('사용자 입력값 숨기기');
  }
  else{
    $('#result_th').children().each(function(index, tr){
      $(tr).children().eq(6).css('display', 'none');   // "/"로 구분
    });
    
    $('#result_td').children().each(function(index, tr){
      $(tr).children().eq(6).css('display', 'none');   // "/"로 구분
    });
    $('#btn_result_answer').text('사용자 입력값 보기');
  }
});

// 정답자만 보기
$(document).on('click', '#btn_result_right', function(){
  var szTemp = $('#btn_result_right').text();
  if (szTemp == '정답자만 보기'){
    var e_idx = $('#customer_event_list').val();
    var params = {};
    params.e_idx = e_idx;
    params.loadcount = MAX_Data_Per_Page_Count;
    params.cmd = "load_event_result_right";
    global_event_result_json = load_data(params);
    draw_result_button('#div_result_button');
    draw_event_result(global_event_result_json, '#result_td');
    $('#btn_result_right').text('참여자 모두 보기');
  }
  else{
    var e_idx = $('#customer_event_list').val();
    var params = {};
    params.e_idx = e_idx;
    params.loadcount = MAX_Data_Per_Page_Count;
    params.cmd = "load_event_result";
    global_event_result_json = load_data(params);
    draw_result_button('#div_result_button');
    draw_event_result(global_event_result_json, '#result_td');
    $('#btn_result_right').text('정답자만 보기');
  }
});

// 전체 이벤트 불러오기 
$(document).on('click', '#btn_event_list_all', function(){
    var params = {};
    params.cmd = "load_event";
    params.nowpage = "1";
    params.searchtype = "";         // 검색 유형
    params.searchdata = "";         // 검색 데이터
    params.loadcount = Data_Per_Page_Count;

    global_event_list_json = load_data(params);
    draw_event_list(global_event_list_json, '#event_list', "#page_div", 1);

    var isLogin = getCookie('login');
    if (isLogin === "logined")
        ToggleLoginDiv(true);
    else
        ToggleLoginDiv(false);

    $('.addit-btn-left-area').removeClass('active');
    $(this).addClass('active');  
});

// 진행 중 이벤트 버튼 클릭 시
$(document).on('click', '#btn_event_list_active', function(){
    var params = {};
    params.e_active = "1";
    params.loadcount = -1;
    params.cmd = "load_event";
    global_event_list_json = load_data(params);
    draw_event_list(global_event_list_json, '#event_list', "#page_div", 1);

    var isLogin = getCookie('login');
    if (isLogin === "logined")
        ToggleLoginDiv(true);
    else
        ToggleLoginDiv(false);

    $('.addit-btn-left-area').removeClass('active')
    $(this).addClass('active')
});

// 종료 이벤트 버튼 클릭 시
$(document).on('click', '#btn_event_list_end', function(){
    var params = {};
    params.e_active = "0";
    params.loadcount = -1;
    params.cmd = "load_event";
    global_event_list_json = load_data(params);
    draw_event_list(global_event_list_json, '#event_list', "#page_div", 1);

    var isLogin = getCookie('login');
    if (isLogin === "logined")
        ToggleLoginDiv(true);
    else
        ToggleLoginDiv(false);

    $('.addit-btn-left-area').removeClass('active');
    $(this).addClass('active');
});
    // 폼 데이터 전송 
    /*
    var sendForm = $('<form></form>');
    sendForm.attr('id', "dataForm");
    sendForm.attr('name', "dataForm");
    sendForm.attr('method', "post");
    sendForm.attr('action', "eventpage.html");
    sendForm.append('e_idx', $(this).data('e_idx'));
    sendForm.appendTo('body');
    sendForm.submit();
    */

// ox 퀴즈 만들기 관련 이벤트
// 퀴즈 갯수 버튼 클릭
$(document).on('click', "#btn_ox_quiz_count", function(){
    var count = parseInt(TrimData('#event_quiz_count'));
    if (!fn_isNumeric(count, '+')){
        alert('숫자(정수값, 양수)만 입력해야 합니다.');
        return;
    }
    if (Problem_Array.length > 0){
        alert('현재 퀴즈 개수는 ' + String(Problem_Array.length) + '개 입니다.\n\n퀴즈 개수를 추가합니다.');
    }
    // alert(count);

    DrawOxQuizInfo(count, "#make_ox_quiz_list");
});

// 결과페이지 갯수 갯수 버튼 클릭
$(document).on('click', "#btn_ox_quiz_result_count", function(){
    var count = parseInt(TrimData('#quiz_result_count'));
    if (!fn_isNumeric(count, '+')){
        alert('숫자(정수값, 양수)만 입력해야 합니다.');
        return;
    }
    if (rPage_Array.length > 0){
        alert('현재 퀴즈 개수는 ' + String(rPage_Array.length) + '개 입니다.\n\n퀴즈 개수를 추가합니다.');
    }
    // alert(count);

    DrawResultPageInfo(count, "#make_ox_quiz_result_list");
});

 //ox 퀴즈 페이지 복사하기 버튼 클릭 시 url 복사
$(document).on('click', ".addit-Quizcontent-2-2", function(){
    var url = '';
    var textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    url = window.document.location.href;
    textarea.value = url;
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("URL이 복사되었습니다.")
});

$(document).on('click', '#btn_other_test', function(){
    goToPage('index.html', "")
});

    //ox 퀴즈 페이지 참여하기 버튼 클릭 시
$(document).on('click', ".addit-StartButton", function(){
    var Starting = document.getElementById('start');
    Starting.className += " NonDiv";
    setTimeout(function () {
        Starting.style.display = "none";
    }, 700);
    if (Starting.classList.contains("NonDiv")) {
        document.getElementById('StartDiv').classList += ' StartDiv';
    } else {
        alert('다시 시도해주세요');
    }
    $('html, body').animate({
        scrollTop: 0
    }, 400);

})  

//ox퀴즈추가 페이지 이벤트 만들기 버튼 클릭 시
$(document).on('click', '#btn_oxQuiz_makes', function(){
    
    var baseinfo_json = new Object();
    // var baseinfo2_json = new Object();
    // 이벤트 전체 구조 JSON 
    var sendJSON = new Object();

    var tmpdata = "";

    // 파일명 중복을 피하기 위해 timestamp를 함께 전송해 timestamp + "_" + 파일명 으로 구성
    var uploadstamp = getTimeStamp();

    // BaseInfo
    tmpdata = TrimData("#select_customer_list option:selected");
    baseinfo_json[baseinfo_customerid] = tmpdata;

    // 메인이미지

    tmpdata = TrimData(rtnIDString(baseinfo_mainimage));
    // 이미지 출력 소스에 정보가 있을 경우 또는 이미지 소스와 선택된 파일명이 다를 경우는 업데이트
    // 메인이미지가 없을 경우 _img 엘리먼트의 값을 조사한다.
    var sztmpsrcID = rtnIDString(baseinfo_mainimage + "_img");
    if (isEmpty(tmpdata)){      // 메인이미지를 지정하지 않았을 경우
        // img src 엘리먼트는 공백이거나 null일 경우 baseURL을 리턴한다.
        var tmp = ($(sztmpsrcID).attr('src') === "") ? "" : $(sztmpsrcID).attr('src');
        if (isEmpty(tmp))
        {
            alert("메인 이미지는 반드시 지정해야 합니다.")
            $(rtnIDString(baseinfo_mainimage)).focus();
            return;
        }
        else{
            baseinfo_json[baseinfo_mainimage] = getOfFileNameFromUrl(tmp);
        }
    }
    else{
        // 변경될 이미지가 존재할 경우에는 타임스탬프를 붙인다.
        baseinfo_json[baseinfo_mainimage] = uploadstamp + "_" + getFileNameExceptPath(tmpdata);    
    }

    // encoding
    baseinfo_json[baseinfo_mainimage] = baseinfo_json[baseinfo_mainimage];
        
  
    tmpdata = TrimData(rtnIDString(baseinfo_event_start_date));
    if (isEmptyMsg(tmpdata, "이벤트 시작 날짜는 반드시 지정해야 합니다.")){ 
        $(rtnIDString(baseinfo_event_start_date)).focus();
        return 
    };
    baseinfo_json[baseinfo_event_start_date] = tmpdata;

    tmpdata = TrimData(rtnIDString(baseinfo_event_end_date));
    if (isEmptyMsg(tmpdata, "이벤트 종료 날짜는 반드시 지정해야 합니다.")){ 
        $(rtnIDString(baseinfo_event_end_date)).focus();
        return 
    };
    baseinfo_json[baseinfo_event_end_date] = tmpdata;
    // 입력 값 체크
    if (!compareDate(rtnIDString(baseinfo_event_start_date), rtnIDString(baseinfo_event_end_date))){
        alert("종료 날짜는 시작 날짜 보다 커야 합니다.");
        $(rtnIDString(baseinfo_event_start_date)).focus();
        return 
    }

    tmpdata = TrimData(rtnIDString(baseinfo_event_title));
    if (isEmptyMsg(tmpdata, "이벤트 제목은 반드시 지정해야 합니다.")){ 
        $(rtnIDString(baseinfo_event_title)).focus();
        return 
    };
    baseinfo_json[baseinfo_event_title] = encodeURIComponent(tmpdata);

    // 이벤트 설명 (sns공유를 위해 사용)
    tmpdata = TrimData(rtnIDString(baseinfo_event_description));
    if (isEmptyMsg(tmpdata, "SNS 공유를 위한 이벤트 설명은 반드시 지정해야 합니다.")){ 
        $(rtnIDString(baseinfo_event_description)).focus();
        return 
    };
    baseinfo_json[baseinfo_event_description] = encodeURIComponent(tmpdata);

    // 유의사항 값 받기 (받기 전 한번 더 숫자인지 유효성 검사)
    if ($('#checkbox_event_info').is(":checked")){
        var noticecount = TrimData('#event_info_count');
        if (!isEmpty(noticecount)){
            if (!fn_isNumeric(noticecount, '+')){
                alert('숫자(정수값, 양수)만 입력해야 합니다.');
                return;
            }
        }

        // 유의 사항 정보를 배열에 입력
        var notice_array = [];
        for(var i = 0; i < parseInt(noticecount); i++){
            var tmpName = rtnIDString(baseinfo_Notice) + String(i);
            tmpdata = TrimDataEncoding(tmpName);
            notice_array.push(tmpdata);
        }
        baseinfo_json[baseinfo_Notice] = notice_array;
    }
    else{
        baseinfo_json[baseinfo_Notice] = "";
    }

    //sns공유값 받기
    var snsShare_json = new Object();

    snsShare_json[baseinfo_sns_share_kakao] = getElementCheckValue('#checkbox_share_kakao_url');
    snsShare_json[baseinfo_sns_share_facebook] = getElementCheckValue('#checkbox_share_facebook_url');
    snsShare_json[baseinfo_sns_share_blog] = getElementCheckValue('#checkbox_share_blog_url');
    snsShare_json[baseinfo_sns_share_band] = getElementCheckValue('#checkbox_share_band_url');
    
    // 메타태그 정보 설정
    snsShare_json[baseinfo_sns_share_title] = baseinfo_json[baseinfo_event_title];
    snsShare_json[baseinfo_sns_share_description] = baseinfo_json[baseinfo_event_description];
    snsShare_json[baseinfo_sns_share_imageurl] = baseinfo_json[baseinfo_mainimage];
    
    // sns 공유 Json 할당
    baseinfo_json[baseinfo_sns_share] = snsShare_json;

    //sns친구값 받기
    var snsFriend_json = new Object();
    snsFriend_json[baseinfo_sns_friend_kakao] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_kakao));
    snsFriend_json[baseinfo_sns_friend_facebook] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_facebook));
    snsFriend_json[baseinfo_sns_friend_blog] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_blog));
    snsFriend_json[baseinfo_sns_friend_band] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_band));
    snsFriend_json[baseinfo_sns_friend_instagram] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_instagram));
    snsFriend_json[baseinfo_sns_friend_youtube] = TrimDataEncoding(rtnIDString(baseinfo_sns_friend_youtube));

    baseinfo_json[baseinfo_sns_friend] = snsFriend_json;
    
    // 이벤트 배경색상 받기
    if ($('#checkbox_gradient').is(':checked')){
        var tmpColor = TrimData(rtnIDString(baseinfo_bgColor));
        if (isEmpty(tmpColor)){
            alert('시작 색상을 지정하세요.');
            return;
        }
        var tmpColor2 = TrimData(rtnIDString(baseinfo_bgColor_End));
        if (!isEmpty(tmpColor2)){
            tmpColor = tmpColor + "," + tmpColor2;
        }
        else{
            alert('종료 색상을 지정하세요.');
            return;
        }
    }
    else{
        var tmpColor = TrimData(rtnIDString(baseinfo_bgColor));
        if (isEmpty(tmpColor)){
            alert('시작 색상을 지정하세요.');
            return;
        }
    }
    baseinfo_json[baseinfo_bgColor] = tmpColor;

    // O이미지

    tmpdata = TrimData(rtnIDString(baseinfo_OImg));
    // 이미지 출력 소스에 정보가 있을 경우 또는 이미지 소스와 선택된 파일명이 다를 경우는 업데이트
    // 메인이미지가 없을 경우 _img 엘리먼트의 값을 조사한다.
    var sztmpsrcID = rtnIDString(baseinfo_OImg + "_img");
    if (isEmpty(tmpdata)){      // 메인이미지를 지정하지 않았을 경우
        // img src 엘리먼트는 공백이거나 null일 경우 baseURL을 리턴한다.
        var tmp = ($(sztmpsrcID).attr('src') === "") ? "" : $(sztmpsrcID).attr('src');
        if (isEmpty(tmp))
        {
            alert("메인 이미지는 반드시 지정해야 합니다.")
            $(rtnIDString(baseinfo_OImg)).focus();
            return;
        }
        else{
            baseinfo_json[baseinfo_OImg] = getOfFileNameFromUrl(tmp);
        }
    }
    else{
        // 변경될 이미지가 존재할 경우에는 타임스탬프를 붙인다.
        baseinfo_json[baseinfo_OImg] = uploadstamp + "_" + getFileNameExceptPath(tmpdata);    
    }

    // encoding
    baseinfo_json[baseinfo_OImg] = baseinfo_json[baseinfo_OImg];

    // X이미지
    tmpdata = TrimData(rtnIDString(baseinfo_XImg));
    // 이미지 출력 소스에 정보가 있을 경우 또는 이미지 소스와 선택된 파일명이 다를 경우는 업데이트
    // 메인이미지가 없을 경우 _img 엘리먼트의 값을 조사한다.
    var sztmpsrcID = rtnIDString(baseinfo_XImg + "_img");
    if (isEmpty(tmpdata)){      // 메인이미지를 지정하지 않았을 경우
        // img src 엘리먼트는 공백이거나 null일 경우 baseURL을 리턴한다.
        var tmp = ($(sztmpsrcID).attr('src') === "") ? "" : $(sztmpsrcID).attr('src');
        if (isEmpty(tmp))
        {
            alert("메인 이미지는 반드시 지정해야 합니다.")
            $(rtnIDString(baseinfo_XImg)).focus();
            return;
        }
        else{
            baseinfo_json[baseinfo_XImg] = getOfFileNameFromUrl(tmp);
        }
    }
    else{
        // 변경될 이미지가 존재할 경우에는 타임스탬프를 붙인다.
        baseinfo_json[baseinfo_XImg] = uploadstamp + "_" + getFileNameExceptPath(tmpdata);    
    }

    // encoding
    baseinfo_json[baseinfo_XImg] = baseinfo_json[baseinfo_XImg];


    // 퀴즈사전정보 받기
    // var preInfoList = new Array();
    // if ($('#checkbox_event_info').is(":checked")){
    //     var preInfo_count = TrimData('#event_prev_info_count');
    //     if (!isEmpty(preInfo_count)){
    //         if (!fn_isNumeric(preInfo_count, '+')){
    //             alert('숫자(정수값, 양수)만 입력해야 합니다.');
    //             return;
    //         }
    //     }
    //     for(var i = 0; i < parseInt(preInfo_count); i++){
    //         // json을 초기화 후 배열에 입력해야 한다. 
    //         var preInfo_json = new Object();
    //         // 라디오는 이름으로 값을 검색해야 한다. $("input[name='radioName']:checked").val();
    //         var sztmpID = QuizPreInfo_linkType + String(i);
    //         var tmpValue = $("input[name='" + sztmpID + "']:checked").val();
    //         preInfo_json[QuizPreInfo_linkType] = tmpValue;
    //         preInfo_json[QuizPreInfo_preInfoLink] = TrimData(rtnIDString(QuizPreInfo_preInfoLink) + String(i));
    //         preInfoList.push(preInfo_json)
    //     }
    // };
    
    // 퀴즈정보 값 받기
    quizCount = Problem_Array.length;
    // if (quizCount === 0){
    //     alert("퀴즈 개수는 반드시 지정해야 합니다.");
    //     $('#event_quiz_count').focus();
    //     return 
    // };

    
    var quizList = new Array();
    for(var i = 0; i< parseInt(quizCount); i++){
        // 퀴즈 JSON
        var quiz_Json = new Object();
        var Quiz_img_count = Quiz_img + String(Problem_Array[i]);

        tmpdata = TrimData(rtnIDString(Quiz_img_count));
        var sztmpsrcID = rtnIDString(Quiz_img_count + "_img");
        if (isEmpty(tmpdata)){      // 메인이미지를 지정하지 않았을 경우
            // img src 엘리먼트는 공백이거나 null일 경우 baseURL을 리턴한다.
            var tmp = ($(sztmpsrcID).attr('src') === "") ? "" : $(sztmpsrcID).attr('src');
            if (isEmpty(tmp))
            {
                alert("메인 이미지는 반드시 지정해야 합니다.")
                $(rtnIDString(Quiz_img_count)).focus();
                return;
            }
            else{
                quiz_Json[Quiz_img] = getOfFileNameFromUrl(tmp);
            }
        }
        else{
            // 변경될 이미지가 존재할 경우에는 타임스탬프를 붙인다.
            quiz_Json[Quiz_img] = uploadstamp + "_" + getFileNameExceptPath(tmpdata);    
        }
        var ansRadio = Quiz_Answer + String(Problem_Array[i]);
        // encoding
        quiz_Json[Quiz_img] = quiz_Json[Quiz_img];
        // 퀴즈 제목
        quiz_Json[Quiz_Title] = TrimDataEncoding(rtnIDString(Quiz_Title + String(Problem_Array[i])));
        // 퀴즈 점수
        quiz_Json[Quiz_Score] = TrimDataEncoding(rtnIDString(Quiz_Score + String(Problem_Array[i])));
        // 퀴즈 정답
        quiz_Json[Quiz_Answer] = $(`input[name="${ansRadio}"]:checked`).val();
        // 퀴즈 설명
        quiz_Json[Quiz_Desc] = TrimDataEncoding(rtnIDString(Quiz_Desc + String(Problem_Array[i])));
        
        quizList.push(quiz_Json);
    };

    
    // 결과정보 값 받기
    let resultPage = new Object();

    //고객사 링크 값 받기
    let customerLink = new Object();
    let customer_title = $("#customer_title").val();
    let customer_link = $("#customer_link").val();

    customerLink['title'] = customer_title;
    customerLink['linke'] = customer_link;

    resultPage['customerLinkPage'] = customerLink

    resultCount = rPage_Array.length;  
    var resultList = new Array();
    for(var i = 0; i< parseInt(resultCount); i++){
        // 퀴즈 JSON
        var result_Json = new Object();
        // 보기 JSON
        var resultImg = result_img + String(rPage_Array[i]);

        tmpdata = TrimData(rtnIDString(resultImg));
        var sztmpsrcID = rtnIDString(resultImg + String(rPage_Array[i]) + "_img");
        if (isEmpty(tmpdata)){      // 메인이미지를 지정하지 않았을 경우
            // img src 엘리먼트는 공백이거나 null일 경우 baseURL을 리턴한다.
            var tmp = ($(sztmpsrcID).attr('src') === "") ? "" : $(sztmpsrcID).attr('src');
            if (isEmpty(tmp))
            {
                alert("메인 이미지는 반드시 지정해야 합니다.")
                $(rtnIDString(resultImg)).focus();
                return;
            }
            else{
                result_Json[result_img] = getOfFileNameFromUrl(tmp);
            }
        }
        else{
            // 변경될 이미지가 존재할 경우에는 타임스탬프를 붙인다.
            result_Json[result_img] = uploadstamp + "_" + getFileNameExceptPath(tmpdata);    
        }

        // encoding
        result_Json[result_img] = result_Json[result_img];

        // 결과 텍스트
        result_Json[result_text] = TrimDataEncoding(rtnIDString(result_text + String(rPage_Array[i])));
        // 결과점수
        result_Json[result_score] = TrimDataEncoding(rtnIDString(result_score + String(rPage_Array[i])));
        
        resultList.push(result_Json);
    };

    resultPage['rPage'] = resultList;



    // 인증샷 값 받아오기
    var shotList = new Array();
    if ($('#checkbox_shot').is(":checked")){
        var nshotCount = TrimData("#shot_count");
        if (!isEmpty(nshotCount)){
            if (!fn_isNumeric(nshotCount, '+')){
                alert('숫자(정수값, 양수)만 입력해야 합니다.');
                return;
            }
        }

        for(var i = 0; i < parseInt(nshotCount); i ++){
            var shot_json = new Object(); 
            var tmpName = 'input:radio[name=' + shot_type + String(i) + ']:checked';
            shot_json[shot_type] = TrimData(tmpName);
            shot_json[shot_shotUrl] = TrimDataEncoding(rtnIDString(shot_shotUrl) + String(i));
            shot_json[shot_title] = TrimDataEncoding(rtnIDString(shot_title) + String(i));
            shotList.push(shot_json);
        }
    };

    //개인정보처리방침 값 받기
    var agreed_json = new Object();
    agreed_json[privacy_name] = getElementCheckValue(rtnIDString(privacy_name));
    agreed_json[privacy_phone] = getElementCheckValue(rtnIDString(privacy_phone));
    agreed_json[privacy_email] = getElementCheckValue(rtnIDString(privacy_email));
    if ($('#checkbox_privacy_customer').is(':checked'))
      agreed_json[privacy_customer] = TrimDataEncoding(rtnIDString(privacy_customer));

    baseinfo_json['privacy'] = agreed_json;


    var quiz_type = "oxQuiz";


    sendJSON['quiz_type'] = quiz_type;
    sendJSON['baseinfo'] = baseinfo_json;
    sendJSON['quize'] = quizList;
    sendJSON['resultPage'] = resultPage;
    sendJSON['shot'] = shotList;

    // alert(JSON.stringify(sendJSON));
    // console.log(JSON.stringify(sendJSON));


    // return;

    // uploadfileList에 등록된 모든 input type=file 을 등록한다. 
    // 동일한 파일명이 존재할 경우 오류 처리 된다.
    /*
    var bUpload = "";
    var nUploadFileCount = uploadfileList.length;
    for (var i=0; i<nUploadFileCount; i++){
        var tmpID = rtnIDString(uploadfileList[i]);
        var file = $(tmpID)[0].files[0];
        var formData = new FormData();
        formData.append("uploadfile", file);
        formData.append("uploadstamp", uploadstamp);
        formData.append("customeridx", baseinfo_json[baseinfo_customerid]);
        bUpload = send_formdata(formData, "js/upload.php"); 
    }
    */

    // 퀴즈 인덱스가 존재할 경우 Update, 없을 경우 Insert
    var e_idx = TrimData('#e_idx');
    var params = {};   
    var rtnMessage = ""; 
    if (isEmpty(e_idx)){
        params.cmd = "insert_event";
        rtnMessage = '이벤트를 등록했습니다.';
    }
    else{    
        params.cmd = "update_event";
        params.e_idx = e_idx;
        rtnMessage = '이벤트를 수정했습니다.';
    }    

    // 특수문자 처리를 위해 encodeURIComponent decodeURIComponent
    params.e_title = baseinfo_json[baseinfo_event_title];
    params.e_description = baseinfo_json[baseinfo_event_description];            // 이벤트명은 미사용
    params.e_customer_idx = baseinfo_json[baseinfo_customerid];
    params.e_startdate = baseinfo_json[baseinfo_event_start_date];
    params.e_enddate = baseinfo_json[baseinfo_event_end_date];
    params.e_mainimage = baseinfo_json[baseinfo_mainimage];
    params.e_data = JSON.stringify(sendJSON);

    var eventdir = send_paramdata(params, false, true);
    if (!isEmpty(e_idx)){
        eventdir = e_idx;          
    }
    var szUpload = "";
    if ($.isNumeric(eventdir)){
        var nUploadFileCount = uploadfileList.length;
        if (nUploadFileCount != 0){  // 업로드할 파일이 존재할 경우     
            for (var i=0; i<nUploadFileCount; i++){
                var tmpID = rtnIDString(uploadfileList[i]);
                //var file = encodeURIComponent($(tmpID)[0].files[0]);
                var file = $(tmpID)[0].files[0];
                var formData = new FormData();
                formData.append("uploadfile", file);
                formData.append("uploadstamp", uploadstamp);
                formData.append("eventdir", eventdir);
                szUpload  = send_formdata(formData, false, "js/upload.php"); 
                if (szUpload != 'success'){
                    alert('파일 업로드 도중 오류가 발생했습니다.\n\n파일명 : ' + file);
                    return;
                }
            }
        }
        alert(rtnMessage);
        goToPage("oxquiz_page.html", "e_idx=" + eventdir);
    }
    else{
        alert('이벤트를 등록에 실패했습니다.');
    }
});
//ox 퀴즈 다음 버튼 클릭시 
$(document).on('click', '#btn_next', function(){
    // 이벤트 참가자 정보 체크
    if ($(rtnIDString(privacy_name)).length) {
        if (isEmptyMsg(TrimData(rtnIDString(privacy_name)), "이름을 입력하세요.")){ 
            $(rtnIDString(privacy_name)).focus();
            return 
        };
    }
    if ($(rtnIDString(privacy_phone)).length) {
        if (isEmptyMsg(TrimData(rtnIDString(privacy_phone)), "연락처를 입력하세요.")){ 
            $(rtnIDString(privacy_phone)).focus();
            return 
        };
    }
    if ($(rtnIDString(privacy_email)).length) {
        if (isEmptyMsg(TrimData(rtnIDString(privacy_email)), "이메일을 입력하세요.")){ 
            $(rtnIDString(privacy_email)).focus();
            return 
        };
    }

    if (!$('#checbox_agreed').is(':checked')){
        alert('경품 발송을 위해 개인정보처리방침에 동의하셔야 합니다.');
        return;
    }
    swiper.slideNext();
});

// ox퀴즈 정답 클릭시
$(document).on('click', '.oxImg', function(){
    // var e_idx = decodeURI(decodeURIComponent($.urlParam("e_idx")));
    var userAns = $(this).data('ox');
    var quizAns = $(this).data('answer');
    var QNum = $(this).data('quiznum');
    var Qscore = $(this).data('socre');

    if(userAns === quizAns){
            $('#popup_anwer' + QNum + '').text("정답입니다");
            $('#ok_layer_popup' + QNum + '').css({'visibility':'visible', 'opacity':'1'});
            $('.ok_layer_popup .popup_content').css({'display':'block'});

            user_score.push(Qscore);
    }else{
            $('#popup_anwer' + QNum + '').text("오답입니다");
            $('#ok_layer_popup' + QNum + '').css({'visibility':'visible', 'opacity':'1'});
            $('.ok_layer_popup .popup_content').css({'display':'block'});
    }
    $('.popup_next').click(function(){
        $('#ok_layer_popup' + QNum + '').css({'visibility':'hidden','opacity':'0'});
        $('#ok_layer_popup' + QNum + '').css({'display':'none'});
        swiper.slideNext();
    });

   alert(user_score) 
});

$(document).on('click', '.last-contents', function(){
    // 로딩화면 띄움
    var loading = document.getElementById("untree_co--overlayer");
    loading.style.opacity = "1";
    loading.style.visibility = "visible";
    loading.classList.add('active');
    $("#untree_co--overlayer").css({"pointer-events":"auto"});

    // 유저 정보 받기
    let user_name = TrimData(rtnIDString(privacy_name));
    let user_email = TrimData(rtnIDString(privacy_email));
    let user_phone = TrimData(rtnIDString(privacy_phone));

    var quizLength =  user_score.length;
    var totalScore = "";
    for(var i = 0; i < quizLength; i++){
        if(totalScore === ""){
            totalScore = 0 + user_score[i];
        }else{
            totalScore = totalScore + user_score[i];
        }
    }
    //인증샷 값 받기  
    var uploadstamp = getTimeStamp();
    let shot_arr = [];
    var tmpUpload_arr = [];         // 실제 등록할 파일
    let fileCount = $(".file-count").length;
    for(var i = 0; i <fileCount; i++){
        let fileupLoad = $(`#uploadshotType${i}`).val();
        tmpUpload_arr.push(`#uploadshotType${i}`);  // 파일 관련 엘리먼트 ID
        let fileName = getFileNameExceptPath(fileupLoad);
        // 인증샷이 있을 경우 인증샷을 등록하지 않으면 return
        if (isEmpty(fileName)){
            alert('인증샷을 첨부하셔야 합니다.');
            return;
        }
        shot_arr.push(uploadstamp + '_' + fileName);
    }

    var e_idx =  $("#e_idx").val();
    var Uscore = 'score=' + totalScore;
    var szParam = 'e_idx=' + e_idx;
    var szParam2 = 'score_count=' + quizLength;

    // 인증샷이 있을 경우 폼을 생성해 파일 전송
    var szUpload = "";
    var nUploadFileCount = tmpUpload_arr.length;
    //alert(g_inpath);
    if (nUploadFileCount > 0){
        // 사용자 인증샷을 업로드 하기 위한 폴더 - file/idx
        for (var i=0; i<nUploadFileCount; i++){
            var formData = new FormData();
            var tmpID = tmpUpload_arr[i];
            var file = $(tmpID)[0].files[0];
            formData.append("uploadfile", file);
            formData.append("uploadstamp", uploadstamp);
            formData.append("eventdir", "event_" + e_idx);
            szUpload = send_formdata(formData, false, "js/upload.php"); 
        }
        if (szUpload === "success"){
            // 결과 전송
            var pParms = {};
            pParms.cmd = "send_event_result";
            pParms.e_idx = e_idx;
            pParms.user_name = user_name;
            pParms.user_email = user_email;
            pParms.user_phone = user_phone;
            pParms.user_score = totalScore;
	        pParms.user_inpath = g_inpath;
            pParms.shot = shot_arr.join(",");
            pParms.resultArray = "";
            var sendResult = send_paramdata(pParms, false, false);
            if (sendResult === "success"){
            goToResultPage('ox_result.html', szParam, Uscore, szParam2);
            }
            else{
                alert(sendResult);
            }
        }
        else{
            alert('인증샷 등록 과정에서 오류가 발생했습니다.');
        }
    }
    else{
        // 결과 전송
        var pParms = {};
        pParms.cmd = "send_event_result";
        pParms.e_idx = e_idx;
        pParms.user_name = user_name;
        pParms.user_email = user_email;
        pParms.user_phone = user_phone;
        pParms.user_score = totalScore;
        pParms.user_inpath = g_inpath;
        pParms.shot = shot_arr.join(",");
        pParms.resultArray = "";
        var sendResult = send_paramdata(pParms, false, true);
        if (sendResult === "success"){
            goToResultPage('ox_result.html', szParam, Uscore, szParam2);
        }
        else{
            alert('이벤트 결과를 전송할 수 없습니다.');
        }
    }
    
    

});