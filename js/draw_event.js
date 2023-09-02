let global_customer_json = {};
let global_evnet_json = {};
let global_event_list_json = {}; 
let global_event_result_json = {};

let global_ox_result_array = []; // [0, 1]     첫번째값은 정답 개수, 두번쨰 값은 점수합산 [2, 30]

// 1번째 문제 : global_ox_result_array[0, 10];
//     정답이면 : var ntemp = global_ox_result_array[0] + 1
//     var nscore= global_ox_result_array[1] + 10
// 2번째 문제 : global_ox_result_array[0] = ntemp;
//     global_ox_result_array[1] = nscore;

// 타겟에 HTML 코드를 그린다.
//  pHtml : Html 코드
//  pTarget : 타겟 아이디
function draw_html(pTarget, pHtml){
  $(pTarget).html(pHtml);
}

// 값을 확인 후 속성을 설정 한다.
function toggelCheckBox(bchecked, elementName, atrrName){
  if(bchecked){
      $(elementName).prop(atrrName, false);
  }else{
      $(elementName).prop(atrrName, true);
  }
}

// 로그인이 되었을 경우 화면 출력 처리 (pLogin : true일 경우 보일 화면)
function ToggleLoginDiv(pLogin){
  // 로그인 되었을 경우 
  if (pLogin){
      $('.div-after-login-2').css('display', 'flex');
      $('.div-before-login').css('display', 'none');
      $('#btn_login_popup_open').css('display', 'none');
      $('#btn_logout').css('display', 'block');
      // btn_login_popup_close 버튼을 클릭하는 효과
      $('#btn_login_popup_close').trigger('click');
  }
  // 로그아웃 되었을 경우 
  else{
      $('.div-after-login-2').css('display', 'none');
      $('.div-before-login').css('display', 'block');
      $('#btn_login_popup_open').css('display', 'block');
      $('#btn_logout').css('display', 'none');
  }
}

// 고객사 리스트를 정해진 타겟에 그린다.
//  pJSON : 고객사 정보 JSON
//  pTarget : 타겟 ID
//  pKey : 키 존재 / 키가 같으면 => option selected
function draw_selectbox_customerlist(pJSON, pTarget){
  var szHTML = `<select class="addit-grid-8 addit-input-type1" id="make_customer_list">`;
  // JSON을 분석후
  try {
      $.each(pJSON, function (key, Items) {
          if (key == "tabledata") {
            tblJSON = JSON.parse(JSON.stringify(pJSON.tabledata));
            $.each(tblJSON, function (skey, sItems) {
                szHTML = szHTML + '<option value=' + sItems.cs_idx + '>' + sItems.cs_name + '</option>';
            });
          }
      });
  } catch (e) {
      console.log("draw_selectbox_customerlist(parser) : " + e.message);
  }
  szHTML = szHTML + '</select>'
  // 타겟에 데이터를 그린다.
  $(pTarget).html(szHTML);
}

// 고객사 정보를 출력한다.
//  pJSON : 고객사 정보 JSON 
//  pTarget : 타겟 ID
function draw_customer_list(pJSON, pTarget, pPagetarget, pnowPage){ 
  var dataHTML = "";
  var TotalDataCount = 0;
  try {
      JsonData = JSON.parse(JSON.stringify(pJSON));
      $.each(JsonData, function (key, Items) {
          TotalDataCount = pJSON.totcount;
          if (key == "tabledata") {
              tblJSON = JSON.parse(JSON.stringify(pJSON.tabledata));
              $.each(tblJSON, function (skey, sItems) {
                  dataHTML = dataHTML + '<tr><td class="addit-table-grid1 addit-padding1"><input type="checkbox" id=""></td>';
                  dataHTML = dataHTML + '<td class="addit-table-grid2">' + sItems.cs_name + '</td>';
                  dataHTML = dataHTML + '<td class="addit-table-grid3 addit-padding1">';
                  dataHTML = dataHTML + '<button class="addit-button-type7" id="btn_modify_customer" value="' + sItems.cs_idx + '">수정</button>';
                  dataHTML = dataHTML + '<button class="addit-button-type8" id="btn_delete_customer" value="' + sItems.cs_idx + '">삭제</button>';
                  dataHTML = dataHTML + '</td>';
                  dataHTML = dataHTML + '</tr>';
              });
          }
      });
      $(pTarget).html(dataHTML);
      szPageHtml = paging(TotalDataCount, Data_Per_Page_Count, Per_Page_Count, pnowPage, "customer");
      $(pPagetarget).html(szPageHtml);
  } catch (e) {
      console.log("draw_customer_list(parser) : " + e.message);
  }
}

// 이벤트 리스트 출력
//  pJSON : 전체 이벤트 리스트 JSON (global_event_list)
//  pnowPage : 현재 출력될 페이지
function draw_event_list(pJSON, pTarget, pPagetarget, pnowPage){ 
   
  var dataHTML = ""; 
  var TotalDataCount = 0;
  var nowDataCount = 0;
  try{
      $.each(pJSON, function (key, Items) {
          // 페이징을 위한 정보를 구한다.
          TotalDataCount = pJSON.totcount;
          nowDataCount = pJSON.tabledata.length;

        if (key == "tabledata") {
            tblJSON = JSON.parse(JSON.stringify(pJSON.tabledata));
            $.each(tblJSON, function (skey, sItems) {
                var name = ""
                dataHTML = dataHTML + '<div class="addit-event-box">';
                dataHTML = dataHTML + '<img  class="addit-event-img" src="file/' + sItems.e_idx + '/' + sItems.e_mainimage + '" alt="이벤트메인이미지">';
                dataHTML = dataHTML + '<div class="addit-event-text">';
                var tmpData = JSON.parse(JSON.stringify(sItems.e_data));
                    tmpData = JSON.parse(tmpData)
                    $.each(tmpData, function (skey2, sItems2) {
                        if(skey2 === "baseinfo"){
                            name = sItems2["customer_name"];
                            if(name.indexOf('(') != -1){
                                name =  name.split('(');
                                name = name[0]
                              }
                        }
                    });
                dataHTML = dataHTML + '<h1 >[' + name + ']<br>' + DecodingUC(sItems.e_title) + '</h1>';
                // dataHTML = dataHTML + '<h1 >' + DecodingUC(sItems.e_title) + '</h1>'; 
                dataHTML = dataHTML + '<p><span class="addit-bold">이벤트기간 :</span>';
                dataHTML = dataHTML +  get_string_length(sItems.e_startdate, 0, 10) + ' ~ ';
                dataHTML = dataHTML +  get_string_length(sItems.e_enddate, 0, 10) + '</p>';
                dataHTML = dataHTML + '<p><span class="addit-bold">' + DecodingUC(sItems.e_description) + '</span></p>';
                dataHTML = dataHTML + '<div class="addit-event-btns div-after-login-2" id="div_after_login_2">';
                dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-result-page" id="btn_result_page" data-e_idx="' + sItems.e_idx + '">관리자페이지</button>';
                dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-modify" id="btn_event_modify" data-e_idx=' + sItems.e_idx + '>수정</button>';
                dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-delete" id="btn_event_delete" data-e_idx=' + sItems.e_idx + '>삭제</button>';
                dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-go" id="btn_event_go" data-e_idx=' + sItems.e_idx + '>시작하기</button>';
                /*
                date : 2023-02-20 / writer : 정용재
                desc : 활성화 비활성화 버튼 class : addit-btn-result-page로 통일
                */
                if (sItems.e_active == '1'){
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-result-page" id="btn_event_active" data-e_idx=' + sItems.e_idx + '>비활성화</button>';
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-copy" id="btn_event_copy" data-copy="copy" data-e_idx=' + sItems.e_idx + '>이벤트복사</button>';
                }else{   
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-result-page" id="btn_event_active" data-e_idx=' + sItems.e_idx + '>활성화</button>';
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-copy" id="btn_event_copy" data-copy="copy" data-e_idx=' + sItems.e_idx + '>이벤트복사</button>';
                }
                dataHTML = dataHTML + '</div>';
                dataHTML = dataHTML + '<div class="addit-event-btns" id="div_before_login">';
                // 활성화되고 이벤트 기간일 경우에만 시작하기가 가능하도록 해야 한다.
                if (sItems.e_active == '1')
                    dataHTML = dataHTML + '<button class="addit-btn-type6 div-before-login addit-btn-event-go" data-e_idx="' + sItems.e_idx + '">참여하기</button>';
                dataHTML = dataHTML + '</div>';
                dataHTML = dataHTML + '</div>';
                dataHTML = dataHTML + '</div>';
            });
            
        }

      });
    //   $(pTarget).html("");
      $(pTarget).html(dataHTML);

      // 페이징 처리
      szPageHtml = paging(TotalDataCount, Data_Per_Page_Count, Per_Page_Count, pnowPage, "event");
      $(pPagetarget).html(szPageHtml);
  } catch (e) {
      console.log("loaddata(parser) : " + e.message);
  }
}

// 진행예정 데이터
function draw_event_list_prev(pJSON, pTarget, pPagetarget, pnowPage){ 
   
  var dataHTML = ""; 
  var TotalDataCount = 0;
  var nowDataCount = 0;
  try{
      $.each(pJSON, function (key, Items) {
          // 페이징을 위한 정보를 구한다.
          TotalDataCount = pJSON.totcount;
          nowDataCount = pJSON.tabledata.length;

        if (key == "tabledata") {
            tblJSON = JSON.parse(JSON.stringify(pJSON.tabledata));
            $.each(tblJSON, function (skey, sItems) {
                var data = getTodayDate();
                var starDate = get_string_length(sItems.e_startdate, 0, 10);
                starDate = starDate.replaceAll("-","");
                if(Number(data) <= Number(starDate) && sItems.e_active != '1'){
                    var name = "";
                    dataHTML = dataHTML + '<div class="addit-event-box">';
                    dataHTML = dataHTML + '<img  class="addit-event-img" src="file/' + sItems.e_idx + '/' + sItems.e_mainimage + '" alt="이벤트메인이미지">';
                    dataHTML = dataHTML + '<div class="addit-event-text">';
                    var tmpData = JSON.parse(JSON.stringify(sItems.e_data));
                    tmpData = JSON.parse(tmpData)
                    $.each(tmpData, function (skey2, sItems2) {
                        if(skey2 === "baseinfo"){
                            name = sItems2["customer_name"];
                            if(name.indexOf('(') != -1){
                                name =  name.split('(');
                                name = name[0]
                              }else{
                                name = sItems2["customer_name"];
                              }
                        }
                    });
                    dataHTML = dataHTML + '<h1 >[' + name + ']<br>' + DecodingUC(sItems.e_title) + '</h1>';
                    // dataHTML = dataHTML + '<h1 >' + DecodingUC(sItems.e_title) + '</h1>';   
                    dataHTML = dataHTML + '<p><span class="addit-bold">이벤트기간 :</span>';
                    dataHTML = dataHTML +  get_string_length(sItems.e_startdate, 0, 10) + ' ~ ';
                    dataHTML = dataHTML +  get_string_length(sItems.e_enddate, 0, 10) + '</p>';
                    dataHTML = dataHTML + '<p><span class="addit-bold">' + DecodingUC(sItems.e_description) + '</span></p>';
                    dataHTML = dataHTML + '<div class="addit-event-btns div-after-login-2" id="div_after_login_2">';
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-result-page" id="btn_result_page" data-e_idx="' + sItems.e_idx + '">관리자페이지</button>';
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-modify" id="btn_event_modify" data-e_idx=' + sItems.e_idx + '>수정</button>';
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-delete" id="btn_event_delete" data-e_idx=' + sItems.e_idx + '>삭제</button>';
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-go" id="btn_event_go" data-e_idx=' + sItems.e_idx + '>시작하기</button>';
                    /*
                    date : 2023-02-20 / writer : 정용재
                    desc : 활성화 비활성화 버튼 class : addit-btn-result-page로 통일
                    */
                    if (sItems.e_active == '1'){
                        dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-result-page" id="btn_event_active" data-e_idx=' + sItems.e_idx + '>비활성화</button>';
                        dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-copy" id="btn_event_copy" data-copy="copy" data-e_idx=' + sItems.e_idx + '>이벤트복사</button>';
                    }else{   
                        dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-result-page" id="btn_event_active" data-e_idx=' + sItems.e_idx + '>활성화</button>';
                        dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-copy" id="btn_event_copy" data-copy="copy" data-e_idx=' + sItems.e_idx + '>이벤트복사</button>';
                    }
                    dataHTML = dataHTML + '</div>';
                    dataHTML = dataHTML + '<div class="addit-event-btns" id="div_before_login">';
                    // 활성화되고 이벤트 기간일 경우에만 시작하기가 가능하도록 해야 한다.
                    if (sItems.e_active == '1')
                        dataHTML = dataHTML + '<button class="addit-btn-type6 div-before-login addit-btn-event-go" data-e_idx="' + sItems.e_idx + '">참여하기</button>';
                    dataHTML = dataHTML + '</div>';
                    dataHTML = dataHTML + '</div>';
                    dataHTML = dataHTML + '</div>';
                }
            });
            
        }

      });
    //   $(pTarget).html("");
      $(pTarget).html(dataHTML);

      // 페이징 처리
      szPageHtml = paging(TotalDataCount, Data_Per_Page_Count, Per_Page_Count, pnowPage, "event");
      $(pPagetarget).html(szPageHtml);
  } catch (e) {
      console.log("loaddata(parser) : " + e.message);
  }
}

// 종료 데이터
function draw_event_list_end(pJSON, pTarget, pPagetarget, pnowPage){ 
   
  var dataHTML = ""; 
  var TotalDataCount = 0;
  var nowDataCount = 0;
  try{
      $.each(pJSON, function (key, Items) {
          // 페이징을 위한 정보를 구한다.
          TotalDataCount = pJSON.totcount;
          nowDataCount = pJSON.tabledata.length;

        if (key == "tabledata") {
            tblJSON = JSON.parse(JSON.stringify(pJSON.tabledata));
            $.each(tblJSON, function (skey, sItems) {
                var data = getTodayDate();
                var endDate = get_string_length(sItems.e_enddate, 0, 10);
                endDate = endDate.replaceAll("-","");
                if(Number(data) > Number(endDate)){
                    var name = "";
                    dataHTML = dataHTML + '<div class="addit-event-box">';
                    dataHTML = dataHTML + '<img  class="addit-event-img" src="file/' + sItems.e_idx + '/' + sItems.e_mainimage + '" alt="이벤트메인이미지">';
                    dataHTML = dataHTML + '<div class="addit-event-text">';
                    var tmpData = JSON.parse(JSON.stringify(sItems.e_data));
                    tmpData = JSON.parse(tmpData)
                    $.each(tmpData, function (skey2, sItems2) {
                        if(skey2 === "baseinfo"){
                            name = sItems2["customer_name"];
                            if(name.indexOf('(') != -1){
                                name =  name.split('(');
                                name = name[0]
                              }else{
                                name = sItems2["customer_name"];
                              }
                        }
                    });
                    dataHTML = dataHTML + '<h1 >[' + name + ']<br>' + DecodingUC(sItems.e_title) + '</h1>';
                    // dataHTML = dataHTML + '<h1 >' + DecodingUC(sItems.e_title) + '</h1>'; 
                    dataHTML = dataHTML + '<p><span class="addit-bold">이벤트기간 :</span>';
                    dataHTML = dataHTML +  get_string_length(sItems.e_startdate, 0, 10) + ' ~ ';
                    dataHTML = dataHTML +  get_string_length(sItems.e_enddate, 0, 10) + '</p>';
                    dataHTML = dataHTML + '<p><span class="addit-bold">' + DecodingUC(sItems.e_description) + '</span></p>';
                    dataHTML = dataHTML + '<div class="addit-event-btns div-after-login-2" id="div_after_login_2">';
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-result-page" id="btn_result_page" data-e_idx="' + sItems.e_idx + '">관리자페이지</button>';
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-modify" id="btn_event_modify" data-e_idx=' + sItems.e_idx + '>수정</button>';
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-delete" id="btn_event_delete" data-e_idx=' + sItems.e_idx + '>삭제</button>';
                    dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-go" id="btn_event_go" data-e_idx=' + sItems.e_idx + '>시작하기</button>';
                    /*
                    date : 2023-02-20 / writer : 정용재
                    desc : 활성화 비활성화 버튼 class : addit-btn-result-page로 통일
                    */
                    if (sItems.e_active == '1'){
                        dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-result-page" id="btn_event_active" data-e_idx=' + sItems.e_idx + '>비활성화</button>';
                        dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-copy" id="btn_event_copy" data-copy="copy" data-e_idx=' + sItems.e_idx + '>이벤트복사</button>';
                    }else{   
                        dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-result-page" id="btn_event_active" data-e_idx=' + sItems.e_idx + '>활성화</button>';
                        dataHTML = dataHTML + '<button class="addit-event-btns2 addit-btn-event-copy" id="btn_event_copy" data-copy="copy" data-e_idx=' + sItems.e_idx + '>이벤트복사</button>';
                    }
                    dataHTML = dataHTML + '</div>';
                    dataHTML = dataHTML + '<div class="addit-event-btns" id="div_before_login">';
                    // 활성화되고 이벤트 기간일 경우에만 시작하기가 가능하도록 해야 한다.
                    if (sItems.e_active == '1')
                        dataHTML = dataHTML + '<button class="addit-btn-type6 div-before-login addit-btn-event-go" data-e_idx="' + sItems.e_idx + '">참여하기</button>';
                    dataHTML = dataHTML + '</div>';
                    dataHTML = dataHTML + '</div>';
                    dataHTML = dataHTML + '</div>';
                }
            });
            
        }

      });
    //   $(pTarget).html("");
      $(pTarget).html(dataHTML);

      // 페이징 처리
      szPageHtml = paging(TotalDataCount, Data_Per_Page_Count, Per_Page_Count, pnowPage, "event");
      $(pPagetarget).html(szPageHtml);
  } catch (e) {
      console.log("loaddata(parser) : " + e.message);
  }
}

// 페이징 처리 
// totalData : 전체 데이터 개수 , dataPerPage : 한 페이지당 출력할 개수
// pageCount : 한 화면에 출력될 페이지 숫자, currentPage : 현재 페이지 번호
function paging(totalData, dataPerPage, pageCount, currentPage, type){
  //console.log("currentPage : " + currentPage);

  var totalPage = Math.ceil(totalData/dataPerPage);    // 총 페이지 수
  var pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹

  var MobilePageGroup = Math.ceil(currentPage/5);      // 모바일은 5개식 보여준다.

  var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
  if (last > totalPage)
      last = totalPage;
  var first = last - (pageCount-1);    // 화면에 보여질 첫번째 페이지 번호
  var next = last+1;
  var prev = first-1;


  var Mobilelast = MobilePageGroup * 5;    // 화면에 보여질 마지막 페이지 번호
  if (Mobilelast > totalPage)
      Mobilelast = totalPage;
  var Mobilefirst = Mobilelast - (4);    // 화면에 보여질 첫번째 페이지 번호
  var Mobilenext = Mobilelast+1;
  var Mobileprev = Mobilefirst-1;


  var html = "";

  html = '<ul class="addit-center1 addit-margin3">';

  if (first <= 0){
      first = 1;
  }
  if(prev > 0){
      html += '<li class="addit-page-a"><i class="fa-solid fa-angles-left"></i></li>'
      html += '<li class="addit-page-a"><i class="fa-solid fa-chevron-left" data-type="' + type + '" data-page="' + prev + "'></i></li>";
  }

  for(var i=first; i <= last; i++){
      if (i == currentPage) {
          html += "<li class='addit-page-a active' id='addit_page_a" + i + "' data-type='" + type + "' data-page='" + i + "'>" + i + "</li>";
      }
      else {
        html += "<li class='addit-page-a' id='addit_page_a" + i + "' data-type='" + type + "' data-page='" + i + "'>" + i + "</li>";
      }
  }

  if (last < totalPage) {
    html += "<li class='addit-page-a' data-type='" + type + "' data-page='" + next + "'><i class='fa-solid fa-chevron-right'></i></li>";
  }

  if (totalPage > pageCount) {
      html += "<li class='addit-page-a' data-type='" + type + "' data-page='" + totalPage + "'><i class='fa-solid fa-angles-right'></i></li>";

  }

  /* 모바일용 리스트 출력을 위한 Paging 출력(최대개수 5개) */
  /*
  html = html + '<div class="paging2-wrap">';
  html = html + '<ul class="paging2">';

  if (Mobilefirst < 0){
      Mobilefirst = 1;
  }
  if(Mobileprev > 0){
      html += "<li><a href='javascript:void(0);' data-page='1'><img src='images/start.png'></a></li>";
      html += "<li><a href='javascript:void(0);' data-page='" + Mobileprev + "'><img src='images/prev.png'></a></li>";
  }

  for(var i=Mobilefirst; i <= Mobilelast; i++){
      if (i == currentPage) {
          html += "<li class='SelectedPage'><a href='javascript:void(0);' data-page='" + i + "'>" + i + "</a></li>";

      }
      else {
          html += "<li><a href='javascript:void(0);' data-page='" + i + "'>" + i + "</a></li>";
      }
  }

  if (Mobilelast < totalPage) {
      html += "<li><a href='javascript:void(0);' data-page='" + Mobilenext + "'><img src='images/next.png'></a></li>";
  }

  html += "<li><a href='javascript:void(0);' data-page='" + totalPage + "'><img src='images/end.png'></a></li>";
  html = html + "</ul></div>";
  */  
  return html;
}





/*****************************************************************************
// 이벤트 관련 동적 생성 인터페이스 
/*****************************************************************************/

// 타겟내 HTML을 초기화 한다.
function ClearHTML(pTarget){
    $(pTarget).html("");       
}
// 유의 사항 개수 만큼 입력 Text 상자를 그린다.
function DrawEventInfo(pCount, pTarget){
    var tmpHTML = "";
    var tmpID = "";

    for(var i=0; i<pCount; i++){
        tmpID = baseinfo_Notice + i;
        tmpHTML = tmpHTML + '<input type="text" id="' + tmpID + '" class="addit-grid-5 addit-input-type1 sInfo" placeholder="유의사항을 입력하세요." maxlength="150"></input>';
    }
    $(pTarget).html(tmpHTML);
}

// 퀴즈 사전정보 개수 만큼 입력 Text 상자를 그린다.
function DrawPrevInfo(pCount, pTarget){
    var szHTML = "";

    for(var i=0; i<pCount; i++){
        var sztmpName = QuizPreInfo_linkType + i;
        var szyoutubeid = sztmpName + '_1';
        var szhyperid = sztmpName + '_2';
        var sztmpLink = QuizPreInfo_preInfoLink  + i;

        szHTML = szHTML + '<div class="addit-grid-5-flex">';
        szHTML = szHTML + '<label class="addit-grid-9 addit-p" for="' + szyoutubeid + '">유튜브링크';
        szHTML = szHTML + '<input value="0" name="' + sztmpName + '" type="radio" id="' + szyoutubeid+ '"></label>';
        szHTML = szHTML + '<label class="addit-grid-9 addit-p" for="' + szhyperid + '">하이퍼링크';
        szHTML = szHTML + '<input value="1" name="' + sztmpName + '" type="radio" id="' + szhyperid + '" checked></label>';
        szHTML = szHTML + '<input type="text" id="' + sztmpLink + '" class="addit-grid-5 addit-input-type1" maxlength="150" placeholder="사전정보를 입력하세요."></div>';
    }
    $(pTarget).html(szHTML);    
}

// 인증샷 개수 만큼 입력 Text 상자를 그린다.
function DrawShotInfo(pCount, pTarget){
    var szHTML = "";

    for(var i=0; i<pCount; i++){
        var sztmpName = shot_type + i;
        var sztype1id = sztmpName + '_1';               // 구독인증샷
        var sztype2id = sztmpName + '_2';               // 댓글인증샷
        var sztype3id = sztmpName + '_3';               // 댓글인증샷
        var szshotURL = shot_shotUrl  + i;  
        var szshotTitle = shot_title  + i;        // 구독인증샷일 경우 유튜브 URL

        szHTML = szHTML + '<div class="addit-grid-5-flex">';
        szHTML = szHTML + '<label class="addit-grid-10 addit-p shot-class" for="' + sztype1id + '">';
        szHTML = szHTML + '<input type="radio" value="0" name="'+ sztmpName + '" id="' + sztype1id + '" checked>구독인증샷</label>';
        szHTML = szHTML + '<label class="addit-grid-10 addit-p shot-class" for="'+ sztype2id + '">';
        szHTML = szHTML + '<input value="1" type="radio" name="' + sztmpName + '" id="' + sztype2id + '">댓글인증샷</label>';
        szHTML = szHTML + '<label class="addit-grid-10 addit-p shot-class" for="'+ sztype3id + '">';
        szHTML = szHTML + '<input value="2" type="radio" name="' + sztmpName + '" id="' + sztype3id + '">파일첨부</label>';
        szHTML = szHTML + '<input class="addit-grid-3 addit-input-type1" maxlength=50 id="'+ szshotTitle + '" type="text" placeholder="링크에 표시될 제목을 입력하세요.">';
        szHTML = szHTML + '<input class="addit-grid-3 addit-input-type1 shot-url" maxlength=100 id="'+ szshotURL + '" type="text" placeholder="구독대상 URL을 입력하세요.">';
        szHTML = szHTML + '</div>';
    }
    $(pTarget).html(szHTML);
}

// 인증샷 개수 만큼 입력 Text 상자를 그린다.
function DrawSnsView(pCount, pTarget){
    var szHTML = "";

    for(var i=0; i<pCount; i++){
        var sztmpName = sns_view_type + i;

        szHTML = szHTML + '<div class="addit-grid-5-flex">';
        szHTML = szHTML + '<input class="addit-grid-3 addit-input-type1 shot-url" id="'+ sztmpName + '" type="text" placeholder="콘텐츠 url을 입력하세요">';
        szHTML = szHTML + '</div>';
    }
    $(pTarget).html(szHTML);
}


// 인증샷 개수 만큼 입력 Text 상자를 그린다.
function DrawFileDown(pCount, pTarget){
    var szHTML = "";

    for(var i=0; i<pCount; i++){
        var sztmpName = file_down_type + i;

        szHTML = szHTML + '<div class="addit-grid-5-flex">';
        szHTML = szHTML + '<input class="addit-grid-3 addit-input-type1 file-down" id="'+ sztmpName + '" type="file" placeholder="다운로드 파일을 입력하세요">';
        szHTML = szHTML + '</div>';
    }
    $(pTarget).html(szHTML);
}

// 퀴즈 개수 만큼 퀴즈 인터페이스를 그린다.
function DrawQuizInfo(pCount, pTarget){
    // let PA =[];
    var szHTML = ""
    let sztmpRadioName = "rname";
    let sztmpRadioID = "rid";
    let szTargetDivID = "div_target";
    var tmppblnum = 0;
    // 퀴즈 동적 추가 / 삭제를 위해 최초 퀴즈 정보를 기록한다.
    //let pblLength = $(".pblnum").length; // 첫 실행될떄 퀴즈 길이
    // 전체 퀴즈 카운트가 0일 경우 추가할 퀴즈 개수를 전체 퀴즈 카운트에 할당
    for (var i=0; i<pCount; i++){
        // 퀴즈 배열이 0일 경우 문제 인덱스는 0, 퀴즈 배열이 존재할 경우 배열의 마지막 값이 문제 인덱스
        if (Problem_Array.length === 0){
            tmppblnum = 0;
        }
        else{
           tmppblnum =  Problem_Array[Problem_Array.length-1]+1;
        }
        szHTML = "";
        szHTML = szHTML + '<div class="addit-box-type2" data-pblnum="' + String(tmppblnum) + '"><h2 class="addit-h2 addit-quiz-number">';
        szHTML = szHTML + String(tmppblnum+1);
        szHTML = szHTML + '번 퀴즈</h2>';
        szHTML = szHTML + '<button class="addit-button-right" id="btn_delete_problem" data-pblnum="' + String(tmppblnum) + '">삭제</button>';
        szHTML = szHTML + '<div class="addit-grid-5-flex addit-box-type3">';

        // 클릭 이벤트 처리를 위해 targetdivid를 input, label 모두 추가해 준다.
        szHTML = szHTML + '<label class="addit-text-quiz addit-grid-10 addit-p active" for="';
        szHTML = szHTML + sztmpRadioID + String(tmppblnum) + '_1';
        szHTML = szHTML +  '" data-targetdivid="#' + szTargetDivID + String(tmppblnum) +'">주관식';
        szHTML = szHTML +  '<input name="';
        szHTML = szHTML + sztmpRadioName + String(tmppblnum);
        szHTML = szHTML + '" type="radio" value="1" id="';
        szHTML = szHTML + sztmpRadioID + String(tmppblnum) + '_1';
        szHTML = szHTML + '" data-targetdivid="#' + szTargetDivID + String(tmppblnum) + '"></label>';
        
        szHTML = szHTML + '<label class="addit-text-quiz addit-grid-10 addit-p active" for="';
        szHTML = szHTML + sztmpRadioID + String(tmppblnum) + '_2';
        szHTML = szHTML +  '" data-targetdivid="#' + szTargetDivID + String(tmppblnum) + '">객관식';
        szHTML = szHTML +  '<input name="';
        szHTML = szHTML + sztmpRadioName + String(tmppblnum);
        szHTML = szHTML + '" type="radio" value="0" id="';
        szHTML = szHTML + sztmpRadioID + String(tmppblnum) + '_2';
        szHTML = szHTML + '" data-targetdivid="#' + szTargetDivID + String(tmppblnum) + '"></label>';

        szHTML = szHTML + '<span class="addit-sub">&nbsp;&nbsp;퀴즈유형을 선택해주세요</span></div><div class="addit-select-quiz-type" id="';
        szHTML = szHTML + szTargetDivID +  + String(tmppblnum) + '" data-pblcount="' + String(tmppblnum) + '"></div></div>';

        Problem_Array.push(tmppblnum);
        if (Problem_Array.length === 0)
            $(pTarget).html(szHTML);
        else    
            $(pTarget).append(szHTML);
    }
    console.log(Problem_Array);
}

// 개별 퀴즈를 그린다.
// 0 일 경우 사용자 클릭, 1일 경우 기존 데이터를 이용해 출력할 경우
function DrawQuiz(e, pQuizType=0, nDrawType=0){
    var szHTML = "";
    var szViewID = "";              // 
    var szBtnID = "";
    var szTitleID = "";
    var szAnswerID = "";
    var viewArea = "";              // 보기 내용을 그릴 DIV ID
    var infoImg = "";
    var infoVideo = "";
    var infoType = "";
    var infoFileName = "";
    var hintText = "";
    var ansType_textarea = "";
    var ansType_text = "";
    var ansType = "";
    var tmppoblcount = "";
    
    // 태그 유형이 라디오인것을 찾은 후 (객관식 주관식을 구하기 위해)
    // 클릭한 엘리먼트의 data값에 targetdivid 값이 존재할 경우
    if (nDrawType == 0)
        szTargetDiv = $(e.target).data('targetdivid'); 
    else
        szTargetDiv = $(e).data('targetdivid'); 

    if (!isEmpty(szTargetDiv)){
        // 퀴즈 유형 (0 : 객관식, 1 : 주관식)
        if (nDrawType == 0)
            var nQuizType = $.trim($(e.target).val());
        else
            var nQuizType = pQuizType;

        tmppoblcount = $(szTargetDiv).data('pblcount');

        // 생성되는 퀴즈 인덱스
        szViewID = QuizInfo_subVal + tmppoblcount;              // 보기 수 ID
        if (nQuizType === "0")                                  // 보기 유형
            szBtnID = "btn_" + QuizInfo_subVal + tmppoblcount;     // 보기 생성 확인 버튼 ID
        viewArea = "viewArea" + tmppoblcount;           // 보기를 그리기 위한 DIV ID

        szTitleID = QuizInfo_quizTitle + tmppoblcount;           // 퀴즈 제목 ID
        szAnswerID = QuizInfo_quizAns + tmppoblcount;         // 퀴즈 정답
        

        infoImg = QuizInfo_quizInfoType+ tmppoblcount + "_img";          // 퀴즈 정보 제공 시 이미지일 경우 ID
        infoVideo = QuizInfo_quizInfoType + tmppoblcount + "_video";      // 퀴즈 정보 제공 시 비디오일 경우 ID
        infoType = QuizInfo_quizInfoType + tmppoblcount;                  // 퀴즈 정보 제공 라디오 Name;
        infoFileName = QuizInfo_quizInfoFileName + tmppoblcount;              // 퀴즈 정보 파일명 (이미지 파일 또는 비디오 파일) ID

        hintText = QuizInfo_hint + tmppoblcount;         // 힌트 ID

        ansType_text = QuizInfo_quizAnsType + tmppoblcount + "_text";               // 정답 입력 긴글 라디오 ID
        ansType_textarea = QuizInfo_quizAnsType + tmppoblcount + "_textarea";       // 정답 입력 짧은글 라디오 ID
        ansType_radio = QuizInfo_quizAnsType + tmppoblcount + "_radio";              // 정답 입력 단일선택 라디오 ID
        ansType_checkbox = QuizInfo_quizAnsType + tmppoblcount + "_checkbox";         // 정답 입력 다중선택 라디오 ID

        ansType = QuizInfo_quizAnsType + tmppoblcount;         // 정답 입력 라디오 Name

        if (nQuizType === "0"){     
            // 보기 개수 입력 인터페이스
            szHTML = '<div class="addit-box-type3">';
            szHTML = szHTML + '<label class="addit-grid-8">보기 수</label>';
            szHTML = szHTML + '<div class="addit-grid-5-flex">';
            szHTML = szHTML + '<input class="addit-margin5 addit-input-type1 addit-subText-count" type="number" id="';
            szHTML = szHTML + szViewID + '" placeholder="문항 갯수를 입력하세요." maxlength=2 oninput="maxLengthCheck(this)">';
            szHTML = szHTML + '<button class="addit-btn-type1 addit-subText-btn" id="';
            szHTML = szHTML + szBtnID + '" data-areanum="' + tmppoblcount + '">확인</button></div></div>';

            // 객관식을 경우 다중 선택인지(checkbox인지/Radio인지)
            // 정답 유형
            szHTML = szHTML + '<div class="addit-box-type3">';
            szHTML = szHTML + '<div class="addit-grid-8"><label>정답입력유형</label></div>';
            szHTML = szHTML + '<div class="addit-grid-5-flex">';
            szHTML = szHTML + '<label class="addit-grid-11 addit-p addit-margin5 active" for="' + ansType_radio +'">단일선택';
            szHTML = szHTML + '<input type="radio" value="0" name="'+ ansType +'" id="' + ansType_radio +'" checked></label>';
            szHTML = szHTML + '<label class="addit-grid-11 addit-p" for="' + ansType_checkbox +'">다중선택';
            szHTML = szHTML + '<input type="radio" value="1" name="' + ansType +'" id="'+ ansType_checkbox +'"></label>';
            szHTML = szHTML + '</div></div>';

            // 퀴즈 제목 
            szHTML = szHTML + '<div class="addit-box-type3">';
            szHTML = szHTML + '<label class="addit-grid-8">퀴즈</label>';
            /* TODO : 주관식일 경우 퀴즈를 PlaceHolder에 표한하는 부분 처리 필요
            szHTML = szHTML + '<label class="addit-grid-8" for="PlaceHolder">문제를 PlaceHolder로 처리</label>';
            szHTML = szHTML + '<input type=checkbox id="PlaceHolder">';
            */
            szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" maxlength="100" type="text" id="' + szTitleID +'" placeholder="이벤트 제목을 입력하세요.">';
            szHTML = szHTML + '</div>';
            // 퀴즈 정답
            szHTML = szHTML + '<div class="addit-box-type3">';
            szHTML = szHTML + '<label class="addit-grid-8">퀴즈 정답</label>';
            szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" maxlength="100" type="text" id="' + szAnswerID +'" placeholder="정답을 입력하지 않으면 사용자 선택값을 답으로 처리합니다.(선택, YES/NO 등)">';
            szHTML = szHTML + '</div>';
            // 보기 내용
            szHTML = szHTML + '<div class="addit-box-type3">';
            szHTML = szHTML + '<label class="addit-grid-8">보기내용</label>';
            // 보기 세부 정보를 출력한 DIV를 생성한다.
            szHTML = szHTML + '<div class="addit-grid-5 addit-subText-view"  id="' + viewArea +'"></div></div>';

        }else{
            // 퀴즈 제목
            szHTML = '<div class="addit-box-type3">';
            szHTML = szHTML + '<label class="addit-grid-8">퀴즈</label>';
            szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" maxlength="100" type="text" id="' + szTitleID +'" placeholder="이벤트 제목을 입력하세요.">';
            szHTML = szHTML + '</div>';
            
            // 퀴즈 정답
            szHTML = szHTML + '<div class="addit-box-type3">';
            szHTML = szHTML + '<label class="addit-grid-8">퀴즈정답</label>';
            szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" maxlength="100" type="text" id="'+ szAnswerID +'" placeholder="정답을 입력하지 않으면 사용자 선택값을 답으로 처리합니다.(선택, YES/NO 등)">';
            szHTML = szHTML + '</div>';
            
            // 정답 유형
            szHTML = szHTML + '<div class="addit-box-type3">';
            szHTML = szHTML + '<div class="addit-grid-8"><label>정답입력유형</label></div>';
            szHTML = szHTML + '<div class="addit-grid-5-flex">';
            szHTML = szHTML + '<label class="addit-grid-11 addit-p addit-margin5 active" for="' + ansType_text +'">짧은 글';
            szHTML = szHTML + '<input type="radio" value="0" name="'+ ansType +'" id="' + ansType_text +'" checked></label>';
            szHTML = szHTML + '<label class="addit-grid-11 addit-p" for="' + ansType_textarea +'">긴 글';
            szHTML = szHTML + '<input type="radio" value="1" name="' + ansType +'" id="'+ ansType_textarea +'"></label>';
            szHTML = szHTML + '</div></div>';
            
        }
        // 그린다

        // 퀴즈 정보 (정보가 있을 수도 있고 없을 수도 있다)
        szHTML = szHTML + '<div class="addit-box-type3">';
        szHTML = szHTML + '<div class="addit-grid-8">';
        szHTML = szHTML + '<input class="checkbox_quiz_pinfo" type="checkbox" id="checkbox_quiz_pinfo' + String(tmppoblcount) + '">';
        szHTML = szHTML + '<label for="checkbox_quiz_pinfo' + String(tmppoblcount) + '">&nbsp;퀴즈정보</label></div>';
        szHTML = szHTML + '<div class="addit-grid-5-flex" style="display:none;">';
        szHTML = szHTML + '<label class="addit-grid-11 addit-margin5 addit-p active" for="'+ infoImg +'">이미지';
        szHTML = szHTML + '<input name="' + infoType +'" type="radio" class="quiz-info-type" value="0" id="'+ infoImg +'" class="addit-pointer" checked></label>';
        szHTML = szHTML + '<label class="addit-grid-11 addit-margin5 addit-p" for="' + infoVideo +'">비디오';
        szHTML = szHTML + '<input name="' + infoType +'" type="radio" class="quiz-info-type" value="1" id="'+ infoVideo +'" class="addit-pointer"></label>';
        szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1 quiz-info-type" type="file" id="' + infoFileName + '">';
        // 파일 미리 보기를 위한 임시 DIV (ID : infoFileName + "_img")
        szHTML = szHTML + '<div><img src="" class="addit-preview-size" id="' + infoFileName + '_img"></div>';
        szHTML = szHTML + '</div></div>';        

        // 퀴즈 힌트
        szHTML = szHTML + '<div class="addit-box-type3 addit-margin-bottom-none">';
        szHTML = szHTML + '<div class="addit-grid-8"><label>퀴즈힌트</label></div>';
        szHTML = szHTML + '<div class="addit-grid-5-flex">';
        szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" type="text" id="' + hintText +'" placeholder="힌트를 입력하세요.">';
        szHTML = szHTML + '</div></div>';

        $(szTargetDiv).html(szHTML);
    }
}

// 보기 메인 인터페이스 출력 (주고나식, 객관식)
// pQuizNum : 퀴즈 번호
function DrawView(pQuizNum){
     // 보기를 그리기 위한 DIV ID
     var szTargetID = "#viewArea" + pQuizNum;

     if (!isEmpty(szTargetID))
     {
         // 보기 수 Input ID : QuizInfo_subVal;
         szViewID = rtnIDString(QuizInfo_subVal) + pQuizNum; 
         var nViewCnt = parseInt($(szViewID).val());
         if (!fn_isNumeric(nViewCnt, '+')){
            alert('숫자(정수값, 양수)만 입력해야 합니다.');
            return;
        }
         var szHTML = "";
 

         for (var j=0; j < nViewCnt; j++){
             // View Raido Name
             var szVeiwTypeName = QuizInfo_subVal_type + pQuizNum + String(j); 
             // View Raido ID - Text
             var szViewTypeName_text = QuizInfo_subVal_type + pQuizNum  + String(j) + '_text';
             // View Radio ID - Image
             var szViewTypeName_image = QuizInfo_subVal_type + pQuizNum  + String(j) + '_image';
 
 
             szHTML = szHTML + '<div class="addit-grid-5-flex">';
             szHTML = szHTML + '<label class="addit-grid-11 addit-margin5 addit-p quiz-info-type" for="'+ szViewTypeName_text +'">텍스트';
             szHTML = szHTML + '<input name="'+ szVeiwTypeName +'" type="radio" class="quiz-info-type" data-target="' + szVeiwTypeName  +'_sub" value="0" id="';
             szHTML = szHTML + szViewTypeName_text +'" class="addit-pointer"></label>';
             szHTML = szHTML + '<label class="addit-grid-11 addit-margin5 addit-p quiz-info-type" for="' + szViewTypeName_image + '">이미지';
             szHTML = szHTML + '<input name="'+ szVeiwTypeName +'" type="radio" class="quiz-info-type" data-target="' + szVeiwTypeName  +'_sub" value="1" id="';
             szHTML = szHTML + szViewTypeName_image +'" class="addit-pointer"></label>';
             // 보기 유형에 따라 입력 인터페이스를 출력할 DIV 그린다. (유형에 따라 Text, File로 처리)
	     /*
                date : 2023-02-20 / writer : 정용재
                desc : 보기추가 div에 class="addit-grid-15" 클래스 추가
            */
             szHTML = szHTML + '<div class="addit-grid-15" id="' + szVeiwTypeName + '_sub"></div>';
             szHTML = szHTML + '</div>';    
         }
         $(szTargetID).html(szHTML);
     }
}

// 20230313 정용재 수정
// 세부 보기 내용 입력 인터페이스 출력
// pObject클릭이벤트가 발행한 Object
function DrawViewSub(pObject){
    var szTarget = pObject.data('target');
    if (!isEmpty(szTarget))
    {
        var szType =pObject.val();
        var szHTML = "";
        var sztmpID = szTarget + QuizInfo_subVal_data;
        if(szType === "0"){
            szHTML = '<input type="text" maxlength="100" class="addit-grid-5 addit-input-type1" id="' + sztmpID + '"></input><label class="addit-font-1" for="' + sztmpID + '_1"><input name="' + sztmpID + '_1" type="checkbox" id="' + sztmpID + '_1" value="1"></input>텍스트사용</label>'
        }else if(szType === "1"){
            szHTML = '<input type="file" class="addit-grid-5 addit-input-type1" id="' + sztmpID + '"></input>';
            szHTML = szHTML + '<div><img src="" class="addit-preview-size" id="' + sztmpID + '_img"></div>';
        }
        szTarget = rtnIDString(szTarget);
        $(szTarget).html(szHTML);
    }
}

// pJSON을 이용해 수정 데이터를 출력한다. (tabledata 파싱)
function drawEventData(pJSON){
    var szTmpPath = "";
    try {
        $.each(pJSON, function (key, Items) {
            if (key == "tabledata") {
                var tmpData = JSON.parse(JSON.stringify(Items)); 
                $.each(tmpData, function (key1, Items1) {
                    var szTemp = Items1.e_data;
                    szTemp = szTemp.replaceAll('\\', '');
                    szTemp = szTemp.replaceAll('`', '');
                    szTemp = szTemp.replaceAll('\'', ''); 
                    szTmpPath = "file/" + Items1['e_idx'] + "/";
                    var parseJSON = JSON.parse(szTemp);
                    $.each(parseJSON, function (key2, sItems2) {
                        switch (key2){
                            case "baseinfo" :
                                // sItems2[baseinfo_bgColor] 를 ","로 구분 (Gradient 용)
                                szTemp = sItems2[baseinfo_bgColor];
                                szTemp = szTemp.split(",");
                                if (szTemp.length > 1)
                                {
                                    $('#bgColor').wheelColorPicker('setValue', DecodingUC(szTemp[0]));
                                    $('#bgColor_End').wheelColorPicker('setValue', DecodingUC(szTemp[1]));
                                    setElementProp('#checkbox_gradient', 'checked', 1);
                                }
                                else{
                                    $('#bgColor').wheelColorPicker('setValue', DecodingUC(szTemp[0]));
                                    setElementProp('#checkbox_gradient', 'checked', 0);
                                    setElementCSS('#bgColor_End', 'display', 'none');
                                }
                                setElementValue('#event_title', DecodingUC(sItems2[baseinfo_event_title]));
                                setElementValue('#event_description', DecodingUC(sItems2[baseinfo_event_description]));
                                selected_selectbox('#select_customer_list', DecodingUC(sItems2[baseinfo_customerid]));
                                setElementValue('#event_start_date', DecodingUC(sItems2[baseinfo_event_start_date]));
                                setElementValue('#event_end_date', DecodingUC(sItems2[baseinfo_event_end_date]));
                                // 메인이미지 파일 경로 
                                szTemp = sItems2[baseinfo_mainimage];
                                if (!isEmpty(szTemp)){
                                    setElementProp(rtnIDString(baseinfo_mainimage + "_img"), "src", szTmpPath + szTemp);
                                }
                                
                                // 유의 사항
                                var aNotice = sItems2[baseinfo_Notice];
                                if ($.isArray(aNotice)) {
                                    var nArrayLength = aNotice.length;
                                    if (nArrayLength > 0){
                                        // 정적 인터페이스 설정
                                        setElementProp('#checkbox_event_info','checked', true);
                                        $('#event_info_count').val(nArrayLength);
                                        // 버튼 클릭 이벤트 진행
                                        $('#btn_event_info_count').trigger('click');
                                        // 세부 정보 입력
                                        for (var i=0; i<nArrayLength; i++){
                                            sztmpID = rtnIDString(baseinfo_Notice) + String(i);
                                            setElementValue(sztmpID, DecodingUC(aNotice[i]));
                                        }
                                    }
                                }else{
                                    toggelCheckBox(false, "#event_info_count", "disabled");
                                    toggelCheckBox(false, "#btn_event_info_count", "disabled");
                                }
                                // SNS 공유 인터페이스 출력
                                if (sItems2.sns_share[baseinfo_sns_share_kakao] == "1"){
                                    setElementProp('#checkbox_share_kakao_url','checked', true);
                                }
                                if (sItems2.sns_share[baseinfo_sns_share_facebook] === "1"){
                                    setElementProp('#checkbox_share_facebook_url','checked', true);
                                }
                                if (sItems2.sns_share[baseinfo_sns_share_blog] === "1"){
                                    setElementProp('#checkbox_share_blog_url','checked', true);
                                }
                                if (sItems2.sns_share[baseinfo_sns_share_band]  === "1"){
                                    setElementProp('#checkbox_share_band_url','checked', true);
                                }
                                if (sItems2.sns_share[baseinfo_sns_share_instagram]  === "1"){
                                    setElementProp('#checkbox_share_instagram_url','checked', true);
                                }

                                // SNS 친구 설정
                                if (sItems2.sns_friend[baseinfo_sns_friend_kakao]  != ""){
                                    setElementProp('#checkbox_friend_kakao_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_kakao), DecodingUC((sItems2.sns_friend[baseinfo_sns_friend_kakao])));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_facebook]  != ""){
                                    setElementProp('#checkbox_friend_facebook_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_facebook), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_facebook]));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_blog]  != ""){
                                    setElementProp('#checkbox_friend_blog_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_blog), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_blog]));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_band]  != ""){
                                    setElementProp('#checkbox_friend_band_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_band), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_band]));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_instagram]  != ""){
                                    setElementProp('#checkbox_friend_instagram_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_instagram), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_instagram]));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_youtube]  != ""){
                                    setElementProp('#checkbox_friend_youtube_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_youtube), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_youtube]));
                                }
                                // 트위터 추가
                                if (sItems2.sns_friend[baseinfo_sns_friend_twiter]  != ""){
                                    setElementProp('#checkbox_friend_twiter_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_twiter), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_twiter]));
                                }

                                // 유튜브
                                if (!isEmpty(sItems2[baseinfo_youtube_id])){
                                    setElementProp('#checkbox_youtube_id','checked', true);
                                    setElementValue(rtnIDString(baseinfo_youtube_id), DecodingUC(sItems2[baseinfo_youtube_id]));
                                }

                                 // sns뷰
                                 var asnsView = sItems2[sns_view_type];
                                 if ($.isArray(asnsView)) {
                                     var nArrayLength = asnsView.length;
                                     if (nArrayLength > 0){
                                         // 정적 인터페이스 설정
                                         setElementProp('#checkbox_sns_view','checked', true);
                                         $('#sns_view_count').val(nArrayLength);
                                         // 버튼 클릭 이벤트 진행
                                         $('#btn_sns_view_count').trigger('click');
                                         // 세부 정보 입력
                                         for (var i=0; i<nArrayLength; i++){
                                             sztmpID = rtnIDString(sns_view_type) + String(i);
                                             setElementValue(sztmpID, DecodingUC(asnsView[i]));
                                         }
                                     }
                                 }else{
                                     toggelCheckBox(false, "#sns_view_count", "disabled");
                                     toggelCheckBox(false, "#btn_sns_view_count", "disabled");
                                 }

                                setElementValue(baseinfo_bgColor, sItems2[baseinfo_bgColor]);
                                setElementProp(rtnIDString(baseinfo_fontSize),'checked', sItems2[baseinfo_fontSize]);
                                break;
                            // 사전정보
                            case "quizepreinfo":
                                var npreinfo = sItems2.length;
                                if (npreinfo > 0){
                                    // 정적 인터페이스 설정
                                    setElementProp('#checkbox_event_prev_info','checked', true);
                                    setElementValue('#event_prev_info_count',npreinfo);
                                    // 버튼 클릭 이벤트 진행
                                    $('#btn_event_prev_info_count').trigger('click');
                                    npreinfo = 0;
                                    $.each(sItems2, function (key3, Items3){
                                        // 세부 정보 입력 (유튜브 링크 0 / 하이퍼 링크 1)
                                        // Radio 설정 (name : shotType0 / id : shotType0_1)
                                        if (Items3[QuizPreInfo_linkType] == "0")
                                        {
                                            sztmpID = rtnIDString(QuizPreInfo_linkType) + String(npreinfo) + "_1";
                                            setElementProp(sztmpID, 'checked', true);

                                            sztmpID = rtnIDString(QuizPreInfo_preInfoLink) + String(npreinfo);
                                            setElementValue(sztmpID,  DecodingUC(Items3[QuizPreInfo_preInfoLink]));
                                        }
                                        else{
                                            sztmpID = rtnIDString(QuizPreInfo_linkType) + String(npreinfo) + "_2";
                                            setElementProp(sztmpID, 'checked', true);

                                            sztmpID = rtnIDString(QuizPreInfo_preInfoLink) + String(npreinfo);
                                            setElementValue(sztmpID,  DecodingUC(Items3[QuizPreInfo_preInfoLink]));
                                        }
                                        npreinfo = npreinfo + 1;
                                    });
                                }
                                else{
                                    toggelCheckBox(false, "#event_prev_info_count", "disabled");
                                    toggelCheckBox(false, "#btn_event_prev_info_count", "disabled");
                                }
                                break;
                            case "quize" :
                                // 퀴즈 개수를 구해 구조 인터페이스 생성
                                // 퀴즈 개수 설정
                                var nQizeCnt = sItems2.length;
                                setElementValue('#event_quiz_count', nQizeCnt);
                                $('#btn_event_quiz_count').trigger('click');
                                // radio 버튼 name = rname + 퀴즈인덱스 => rname0, rname1
                                // 선택 시는 DI로 처리 rid0_1, rid0_2
                                nQizeCnt = 0;
                                $.each(sItems2, function (key3, Items3){
                                    // 객관식일 경우 0 
                                    if (Items3[QuizInfo_type] == "0"){
                                        var sztmpID = rtnIDString('rid') + String(nQizeCnt) + "_2";
                                        setElementProp(sztmpID, 'checked', true);    
                                        DrawQuiz(sztmpID, Items3[QuizInfo_type], 1);
                                        // 
                                        // 퀴즈 제목
                                        sztmpID = rtnIDString(QuizInfo_quizTitle) + String(nQizeCnt);
                                        setElementValue(sztmpID, DecodingUC(Items3[QuizInfo_quizTitle]));
                                        // 정답
                                        sztmpID = rtnIDString(QuizInfo_quizAns) + String(nQizeCnt);
                                        setElementValue(sztmpID, DecodingUC(Items3[QuizInfo_quizAns]));
                                        // 정답 유형
                                        if (Items3[QuizInfo_quizAnsType] == "0")        // Text이면
                                            sztmpID = rtnIDString(QuizInfo_quizAnsType) + String(nQizeCnt) + "_radio";
                                        else    
                                            sztmpID = rtnIDString(QuizInfo_quizAnsType) + String(nQizeCnt) + "_checkbox";
                                        setElementProp(sztmpID, "checked", "1");

                                        // 퀴즈 사전 정보
                                        if (Items3[QuizInfo_quizInfoType] == "0")        // Text이면
                                            sztmpID = rtnIDString(QuizInfo_quizInfoType) + String(nQizeCnt) + "_img";
                                        else    
                                            sztmpID = rtnIDString(QuizInfo_quizInfoType) + String(nQizeCnt) + "_video";
                                        setElementProp(sztmpID, "checked", "1");
                                         // 퀴즈 정보 파일 - ToDo : 클릭해서 정보를 확인해 줄 수 있도록 처리 필요
                                        // 퀴즈 정보 파일 - ToDo : 클릭해서 정보를 확인해 줄 수 있도록 처리 필요
                                        szTemp = rawurlencode(Items3[QuizInfo_quizInfoFileName]);
                                        if (!isEmpty(szTemp)){
                                            sztmpID = rtnIDString(QuizInfo_quizInfoFileName) + String(nQizeCnt) + "_img";
                                            setElementProp(sztmpID, "src", szTmpPath + szTemp);
                                            // 퀴즈 정보 파일이 있을 경우 "퀴즈정보" 체크박스는 선택 상태로 설정한다.
                                            var tmpcheckboxID = rtnIDString("checkbox_quiz_pinfo") + String(nQizeCnt);
                                            $('.checkbox_quiz_pinfo').trigger('click');
                                        }

                                        // 퀴즈 힌트
                                        sztmpID = rtnIDString(QuizInfo_hint) + String(nQizeCnt);
                                        setElementValue(sztmpID, DecodingUC(Items3[QuizInfo_hint]));

                                        //보기를 그린다. (ID : subVal + 퀴즈번호)
                                        sztmpID = rtnIDString(QuizInfo_subVal) + String(nQizeCnt);
                                        nViewCount = Items3[QuizInfo_subVal].length;
                                        if (nViewCount > 0){
                                            setElementValue(sztmpID, nViewCount);
                                            // 보기 생성 클릭 이벤트
                                            DrawView(nQizeCnt);
                                            //$('.addit-subText-btn').trigger('click');
                                            // 보기 값을 생성 한다.
                                            ntmpViewCount = 0;
                                            $.each(Items3[QuizInfo_subVal], function (key4, Items4){
                                                if (Items4[QuizInfo_subVal_type] == "0")
                                                {
                                                    sztmpID = rtnIDString(QuizInfo_subVal_type) + String(nQizeCnt) + String(ntmpViewCount) +  "_text"; // 텍스트일 경우
                                                    setElementProp(sztmpID, 'checked', true);
                                                    DrawViewSub($(sztmpID));        
                                                    sztmpID = rtnIDString(QuizInfo_subVal_type) + String(nQizeCnt) + String(ntmpViewCount);
                                                    sztmpID = sztmpID + "_sub" + QuizInfo_subVal_data;
                                                    var subTextChk = sztmpID + "_1";
                                                    // id : QuizInfo_subVal_type + 퀴즈번호 + 보기번호 + _sub + QuizInfo_subVal_data
                                                    setElementValue(sztmpID,  DecodingUC(Items4[QuizInfo_subVal_data]));
                                                    if(isEmpty(Items4["subTextView"])){
                                                        setElementProp(subTextChk, "checked", "0");
                                                    }else{
                                                        setElementProp(subTextChk, "checked", "1");
                                                    }
                                                }
                                                else{
                                                    sztmpID = rtnIDString(QuizInfo_subVal_type) + String(nQizeCnt) + String(ntmpViewCount) + "_image"; // 이미지 경우
                                                    setElementProp(sztmpID, 'checked', true);
                                                    DrawViewSub($(sztmpID));
                                                    sztmpID = rtnIDString(QuizInfo_subVal_type) + String(nQizeCnt) + String(ntmpViewCount);
                                                    sztmpID = sztmpID + "_sub" + QuizInfo_subVal_data;
                                                    // 파일일 경우에는 엘리먼트에 파일명을 넣을 수 없다.
                                                    if (!isEmpty(Items4[QuizInfo_subVal_data])){
                                                        setElementProp(sztmpID + "_img", "src", szTmpPath + Items4[QuizInfo_subVal_data]);
                                                    }
                                                }
                                                ntmpViewCount = ntmpViewCount + 1;
                                            });
                                        }
                                        
                                    }
                                    else{ // 주관식일 경우
                                        var sztmpID = rtnIDString('rid') + String(nQizeCnt) + "_1";
                                        setElementProp(sztmpID, 'checked', true);    
                                        DrawQuiz(sztmpID, Items3[QuizInfo_type], 1);
                                        // 퀴즈 제목
                                        sztmpID = rtnIDString(QuizInfo_quizTitle) + String(nQizeCnt);
                                        setElementValue(sztmpID, DecodingUC(Items3[QuizInfo_quizTitle]));
                                        // 정답                                            
                                        sztmpID = rtnIDString(QuizInfo_quizAns) + String(nQizeCnt);
                                        setElementValue(sztmpID, DecodingUC(Items3[QuizInfo_quizAns]));
                                        // 정답 유형
                                        if (Items3[QuizInfo_quizAnsType] == "0")        // Text이면
                                            sztmpID = rtnIDString(QuizInfo_quizAnsType) + String(nQizeCnt) + "_text";
                                        else    
                                            sztmpID = rtnIDString(QuizInfo_quizAnsType) + String(nQizeCnt) + "_textarea";
                                        setElementProp(sztmpID, "checked", "1");
                                        // 퀴즈 정보
                                        if (Items3[QuizInfo_quizInfoType] == "0")        // Text이면
                                            sztmpID = rtnIDString(QuizInfo_quizInfoType) + String(nQizeCnt) + "_img";
                                        else    
                                            sztmpID = rtnIDString(QuizInfo_quizInfoType) + String(nQizeCnt) + "_video";
                                        setElementProp(sztmpID, "checked", "1");
                                        // 퀴즈 정보 파일 - ToDo : 클릭해서 정보를 확인해 줄 수 있도록 처리 필요
                                        sztmpID = rtnIDString(QuizInfo_quizInfoFileName) + String(nQizeCnt) + "_img";
                                        szTemp = Items3[QuizInfo_quizInfoFileName];
                                        if (!isEmpty(szTemp)){ 
                                            setElementProp(sztmpID, "src", szTmpPath + szTemp);
                                            var tmpcheckboxID = rtnIDString("checkbox_quiz_pinfo") + String(nQizeCnt);
                                            $('.checkbox_quiz_pinfo').trigger('click');
                                        }

                                        // 퀴즈 힌트
                                        sztmpID = rtnIDString(QuizInfo_hint) + String(nQizeCnt);
                                        setElementValue(sztmpID, DecodingUC(Items3[QuizInfo_hint]));
                                    }
                                    nQizeCnt = nQizeCnt + 1;
                                });                                
                                break;
                            case "shot":
                                // 인증샷
                                var nShot = sItems2.length;
                                if (nShot > 0){
                                    // 정적 인터페이스 설정
                                    setElementProp('#checkbox_shot','checked', true);
                                    setElementValue('#shot_count',nShot);
                                    // 버튼 클릭 이벤트 진행
                                    $('#btn_shot_count').trigger('click');
                                    nShot = 0;
                                    $.each(sItems2, function (key3, Items3){
                                        // 세부 정보 입력 (구독 인증샷 / 댓글 인증샷)
                                        // Radio 설정 (name : shotType0 / id : shotType0_1)
                                        if (Items3[shot_type] == "0")
                                        {
                                             sztmpID = rtnIDString(shot_type) + String(nShot) + "_1";
                                            setElementProp(sztmpID, 'checked', true);

                                            sztmpID = rtnIDString(shot_shotUrl) + String(nShot);
                                            setElementValue(sztmpID,  DecodingUC(Items3[shot_shotUrl]));
                                            // 인증 관련 TextBox 속성 설정
                                            setElementCSS(sztmpID, 'display', "block");
                                        }
                                        else{
                                            sztmpID = rtnIDString(shot_type) + String(nShot) + "_2";
                                            setElementProp(sztmpID, 'checked', true);

                                            sztmpID = rtnIDString(shot_shotUrl) + String(nShot);
                                            setElementValue(sztmpID, DecodingUC( Items3[shot_shotUrl]));
                                            // 인증 관련 TextBox 속성 설정
                                            setElementCSS(sztmpID, 'display', "none");
                                        }
                                        // shot 링크에 표시될 제목
                                        sztmpID = rtnIDString(shot_title) + String(nShot);
                                        setElementValue(sztmpID,  DecodingUC(Items3[shot_title]));
                                        nShot = nShot + 1;
                                    });
                                }
                                else{
                                    toggelCheckBox(false, "#shot_count", "disabled");
                                    toggelCheckBox(false, "#btn_shot_count", "disabled");
                                }
                                break;
                            case "agree":
                                setElementProp(rtnIDString(privacy_name),'checked', sItems2[privacy_name]);
                                setElementProp(rtnIDString(privacy_phone),'checked', sItems2[privacy_phone]);
                                setElementProp(rtnIDString(privacy_email),'checked', sItems2[privacy_email]);
                                setElementProp(rtnIDString(privacy_address),'checked', sItems2[privacy_address]);
                                szTemp = DecodingUC(sItems2[privacy_customer]);
                                if (!isEmpty(szTemp)){
                                  setElementProp(rtnIDString("checkbox_" + privacy_customer),'checked', 1);
                                  setElementCSS(rtnIDString(privacy_customer),'display', 'block');
                                  $(rtnIDString(privacy_customer)).val(szTemp);



                                }
                                break;
                            default:
                                break;
                        }
                    });
                });
            }
        });
    } catch (e) {
        console.log("drawEventData(parser) : " + e.message);
    }
}

// pJSON을 이용해 ox퀴즈수정 데이터를 출력한다. (tabledata 파싱)
function drawOXquiztData(pJSON){
    var szTmpPath = "";
    try {
        $.each(pJSON, function (key, Items) {
            if (key == "tabledata") {
                var tmpData = JSON.parse(JSON.stringify(Items)); 
                $.each(tmpData, function (key1, Items1) {
                    var szTemp = Items1.e_data;
                    szTemp = szTemp.replaceAll('\\', '');
                    szTemp = szTemp.replaceAll('`', '');
                    szTemp = szTemp.replaceAll('\'', ''); 
                    szTmpPath = "file/" + Items1['e_idx'] + "/";
                    var parseJSON = JSON.parse(szTemp);
                    $.each(parseJSON, function (key2, sItems2) {
                        switch (key2){
                            case "baseinfo" :
                                // sItems2[baseinfo_bgColor] 를 ","로 구분 (Gradient 용)
                                szTemp = sItems2[baseinfo_bgColor];
                                szTemp = szTemp.split(",");
                                if (szTemp.length > 1)
                                {
                                    $('#bgColor').wheelColorPicker('setValue', DecodingUC(szTemp[0]));
                                    $('#bgColor_End').wheelColorPicker('setValue', DecodingUC(szTemp[1]));
                                    setElementProp('#checkbox_gradient', 'checked', 1);
                                }
                                else{
                                    $('#bgColor').wheelColorPicker('setValue', DecodingUC(szTemp[0]));
                                    setElementProp('#checkbox_gradient', 'checked', 0);
                                    setElementCSS('#bgColor_End', 'display', 'none');
                                }
                                setElementValue('#event_title', DecodingUC(sItems2[baseinfo_event_title]));
                                setElementValue('#event_description', DecodingUC(sItems2[baseinfo_event_description]));
                                selected_selectbox('#select_customer_list', DecodingUC(sItems2[baseinfo_customerid]));
                                setElementValue('#event_start_date', DecodingUC(sItems2[baseinfo_event_start_date]));
                                setElementValue('#event_end_date', DecodingUC(sItems2[baseinfo_event_end_date]));
                                // 메인이미지 파일 경로 
                                szTemp = sItems2[baseinfo_mainimage];
                                if (!isEmpty(szTemp)){
                                    setElementProp(rtnIDString(baseinfo_mainimage + "_img"), "src", szTmpPath + szTemp);
                                }
                                
                                // 유의 사항
                                var aNotice = sItems2[baseinfo_Notice];
                                if ($.isArray(aNotice)) {
                                    var nArrayLength = aNotice.length;
                                    if (nArrayLength > 0){
                                        // 정적 인터페이스 설정
                                        setElementProp('#checkbox_event_info','checked', true);
                                        $('#event_info_count').val(nArrayLength);
                                        // 버튼 클릭 이벤트 진행
                                        $('#btn_event_info_count').trigger('click');
                                        // 세부 정보 입력
                                        for (var i=0; i<nArrayLength; i++){
                                            sztmpID = rtnIDString(baseinfo_Notice) + String(i);
                                            setElementValue(sztmpID, DecodingUC(aNotice[i]));
                                        }
                                    }
                                }else{
                                    toggelCheckBox(false, "#event_info_count", "disabled");
                                    toggelCheckBox(false, "#btn_event_info_count", "disabled");
                                }
                                // SNS 공유 인터페이스 출력
                                if (sItems2.sns_share[baseinfo_sns_share_kakao] == "1"){
                                    setElementProp('#checkbox_share_kakao_url','checked', true);
                                }
                                if (sItems2.sns_share[baseinfo_sns_share_facebook] === "1"){
                                    setElementProp('#checkbox_share_facebook_url','checked', true);
                                }
                                if (sItems2.sns_share[baseinfo_sns_share_blog] === "1"){
                                    setElementProp('#checkbox_share_blog_url','checked', true);
                                }
                                if (sItems2.sns_share[baseinfo_sns_share_band]  === "1"){
                                    setElementProp('#checkbox_share_band_url','checked', true);
                                }
                                if (sItems2.sns_share[baseinfo_sns_share_instagram]  === "1"){
                                    setElementProp('#checkbox_share_instagram_url','checked', true);
                                }

                                 // SNS 친구 설정
                                 if (sItems2.sns_friend[baseinfo_sns_friend_kakao]  != ""){
                                    setElementProp('#checkbox_friend_kakao_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_kakao), DecodingUC((sItems2.sns_friend[baseinfo_sns_friend_kakao])));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_facebook]  != ""){
                                    setElementProp('#checkbox_friend_facebook_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_facebook), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_facebook]));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_blog]  != ""){
                                    setElementProp('#checkbox_friend_blog_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_blog), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_blog]));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_band]  != ""){
                                    setElementProp('#checkbox_friend_band_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_band), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_band]));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_instagram]  != ""){
                                    setElementProp('#checkbox_friend_instagram_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_instagram), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_instagram]));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_youtube]  != ""){
                                    setElementProp('#checkbox_friend_youtube_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_youtube), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_youtube]));
                                }
                                if (sItems2.sns_friend[baseinfo_sns_friend_twiter]  != ""){
                                    setElementProp('#checkbox_friend_twiter_url','checked', true);
                                    setElementValue(rtnIDString(baseinfo_sns_friend_twiter), DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_twiter]));
                                }

                                // o이미지 파일 경로 
                                szTemp = sItems2["oimage"];
                                if (!isEmpty(szTemp)){
                                    setElementProp(rtnIDString("oimage_img"), "src", szTmpPath + szTemp);
                                }

                                // o이미지 파일 경로 
                                szTemp = sItems2["ximage"];
                                if (!isEmpty(szTemp)){
                                    setElementProp(rtnIDString("ximage_img"), "src", szTmpPath + szTemp);
                                }

                             
                                setElementValue(baseinfo_bgColor, sItems2[baseinfo_bgColor]);
                                

                                setElementProp(rtnIDString(privacy_name),'checked', sItems2.privacy[privacy_name]);
                                setElementProp(rtnIDString(privacy_phone),'checked', sItems2.privacy[privacy_phone]);
                                setElementProp(rtnIDString(privacy_email),'checked', sItems2.privacy[privacy_email]);
                                setElementProp(rtnIDString(privacy_address),'checked', sItems2.privacy[privacy_address]);
                                szTemp = DecodingUC(sItems2.privacy[privacy_customer]);
                                if (szTemp == "undefined"){
                                    setElementCSS(rtnIDString(privacy_customer),'display', 'none');
                                }else{
                                    setElementProp(rtnIDString("checkbox_" + privacy_customer),'checked', 1);
                                    setElementCSS(rtnIDString(privacy_customer),'display', 'block');
                                    $(rtnIDString(privacy_customer)).val(szTemp);
                                }
                                break;
                            // 사전정보
                            case "quize" :
                                // 퀴즈 개수를 구해 구조 인터페이스 생성
                                // 퀴즈 개수 설정
                                var nQizeCnt = sItems2.length;
                                setElementValue('#event_quiz_count', nQizeCnt);
                                $('#btn_ox_quiz_count').trigger('click');
                                // radio 버튼 name = rname + 퀴즈인덱스 => rname0, rname1
                                // 선택 시는 DI로 처리 rid0_1, rid0_2
                                nQizeCnt = 0;
                                $.each(sItems2, function (key3, Items3){
                                    szTemp = Items3["ox_quiz_img"];
                                    if (!isEmpty(szTemp)){
                                        setElementProp(rtnIDString("ox_quiz_img" + String(nQizeCnt) + "_img"), "src", szTmpPath + szTemp);
                                    }
                                 
                                    // 퀴즈 제목
                                    sztmpID = rtnIDString("ox_quiz_title") + String(nQizeCnt);
                                    setElementValue(sztmpID, DecodingUC(Items3["quizTitle"]));
                                    // 정답 
                                    sztmpID = rtnIDString("ox_answer") + String(nQizeCnt);   
                                    setElementProp(sztmpID, "checked", "1");

                                    // 퀴즈 점수
                                    sztmpID = rtnIDString("ox_quiz_score") + String(nQizeCnt);
                                    setElementValue(sztmpID, DecodingUC(Items3["ox_quiz_score"]));

                                    // 결과 설명
                                    sztmpID = rtnIDString("ox_answer_desc") + String(nQizeCnt);
                                    setElementValue(sztmpID, DecodingUC(Items3["ox_answer_desc"]));
                             

                                    nQizeCnt = nQizeCnt + 1;
                                });                                
                                break;
                            case "resultPage" :   
                                    // 고객사 링크(타이틀)
                                    var test = sItems2;
                                    console.log(test)
                                    sztmpID = rtnIDString("customer_title");
                                    setElementValue(sztmpID, DecodingUC(sItems2.customerLinkPage["title"]));
                                    // 고객사 링크(링크)
                                    sztmpID = rtnIDString("customer_link");
                                    setElementValue(sztmpID, DecodingUC(sItems2.customerLinkPage["linke"]));

                                    var nResultCnt = sItems2["rPage"].length;
                                    setElementValue('#quiz_result_count', nResultCnt);
                                    $('#btn_ox_quiz_result_count').trigger('click');
                                    
                                    nResultCnt = 0;
                                    $.each(sItems2["rPage"], function (key3, Items3){
                                        szTemp = Items3["ox_result_img"];
                                        if (!isEmpty(szTemp)){
                                            setElementProp(rtnIDString("ox_result_img" + String(nResultCnt) + "_img"), "src", szTmpPath + szTemp);
                                        }
                                     
                                        // 결과 문구
                                        sztmpID = rtnIDString("result_text") + String(nResultCnt);
                                        setElementValue(sztmpID, DecodingUC(Items3["result_text"]));
                                        // 결과 점수
                                        sztmpID = rtnIDString("result_score") + String(nResultCnt);   
                                        setElementValue(sztmpID, DecodingUC(Items3["result_score"]));
    
                                        nResultCnt = nResultCnt + 1;
                                    });                   

                                break; 
                            case "shot":
                                // 인증샷
                                var nShot = sItems2.length;
                                if (nShot > 0){
                                    // 정적 인터페이스 설정
                                    setElementProp('#checkbox_shot','checked', true);
                                    setElementValue('#shot_count',nShot);
                                    // 버튼 클릭 이벤트 진행
                                    $('#btn_shot_count').trigger('click');
                                    nShot = 0;
                                    $.each(sItems2, function (key3, Items3){
                                        // 세부 정보 입력 (구독 인증샷 / 댓글 인증샷)
                                        // Radio 설정 (name : shotType0 / id : shotType0_1)
                                        if (Items3[shot_type] == "0")
                                        {
                                            sztmpID = rtnIDString(shot_type) + String(nShot) + "_1";
                                            setElementProp(sztmpID, 'checked', true);

                                            sztmpID = rtnIDString(shot_shotUrl) + String(nShot);
                                            setElementValue(sztmpID,  DecodingUC(Items3[shot_shotUrl]));
                                            // 인증 관련 TextBox 속성 설정
                                            setElementCSS(sztmpID, 'display', "block");
                                        }
                                        else{
                                            sztmpID = rtnIDString(shot_type) + String(nShot) + "_2";
                                            setElementProp(sztmpID, 'checked', true);

                                            sztmpID = rtnIDString(shot_shotUrl) + String(nShot);
                                            setElementValue(sztmpID, DecodingUC( Items3[shot_shotUrl]));
                                            // 인증 관련 TextBox 속성 설정
                                            setElementCSS(sztmpID, 'display', "none");
                                        }
                                        // shot 링크에 표시될 제목
                                        sztmpID = rtnIDString(shot_title) + String(nShot);
                                        setElementValue(sztmpID,  DecodingUC(Items3[shot_title]));
                                        nShot = nShot + 1;
                                    });
                                }
                                else{
                                    toggelCheckBox(false, "#shot_count", "disabled");
                                    toggelCheckBox(false, "#btn_shot_count", "disabled");
                                }
                                break;
                            default:
                                break;
                        }
                    });
                });
            }
        });
    } catch (e) {
        console.log("drawEventData(parser) : " + e.message);
    }
}

// pJSON을 이벤트페이지 데이터를 출력한다. (tabledata 파싱)
function EventGo(pJSON, szParam){
    try {
        $.each(pJSON, function (key, Items) {
            if (key == "tabledata") {
                var tmpData = JSON.parse(JSON.stringify(Items));
                $.each(tmpData, function (key1, Items1) {
                    var szTemp = Items1.e_data;
                    var parseJSON = JSON.parse(szTemp);
                    $.each(parseJSON, function (key2, sItems2) {
                        if(key2 === "quiz_type"){
                            if(sItems2 === "oxQuiz"){
                                goToPage("oxquiz_page.html", szParam);
                                // console.log(szGotoPage);
                                return false;
                            }
                        }
                        else{
                            goToPage("eventpage.html", szParam);
                            // console.log(szGotoPage);
                            return false;
                        }
                    });
                });
            }
        });
        
    } catch (e) {
        // console.log("drawEventData_Real(parser) : " + e.message);
    }
}

// pJSON을 이벤트수정 . (tabledata 파싱)
function EventModifyGo(pJSON, szParam, szParam2){
    try {
        $.each(pJSON, function (key, Items) {
            if (key == "tabledata") {
                var tmpData = JSON.parse(JSON.stringify(Items));
                $.each(tmpData, function (key1, Items1) {
                    var szTemp = Items1.e_data;
                    var parseJSON = JSON.parse(szTemp);
                    $.each(parseJSON, function (key2, sItems2) {
                        if(key2 === "quiz_type"){
                            if(sItems2 === "oxQuiz"){
                                goToPage("oxquiz_plus.html", szParam, szParam2);
                                // console.log(szGotoPage);
                                return false;
                            }
                        }
                        else{
                            goToPage("event_plus.html", szParam, szParam2);
                            // console.log(szGotoPage);
                            return false;
                        }
                    });
                });
            }
        });
        
    } catch (e) {
        // console.log("drawEventData_Real(parser) : " + e.message);
    }
}

// pJSON을 이벤트페이지 데이터를 출력한다. (tabledata 파싱)
function drawEventData_Real(pJSON){
    try {
        $.each(pJSON, function (key, Items) {
            if (key == "tabledata") {
                var tmpData = JSON.parse(JSON.stringify(Items));
               
                $.each(tmpData, function (key1, Items1) {
                    var szTemp = Items1.e_data;
                    event_start_day = Items1.e_startdate;
                    event_end_day = Items1.e_enddate;
                    // szTemp = szTemp.replaceAll('\\', '');
                    // szTemp = szTemp.replaceAll('`', '');
                    // szTemp = szTemp.replaceAll('\'', ''); 
                    var parseJSON = JSON.parse(szTemp);
                    // agree 뿌리기
                    var szNameHTML = "";
                    var szPhoneHTML = "";
                    var szEmailHTML = "";
                    var szPrivacyCustomer = "";
                    const coId = Items1.e_idx;
                    $.each(parseJSON.agree, function(key4, items4){ 
                        // alert([privacy_name])  
                        if (key4 === privacy_name){ // 키값이 name일때
                            if(items4 === "1"){ // name의 값이 1일때
                            sztmpID = privacy_name;
                            szNameHTML += '<span class="addit-span2">이름</span>';
                            szNameHTML = szNameHTML + '<input type="text" maxlength="13" placeholder="예) 홍길동" class="phone" id="' + sztmpID + '">';
                            $('#event_name').append(szNameHTML);
                            }else{ // 아닐때
                                $('#event_name').css('display', 'none');
                            }
                        }
                        if (key4 === privacy_phone){ // 키 값이 phone일때
                            if(items4 === "1"){ // phone의 값이 1일때
                                sztmpID = privacy_phone;
                                szPhoneHTML += '<span class="addit-span2">연락처</span>';
                                szPhoneHTML = szPhoneHTML + '<input type="text" maxlength="13" placeholder="예) 010-1234-5678" class="phone phoneNumber" id="' + sztmpID + '">';
                                // ResultList.push(sztmpID);   
                                $('#event_phone').append(szPhoneHTML);
                            }else{ // 아닐때
                                $('#event_phone').css('display','none');
                            }
                        }
                        if (key4 === privacy_email){ // 키 값이 email일때
                            if(items4 === "1"){ // email의 값이 1일때
                                sztmpID = privacy_email;
                                szEmailHTML += '<span class="addit-span2">이메일</span>';
                                szEmailHTML = szEmailHTML + '<input type="text" maxlength="30" placeholder="예) addit@naver.com" class="phone" id="' + sztmpID + '">';
                                // ResultList.push(sztmpID);
                                $('#event_email').append(szEmailHTML);
                            }else{ // 아닐때
                                $('#event_email').css('display','none');
                            }
                        }      
                        if (key4 === privacy_address){ // 키 값이 email일때
                            if(items4 === "1"){ // email의 값이 1일때
                                sztmpID = privacy_address;
                                szEmailHTML += '<span class="addit-span2">주소</span>';
                                szEmailHTML = szEmailHTML + '<input type="text" maxlength="100" placeholder="주소를 입력하세요." class="phone" id="' + sztmpID + '">';
                                // ResultList.push(sztmpID);
                                $('#event_address').append(szEmailHTML);
                            }else{ // 아닐때
                                $('#event_address').css('display','none');
                            }
                        }      
                        if (key4 === privacy_customer){ // 키 값이 사용자 정의 일 경우
                          if(!isEmpty(items4)){ // email의 값이 1일때
                            var sztmpID = rtnIDString(privacy_customer);
                            $(sztmpID).html(DecodingUC(items4));
                            setElementCSS(sztmpID, 'display', 'block');
                          }
                        }      
                    });

                    //agree 외에 것 뿌리기
                    $.each(parseJSON, function (key2, sItems2) {
                        
                        switch (key2){
                            case "baseinfo" :
                                // 메인이미지 출력
                                var tmpImsgSrc = "file/" + coId + "/" + sItems2[baseinfo_mainimage];
                                var customerName = "";
                                if(sItems2["customer_name"] === "undefined"){
                                    customerName = "";
                                }else{
                                    customerName = sItems2["customer_name"];
                                }
                                // ToDo : 이미지 크기는 조절이 필요
                                setElementProp("#mainimage", "src", tmpImsgSrc);

                                // 유의 사항 출력
                                var aNotice = sItems2[baseinfo_Notice]; // 유의사항 데이터 변수로 담기
                                var sztmpHeadHTML = `<div class="aait-text-content-1" id="noticeDiv2">
                                                        <h3 class="addit-p3">유의사항</h3>
                                                        <div class="addit-margin-top1 speech" id="notice"></div>
                                                    </div>`; // 유의사항 고정 구조 변수에 담기
                                var sztmpHTML = ""; 
                                if ($.isArray(aNotice)) {   // 유의사항 데이터의 배열의 길이가 0 보다 크면(배열이 존재할때)    
                                    var nArrayLength = aNotice.length;
                                    if (nArrayLength > 0){
                                        $("#noticeDiv").html(sztmpHeadHTML); // 고정구조를 먼저 html 삽입
                                        for (var i=0; i<nArrayLength; i++){
                                            sztmpHTML = sztmpHTML + '<p class="addit-margin1 addit-p speech addit-notice-detail"><b><i class="fa-solid fa-check"></i></b>';
                                            sztmpHTML = sztmpHTML + DecodingUC(aNotice[i]) + '</p>'
                                            
                                        }
                                        $("#notice").append(sztmpHTML); // 추가로 배열만큼 고정구조 안에있는 div에 append
                                        
                                    }else{
                                        $('#noticeDiv').css('display', 'none'); // 0보다 크지 않을땐 div자체가 안보이게 처리
                                    }
                                }
                                // 메타태그 정보를 설정한다.
                                var tmpTagName = 'meta[name="apple-mobile-web-app-title"]';
                                setMetaTag(tmpTagName, sItems2[baseinfo_event_title]);
                                
                                tmpTagName = 'meta[property="og:title"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_event_title]));
                                tmpTagName = 'meta[property="og:site-name"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_event_title]));
                                tmpTagName = 'meta[property="og:description"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_event_description]));
                                tmpTagName = 'meta[property="og:image"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_mainimage]));
                                tmpTagName = 'meta[property="og:url"]';
                                setMetaTag(tmpTagName, DecodingUC(location.href));
                                


                                //폰트사이즈 조절 삽입
                                let fontDiv = $("#font_size_UP"); // 폰트사이즈 조절 기능 들어갈 DIV
                                let fontHTML =  sItems2[baseinfo_fontSize]; // 데이터 내에 폰트사이즈 조절 값 변수
                                if(fontHTML === "1"){ // 값이 1일때 true
                                    if (typeof fontHTML != "undefined") {
                                        fontHTML = '<h3 class="addit-p2 addit-margin1">텍스트조절</h3>';
                                        fontHTML = fontHTML + '<div class="addit-h1 button" id="fontSize_up"><i class="fa-solid fa-caret-up"></i></div>';
                                        fontHTML = fontHTML + '<div class="addit-h1 button" id="fontSize_down"><i class="fa-solid fa-caret-down"></i></div>'; 
                                        fontDiv.css('display','none');
                                    }           
                                }else{
                                    fontDiv.css('display','none');
                                    $('#youtube_id').css({'display':'none'});
                                    // fontDiv.append(fontHTML);
                                }
                                fontDiv.append(fontHTML);

                                // SNS 공유 출력 TODO:
                                let snsshareDiv = $("#snsShareDiv"); 
                                let snsIcon = $("#snsShare");
                                var bsnsShare = false;
                                // snsShareDiv SNS 공유 제목
                                // TODO : 기존에는 window.open으로 500, 500 크기르 출력한다. 
                                $('#snsShare_header').text('SNS 공유하기');
                                var szTemp = sItems2.sns_share[baseinfo_sns_share_kakao];
                                let shareHTML = "";
                                if (szTemp == "1") // 값이 비어잇지 않으면
                                {
                                    // 카카오 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/kakao.png" alt="카카오이미지" onclick="kakao();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);       
                                }
                                szTemp = sItems2.sns_share[baseinfo_sns_share_facebook];
                                if (szTemp == "1")
                                {
                                    // 페이스북 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/facebook.png" alt="페이스북이미지" onclick="facebook();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);
                                }
                                szTemp = sItems2.sns_share[baseinfo_sns_share_blog];
                                if (szTemp == "1")
                                {
                                    // 블로그 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/blog.png" alt="블로그이미지" onclick="blog();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);
                                }
                                szTemp = sItems2.sns_share[baseinfo_sns_share_band];
                                if (szTemp == "1")
                                {
                                    // 밴드 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/band.png" alt="밴드이미지" onclick="band();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);
                                }
                                snsIcon.append(shareHTML);
                                if (!bsnsShare)
                                    snsshareDiv.css('display', 'none');
                                
                                // SNS 친구 출력
                                let snsfriendDiv = $("#snsFriendDiv"); 
                                let snsfriendIcon = $("#snsFriend");
                                var bsnsFiend = false;
                                var kakao = "";
                                var facebook = "";
                                var bolg = "";
                                var band = "";
                                var insta = "";
                                var youtube = "";
                                var twiter = "";

                                // SNS 친구 추가 제목
                                // TODO : 친구 맺기의 경우 기존 소스에는 테이블을 업데이트 한 다음 페이지로 이동한다.
                                // $sql = mq("update lending set user_count = user_count +1 where user_table ='$user_table'");
                                $('#snsFriend_header').html("SNS 친구추가");
                                $('#event_join_text').html(customerName + 'SNS를 팔로우하면<br>이벤트 당첨 확률은 UP! UP!!');
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_kakao]);
                                if (szTemp !== "")
                                {
                                    // 카카오 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/kakao.png" alt="카카오이미지"></a>'; 
                                    kakao = '<span><img class="addit-img-width-1" src="img/kakao.png" alt="카카오이미지" onclick="kakao();"></span>';
                                    bsnsFiend = true;   
                                    snsfriendIcon.append(szTemp);

                                }else{
                                    $("#kakao_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_facebook]);
                                if (szTemp !== "")
                                {
                                    // 페이스북 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/facebook.png" alt="페이스북이미지"></a>';
                                    facebook = '<span><img class="addit-img-width-1" src="img/facebook.png" alt="페이스북이미지" onclick="facebook();"></span>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }else{
                                    $("#facebook_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_blog]);
                                if (szTemp !== "")
                                {
                                    // 블로그 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/blog.png" alt="블로그이미지"></a>';
                                    bolg = '<span><img class="addit-img-width-1" src="img/blog.png" alt="블로그이미지" onclick="blog();"></span>';
                                    bsnsFiend = true;              
                                    snsfriendIcon.append(szTemp);
                                }else{
                                    $("#blog_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_band]);
                                if (szTemp !== "")
                                {
                                    // 밴드 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/band.png" alt="밴드이미지"></a>';
                                    band = '<span><img class="addit-img-width-1" src="img/band.png" alt="밴드이미지" onclick="band();"></span>';
                                    bsnsFiend = true;              
                                    snsfriendIcon.append(szTemp);
                                }else{
                                    $("#band_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_instagram]);
                                if (szTemp !== "")
                                {
                                    // 인스타그램 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/instar.png" alt="인스타이미지"></a>';
                                    // insta = '<a href="' + DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_instagram]) + '" target="_blank"><img src="img/instar.png" alt="인스타아이콘">' + customerName + ' 인스타</a>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }else{
                                    $("#insta_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_youtube]);
                                if (szTemp !== "")
                                {
                                    // 유튜브 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/youtube.png" alt="유튜브이미지"></a>';
                                    // youtube = '<a href="' + DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_youtube]) + '" target="_blank"><img src="img/youtube.png" alt="유튜브아이콘">' + customerName + ' 유튜브</a>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }else{
                                    $("#youtube_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_twiter]);
                                if (szTemp !== "")
                                {
                                    // 트위터 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/twiter.png" alt="트위터이미지"></a>';
                                    // twiter = '<a href="' + DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_twiter]) + '" target="_blank"><img src="img/twiter.png" alt="트위터아이콘">' + customerName + ' 트위터</a>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }else{
                                    $("#twiter_event").css('display','none');
                                }
                                if (!bsnsFiend){
                                    snsfriendDiv.css('display', 'none');
                                    $("#event_join_popup").css('display', 'none');
                                }
                                //트위터 추가
                                $("#kakao_event").html(kakao);
                                $("#facebook_event").html(facebook);
                                $("#blog_event").html(bolg);
                                $("#band_event").html(band);
                                // $("#insta_event").html(insta);
                                // $("#youtube_event").html(youtube);
                                // $("#twiter_event").html(twiter);

                                // 유튜브 아이디값 받기
                                var szYoutube = DecodingUC(sItems2[baseinfo_youtube_id]);
                                var szHTML = "";
                                var szHTML2 = ""
                                if(!isEmpty(szYoutube)){
                                    szHTML = '<iframe src="https://www.youtube.com/embed/' + szYoutube + '" frameborder="0"  allowfullscreen></iframe>';
                                    szHTML2 = '<iframe src="https://www.youtube.com/embed/' + szYoutube + '?autoplay=1&mute=1" allow="autoplay;" width="10" height="10" frameborder="0"  allowfullscreen></iframe>';
                                    $('#youtube_id').html(szHTML);
                                }else{
                                    $('#youtube_id').css({'display':'none'});
                                }
                                
                                // $('#youtube_id').css({'display':'none'});
                                $('#sns_view_div').html(szHTML2);

                                // snsview
                                // snsview 출력
                                var snsView = sItems2["snsViewType"]; // 유의사항 데이터 변수로 담기
                                if(!isEmpty(snsView)){         
                                    var sztmpHTML = ""; 
                                    if ($.isArray(snsView)) {   // 유의사항 데이터의 배열의 길이가 0 보다 크면(배열이 존재할때)    
                                        var nArrayLength = snsView.length;
                                        if (nArrayLength > 0){
                                            for (var i=0; i<nArrayLength; i++){
                                                sztmpHTML = sztmpHTML + '<iframe src="' + DecodingUC(snsView[i]) + '" width="10" height="10" frameborder="0"  allowfullscreen></iframe>';
                                            }
                                            $("#sns_view_div").append(sztmpHTML); // 추가로 배열만큼 고정구조 안에있는 div에 append
                                        }
                                    }
                                }
				                /*******************************************************************************************
                                    date : 2023-02-21 / writer(modify): 정용재
                                    desc : 이벤트 참여하기 버튼 보색함수 적용후 컬러 변경
                                ********************************************************************************************/
                                // 백그라운드 칼라 지정 : class에 적용 또는 스타일로 직접 지정, gradient에 따라 
                                var tmpColor = sItems2[baseinfo_bgColor];
                                tmpColor = tmpColor.split(',');
                                var szColorShadow = '-1px 0px rgb(255 255 255), 0px 1px rgb(255 255 255), 1px 0px rgb(255 255 255), 0px -1px rgb(255 255 255)';
                                if (tmpColor.length > 1){
                                    var szgradient = 'linear-gradient(180deg, #' + tmpColor[0] + ' 0%, #' + tmpColor[1] + ' 100%)';
                                    var szColor = getComplementaryColor('#' + tmpColor[0]);
                                    $('.addit-bg-gradiant-2').css('background', szgradient);
                                    $('.addit-privacy-next').css({'background': szgradient, "color" : szColor }); // 이벤트참여하기버튼 배경컬러, 버튼컬러				
                                    setElementCSS('.addit-privacy-next', 'text-shadow', szColorShadow);
				                }
                                else{
                                     var szColor2 = getComplementaryColor('#' + tmpColor[0]);
                                    $('.addit-bg-gradiant-2').css('background', '#' + tmpColor[0]);
                                    $('.addit-privacy-next').css({'background': '#' + tmpColor[0], "color" : szColor2}); // 이벤트참여하기버튼 배경컬러, 버튼컬러	  				    
                                    setElementCSS('.addit-privacy-next', 'text-shadow', szColorShadow);
                                }
                                break;
                            // 사전정보
                            case "quizepreinfo":
                                let quizPreInfo = $("#quizPreInfo");
                                var npreinfo = sItems2.length;
                                if (npreinfo > 0){
                                    $.each(sItems2, function (key3, Items3){
                                        // 세부 정보 입력 (유튜브 링크 0 / 하이퍼 링크 1)
                                        var szTemp = Items3[QuizPreInfo_linkType];
                                        let preLink = DecodingUC(Items3[QuizPreInfo_preInfoLink]);
                                        let preHTML = "";
                                        if (szTemp == "0")
                                        {
                                            preHTML += '<a target="blank" class="addit-box-type-13 addit-p5 speech"  href="' + preLink + '"><img class="addit-icon-type-3 addit-margin7" src="img/youtube.png" alt="유튜브아이콘">영상 감상하러가기</a>';
                                        }
                                        else{
                                            preHTML += '<a target="blank" class="addit-box-type-13 addit-p5 speech" href="' + preLink + '"><i class="fa-solid fa-link"></i> 링크 바로가기</a>';
                                        }
                                        npreinfo = npreinfo + 1;
                                        quizPreInfo.append(preHTML);
                                    });
                                    
                                }
                                break;
                            case "quize" :
                                // 퀴즈 개수를 구해 구조 인터페이스 생성
                                // 퀴즈 개수 설정
                                // 퀴즈 생성 시 결과 값을 위한 TagID 리스트를 생성한다. (값을 확인 위한 ID)
                                
                                var nQizeCnt = sItems2.length;
                                nQizeCnt = 0;
                                const qHeaderHTML = `<div class="addit-margin12">
                                <div class="addit-margin1">`;
                                let quizDiv = $("#quizDiv");
                                $.each(sItems2, function (key3, Items3){
                                    var ResultJSON = {};
                                    nQizeCnt = key3;
                                    // 객관식일 경우 0 
                                    var szHTML = "";
                                    var szPreHTML = "";
                                    var szTemp = "";
                                    var preID = '#preInfo' + nQizeCnt + '';
                                    var hintID = '#hint' + nQizeCnt + '';
                                    var subID = '#subVal' + nQizeCnt + '';   
                                    if (Items3[QuizInfo_type] == "0"){
                                        // 퀴즈 제목
                                        szHTML = qHeaderHTML + '<h1 class="addit-h5"><b class="sh">*</b>' + DecodingUC(Items3[QuizInfo_quizTitle]) + '</h1><div id="preInfo' + nQizeCnt + '"></div><div id="hint' + nQizeCnt + '"></div><div class="addit-box-type-18" id="subVal' + nQizeCnt + '"></div>';
                                        quizDiv.append(szHTML);
                                        // 퀴즈 사전 정보
                                        if (Items3[QuizInfo_quizInfoType] == "0"){   // 이미지일 경우
                                            if(Items3[QuizInfo_quizInfoFileName] !== ""){
                                                szTemp = Items3[QuizInfo_quizInfoFileName];
                                                szPreHTML = `<img class='addit-img-width-1' height="250" src="file/${coId}/${szTemp}" alt=" 사전정보 이미지">`;
                                                $(preID).html(szPreHTML);
                                            }else{
                                                szTemp = Items3[QuizInfo_quizInfoFileName];
                                                szPreHTML = `<img style="display: none" height="250" class='addit-img-width-1' src="file/${coId}/${szTemp}" alt=" 사전정보 이미지">`;
                                                $(preID).html(szPreHTML);
                                            }
                                        }else if(Items3[QuizInfo_quizInfoType] == "1"){    
                                            if(szTemp = Items3[QuizInfo_quizInfoFileName] !== ""){
                                                szTemp = Items3[QuizInfo_quizInfoFileName]; // 비디오일 경우
                                                szPreHTML = `<video width="100%" height="280" controls>
                                                            <source src="file/${coId}/${szTemp}" type="video/mp4">
                                                            <source src="file/${coId}/${szTemp}" type="video/ogg">
                                                            Your browser does not support the video tag.
                                                        </video>`;
                                                $(preID).html(szPreHTML); 
                                            }else{
                                                szTemp = Items3[QuizInfo_quizInfoFileName]; // 비디오일 경우
                                                szPreHTML = `<video style="display: none" width="100%" height="280" controls>
                                                            <source src="file/${coId}/${szTemp}" type="video/mp4">
                                                            <source src="file/${coId}/${szTemp}" type="video/ogg">
                                                            Your browser does not support the video tag.
                                                        </video>`;
                                                $(preID).html(szPreHTML); 
                                            }     
                                        }else if(Items3[QuizInfo_quizInfoType] == ""){
                                            $(preID).css('display', 'none'); 
                                        }
                                        // $('타겟 ID').html(szHTML);
                                        // 퀴즈 힌트
                                        
                                        if(Items3[QuizInfo_hint] !== ""){
                                            szTemp ='<p class="addit-sub-p">HINT: ' + DecodingUC(Items3[QuizInfo_hint]) + '</p>';
                                            $(hintID).html(szTemp);
                                        }else{
                                            $(hintID).css('display', 'none');
                                        }
                                        
                                        
                                        // 보기를 그린다. (ID : subVal + 퀴즈번호)
                                        var nViewCount = Items3[QuizInfo_subVal].length;
                                        // 단일 선택인지 / 다중선택인지
                                        var szElementTypeRa = "";
                                        var szElementTypeCh = "";
                                        if (Items3[QuizInfo_quizAnsType] == "0")
                                        {
                                            szElementTypeRa = "radio";
                                            ResultJSON['type'] = "radio";
                                        }
                                        if(Items3[QuizInfo_quizAnsType] == "1"){
                                            szElementTypeCh = "checkbox";
                                            ResultJSON['type'] = "checkbox";
                                        }
                                        if (nViewCount > 0){
                                            // 보기 값을 생성 한다.
                                            var ntmpViewCount = 0;
                                            var tmpresultID = "";
                                            var viewIdex = 0;       // view선택 시 값을 위한 idex
                                            $.each(Items3[QuizInfo_subVal], function (key4, Items4){
                                                viewIdex = viewIdex + 1;
                                                var tmpViewID = ""; 
                                                var tmpViewName = "";
                                                // 보기 Name : view_ + 퀴즈번호
                                                tmpViewName = 'view_' + nQizeCnt;
                                                // 보기 ID : view_ + 퀴즈번호 + 보기번호
                                                tmpViewID = 'view_' + nQizeCnt + ntmpViewCount;

                                                // 20230313정용재 보기 수정
                                                if (Items3[QuizInfo_quizAnsType] == "0"){       // 단일 선택일 경우
                                                    if (Items4[QuizInfo_subVal_type] == "0")    // 보기가 Text로 출력될 경우
                                                    {
                                                        if(isEmpty(Items4["subTextView"])){
                                                        szHTML = '<label class="addit-box-type-12" for="' + tmpViewID + '">';
                                                        szHTML = szHTML + '<input class="addit-margin7" type="' + szElementTypeRa + '" id="' + tmpViewID + '" value="' + DecodingUC(Items4[QuizInfo_subVal_data]) + '" name="' + tmpViewName + '" >';
                                                        szHTML = szHTML + DecodingUC(Items4[QuizInfo_subVal_data]) + '</label>';
                                                        }else{
                                                            szHTML = '<label class="addit-box-type-12" for="' + tmpViewID + '" data-id="' + tmpViewID + '">';
                                                            szHTML = szHTML + '<input class="addit-margin7" type="' + szElementTypeRa + '" id="' + tmpViewID + '" value="' + DecodingUC(Items4[QuizInfo_subVal_data]) + '" name="' + tmpViewName + '" data-id="' + tmpViewID + '">';
                                                            szHTML = szHTML + DecodingUC(Items4[QuizInfo_subVal_data]) + '</label><input class="addit-input-type5 subtext addit-special" maxlength=100" style="display:block" type="text" id="' + tmpViewID + '_text" placeholder="특수 문자 , / 는 작성 불가능 합니다."></input>';
                                                        }
                                                        
                                                    }
                                                    else{   //  보기가 이미지로 출력될 경우
                                                        szHTML = `<label class="addit-box-type-19" for="${tmpViewID}">`;
                                                        szHTML = szHTML + `<img class="addit-img" height="150" src="file/${coId}/${Items4[QuizInfo_subVal_data]}">`;
                                                        szHTML = szHTML + `<input class="addit-margin7" type="${szElementTypeRa}" id="${tmpViewID}" value="${viewIdex}" name="${tmpViewName}" ></label>`;
                                                    }
                                                    tmpresultID = tmpViewName;
                                                }else if(Items3[QuizInfo_quizAnsType] == "1"){  // 다중선택 일 경우
                                                    if (Items4[QuizInfo_subVal_type] == "0")    // 보기가 이미지로 출력될 경우
                                                    {
                                                        if(isEmpty(Items4["subTextView"])){
                                                            szHTML = '<label class="addit-box-type-12" for="' + tmpViewID + '">';
                                                            szHTML = szHTML +'<input class="addit-margin7" type="' + szElementTypeCh + '" id="' + tmpViewID + '" value="' + Items4[QuizInfo_subVal_data] + '" name="' + tmpViewName + '" >';
                                                            szHTML = szHTML + Items4[QuizInfo_subVal_data] + '</label>';
                                                            
                                                        }else{
                                                            szHTML = '<label class="addit-box-type-12" for="' + tmpViewID + '" data-id="' + tmpViewID + '">';
                                                            szHTML = szHTML +'<input class="addit-margin7" type="' + szElementTypeCh + '" id="' + tmpViewID + '" value="' + Items4[QuizInfo_subVal_data] + '" name="' + tmpViewName + '"  data-id="' + tmpViewID + '">';
                                                            szHTML = szHTML + Items4[QuizInfo_subVal_data] + '</label><input class="addit-input-type5 subtext addit-special" maxlength=100" style="display:block" type="text" id="' + tmpViewID + '_text" placeholder="특수 문자 , / 는 작성 불가능 합니다."></input>';
                                                        }
                                                        
                                                    }
                                                    else{   //  보기가 이미지로 출력될 경우 (TODO : 확인 필요)
                                                        szHTML = `<label class="addit-box-type-19" for="${tmpViewID}">`;
                                                        szHTML = szHTML + `<img class="addit-img" height="100" src="file/${coId}/${Items4[QuizInfo_subVal_data]}">`;
                                                        szHTML = szHTML +'<input class="addit-margin7" type="' + szElementTypeCh + '" id="' + tmpViewID + '" value="' + Items4[QuizInfo_subVal_data] + '" name="' + tmpViewName + '" >';
                                                    }                 
                                                    if(isEmpty(tmpresultID)){
                                                        tmpresultID = tmpViewID
                                                    }else{
                                                        tmpresultID = tmpresultID + ',' + tmpViewID;
                                                    }
                                                }
                                                $(subID).append(szHTML);
                                                ntmpViewCount = ntmpViewCount + 1;
                                            });
                                            ResultJSON['answer'] = Items3[QuizInfo_quizAns];
                                            ResultJSON['id'] = tmpresultID;
                                            ResultList.push(ResultJSON);
                                        }
                                    }
                                    else{ // 주관식일 경우
                                        // 퀴즈 제목
                                        szHTML = qHeaderHTML + '<h1 class="addit-h5"><b class="sh">*</b>' + DecodingUC(Items3[QuizInfo_quizTitle]) + '</h1><div id="preInfo' + nQizeCnt + '"></div><div id="hint' + nQizeCnt + '"></div><div class="addit-box-type-18" id="ans' + nQizeCnt + '"></div>';
                                        quizDiv.append(szHTML);


                                        // 정답 유형 - Text이면
                                        if (Items3[QuizInfo_quizAnsType] === "0"){       
                                            // 입력 ID : QuizInfo_quizAnsType + 퀴즈번호
                                            sztmpID = QuizInfo_quizAnsType + String(nQizeCnt);
                                            szHTML = '<input class="addit-input-type5 addit-special" type="text" maxlength=200" id="' + sztmpID + '" placeholder="특수 문자 , / 는 작성 불가능 합니다.">';
                                        }
                                        else{
                                            sztmpID = QuizInfo_quizAnsType + String(nQizeCnt);
                                            szHTML = '<textarea class="addit-input-type3 addit-special" row="10" cols="30"  id="' + sztmpID + '" placeholder="특수 문자 , / 는 작성 불가능 합니다."></textarea>';
                                        }
                                        $('#ans' + nQizeCnt + '').html(szHTML)
                                        ResultJSON['type'] = "text";
                                        ResultJSON['answer'] = DecodingUC(Items3[QuizInfo_quizAns]);
                                        ResultJSON['id'] = sztmpID;
                                        ResultList.push(ResultJSON);
                                        
                                        // 퀴즈 사전 정보
                                        if (Items3[QuizInfo_quizInfoType] == "0"){   // 이미지일 경우
                                            var szTemp = DecodingUC(Items3[QuizInfo_quizInfoFileName]);
                                            if(szTemp !== ""){
                                                szPreHTML = `<img class='addit-img-width-1' height="250" src="file/${coId}/${szTemp}" alt=" 사전정보 이미지">`;
                                                $(preID).html(szPreHTML);
                                            }else{
                                                szPreHTML = `<img style="display:none" height="250" class='addit-img-width-1' src="file/${coId}/${szTemp}" alt=" 사전정보 이미지">`;
                                                $(preID).html(szPreHTML);
                                            }

                                        }else if(Items3[QuizInfo_quizInfoType] == "1"){  
                                            if(Items3QuizInfo_quizInfoFileName !== ""){  
                                                szTemp = rawurlencode(Items3[QuizInfo_quizInfoFileName]); // 비디오일 경우
                                                szPreHTML = `<video width="100%" height="280" controls>
                                                            <source src="file/40/${szTemp}" type="video/mp4">
                                                            <source src="file/40/${szTemp}" type="video/ogg">
                                                            Your browser does not support the video tag.
                                                        </video>`;
                                                $(preID).html(szPreHTML); 
                                            }else{
                                                szTemp = Items3[QuizInfo_quizInfoFileName]; // 비디오일 경우
                                                szPreHTML = `<video style="display:none" width="100%" height="280" controls>
                                                            <source src="file/40/${szTemp}" type="video/mp4">
                                                            <source src="file/40/${szTemp}" type="video/ogg">
                                                            Your browser does not support the video tag.
                                                        </video>`;
                                                $(preID).html(szPreHTML);
                                            }     
                                        }else if(Items3[QuizInfo_quizInfoType] == ""){
                                            $(preID).css('display', 'none'); 
                                        }
                                        // 퀴즈 힌트
                                        if(Items3[QuizInfo_hint] !== ""){
                                            szTemp ='<p class="addit-sub-p">HINT: ' + DecodingUC(Items3[QuizInfo_hint]) + '</p>';
                                            $(hintID).html(szTemp);
                                        }else{
                                            $(hintID).css('display', 'none');
                                        }
                                    }
                                    nQizeCnt = nQizeCnt + 1;
                                });                                
                                break;
                            case "shot":
                                // 인증샷
                                var nShot = sItems2.length;
                                var shotDiv = $("#shotDiv");
                                if (nShot > 0){
                                    $.each(sItems2, function (key3, Items3){
                                        // 세부 정보 입력 (구독 인증샷 0 / 댓글 인증샷 1)
                                        // 인증샷 ID : shot_type + 퀴즈번호
                                        var sztmpID = shot_type + key3;
                                        if (Items3[shot_type] == "0"){   
                                            var szURL = DecodingUC(Items3[shot_shotUrl]);
                                            var szlinkTitle = DecodingUC(Items3[shot_title]);
                                            var szHTML = `<div class="addit-QuizText addit-ScaleDiv addit-upload-div">
                                                            <div class="addit-quiz">
                                                                <span class="addit-span">
                                                                    <div><i class="fa-solid fa-camera-retro"></i> 유튜브 구독 인증샷을 첨부해주세요.</div>
                                                                    <a href="${szURL}" target="blank" class="addit-youtube-url-button"">
                                                                        <img src="img/youtube.png" alt="유튜브아이콘"
                                                                        > ${DecodingUC(szlinkTitle)}
                                                                    </a>
                                                                </span>
                                                            </div>
                                                            <div class="addit-preview-area">
                                                                <img src="img/noneImg.jpg" class="thumb" />
                                                            </div>
                                                            <div class="addit-ScaleDiv flie-div">
                                                                <input class="addit-margin-top2 file-count" type="file" id="upload${sztmpID}" name="upload1">
                                                                <p class="tex">이미지 크기는 10MB 이하 파일만 첨부가능합니다.</p>
                                                            </div>
                                                        </div>`; 
                                            shotDiv.append(szHTML);            
                                        }else if(Items3[shot_type] == "1"){
                                            var szHTML = `<div class="addit-QuizText addit-ScaleDiv addit-upload-div">
                                                            <div class="addit-quiz">
                                                                <span class="addit-span">
                                                                    <div><i class="fa-solid fa-camera-retro"></i>댓글 인증샷을 첨부해주세요.</div>
                                                                </span>
                                                            </div>
                                                            <div class="addit-preview-area">
                                                                <img src="img/noneImg.jpg" class="thumb" />
                                                            </div>
                                                            <div class="addit-ScaleDiv flie-div">
                                                                <input class="addit-margin-top2 file-count" type="file" id="upload${sztmpID}" name="upload1">
                                                                <p class="tex">이미지 크기는 10MB 이하 파일만 첨부가능합니다.</p>
                                                            </div>
                                                        </div>`;
                                            shotDiv.append(szHTML);  
                                        }else if(Items3[shot_type] == "2"){
                                            var szlinkTitle = DecodingUC(Items3[shot_title]);
                                            var szHTML = `<div class="addit-QuizText addit-ScaleDiv addit-upload-div">
                                                            <div class="addit-quiz">
                                                                <span class="addit-span">
                                                                    <div><i class="fa-solid fa-camera-retro"></i>${szlinkTitle}</div>
                                                                </span>
                                                            </div>
                                                            <div class="addit-ScaleDiv flie-div">
                                                                <input class="addit-margin-top2 file-count" type="file" id="upload${sztmpID}" name="upload1">
                                                                <p class="tex">10MB 이하 파일만 첨부가능합니다.</p>
                                                            </div>
                                                        </div>`; 
                                                        shotDiv.append(szHTML);  
                                        }
                                    });                             
                                    ResultJSON['type'] = "file";
                                    ResultJSON['id'] = sztmpID;
                                    ResultList.push(ResultJSON);
                                    nShot = nShot + 1;        
                                    }else{
                                            shotDiv.css('display','none')
                                    }               
                                break;
                            case "url_btn":
                                var szHTML = "";
                                var tmpTarget = $("#div_btn_npbs_view");
                                $.each(sItems2, function(key3, Items3) {
                                    if(sItems2.webzine_chk == "1"){
                                        var webImsgSrc = "file/" + coId + "/" + sItems2.webzine_img;
                                        szHTML = '<div class="webzinelink" style="cursor: pointer;">';
                                        szHTML = szHTML + '<a href="' + sItems2.webzine_url + '" target="_parent">';
                                        szHTML = szHTML + '<img src="' + webImsgSrc + '"><br>웹진으로 이동</a>';
                                        szHTML = szHTML + '</div>';
                                        tmpTarget.html(szHTML);
                                        return;
                                    }else{
                                        tmpTarget.css('displaay','none');
                                    }
                                });       
                                break;
                            // case "agree":
                            //     szNameHTML = "";
                            //     szPhoneHTML = "";
                            //     szEmailHTML = "";
                            //     $.each(sItems2, function(key3, Items3) {
                            //         if (Items3[privacy_name] == "1"){
                            //             sztmpID = privacy_name;
                            //             szNameHTML += '<span class="addit-span2">이름</span>';
                            //             szNameHTML = szNameHTML + '<input type="text" maxlength="13" placeholder="예) 홍길동" class="phone" id="' + sztmpID + '">';
                            //             $('#event_name').append(szNameHTML);
                            //         }
                            //         if (Items3[privacy_phone] == "1"){
                            //             sztmpID = "privacy_phone";
                            //             szPhoneHTML += '<span class="addit-span2">연락처</span>';
                            //             szPhoneHTML = szPhoneHTML + '<input type="text" maxlength="13" placeholder="예) 010-1234-5678" class="phone" id="' + sztmpID + '">';
                            //             ResultList.push(sztmpID);   
                            //             $('#event_phone').append(szPhoneHTML);
                            //         }
                            //         if (Items3[privacy_email] == "1"){
                            //             sztmpID = "privacy_email";
                            //             szEmailHTML += '<span class="addit-span2">이메일</span>';
                            //             szEmailHTML = szEmailHTML + '<input type="text" maxlength="13" placeholder="예) addit@naver.com" class="phone" id="email${number}">';
                            //             ResultList.push(sztmpID);
                            //             $('#event_email').append(szEmailHTML);
                            //         } 
                            //     });       
                            //     break;
                            default:
                                break;
                        }
                    });
                });
            }
        });
    } catch (e) {
        // console.log("drawEventData_Real(parser) : " + e.message);
    }
}

// pJSON을 ox퀴즈페이지 데이터를 출력한다. (tabledata 파싱)
function drawOxQuizData_Real(pJSON){
    let szContent = "";
    let oxQuizDiv = $("#oxQuiz_div");
    try {
        $.each(pJSON, function (key, Items) {
            if (key == "tabledata") {
                var tmpData = JSON.parse(JSON.stringify(Items));
               
                $.each(tmpData, function (key1, Items1) {
                    var szTemp = Items1.e_data;
                    // szTemp = szTemp.replaceAll('\\', '');
                    // szTemp = szTemp.replaceAll('`', '');
                    // szTemp = szTemp.replaceAll('\'', ''); 
                    var parseJSON = JSON.parse(szTemp);
                    const coId = Items1.e_idx;
                    const Oimg = parseJSON.baseinfo["oimage"];
                    const Ximg = parseJSON.baseinfo["ximage"];
                   
                    
                    $.each(parseJSON, function (key2, sItems2) {                      
                        switch (key2){
                            case "baseinfo" :
                                // 메인이미지 출력
                                var tmpImsgSrc = "file/" + coId + "/" + sItems2[baseinfo_mainimage];
                                // ToDo : 이미지 크기는 조절이 필요
                                setElementProp("#mainimage", "src", tmpImsgSrc);
                                setElementProp("#mainimage2", "src", tmpImsgSrc);

                                // 유의 사항 출력
                                var aNotice = sItems2[baseinfo_Notice]; // 유의사항 데이터 변수로 담기
                                var sztmpHeadHTML = `<div class="aait-text-content-2" id="noticeDiv2">
                                                        <h3 class="addit-p3">유의사항</h3>
                                                        <div class="addit-margin-top1 speech" id="notice"></div>
                                                    </div>`; // 유의사항 고정 구조 변수에 담기
                                var sztmpHTML = ""; 
                                if ($.isArray(aNotice)) {   // 유의사항 데이터의 배열의 길이가 0 보다 크면(배열이 존재할때)    
                                    var nArrayLength = aNotice.length;
                                    if (nArrayLength > 0){
                                        $("#noticeDiv").html(sztmpHeadHTML); // 고정구조를 먼저 html 삽입
                                        for (var i=0; i<nArrayLength; i++){
                                            sztmpHTML = sztmpHTML + '<p class="addit-margin1 addit-p speech addit-notice-detail"><b><i class="fa-solid fa-check"></i></b>';
                                            sztmpHTML = sztmpHTML + DecodingUC(aNotice[i]) + '</p>'
                                            
                                        }
                                        $("#notice").append(sztmpHTML); // 추가로 배열만큼 고정구조 안에있는 div에 append
                                        
                                    }else{
                                        $('#noticeDiv').css('display', 'none'); // 0보다 크지 않을땐 div자체가 안보이게 처리
                                    }
                                }
                                // 메타태그 정보를 설정한다.
                                var tmpTagName = 'meta[name="apple-mobile-web-app-title"]';
                                setMetaTag(tmpTagName, sItems2[baseinfo_event_title]);
                                
                                tmpTagName = 'meta[property="og:title"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_event_title]));
                                tmpTagName = 'meta[property="og:site-name"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_event_title]));
                                tmpTagName = 'meta[property="og:description"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_event_description]));
                                tmpTagName = 'meta[property="og:image"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_mainimage]));
                                tmpTagName = 'meta[property="og:url"]';
                                setMetaTag(tmpTagName, DecodingUC(location.href));
                                

                                // SNS 공유 출력 TODO:
                                let snsshareDiv = $("#snsShareDiv"); 
                                let snsIcon = $("#snsShare");
                                var bsnsShare = false;
                                // snsShareDiv SNS 공유 제목
                                // TODO : 기존에는 window.open으로 500, 500 크기르 출력한다. 
                                $('#snsShare_header').text('SNS 공유하기');
                                var szTemp = sItems2.sns_share[baseinfo_sns_share_kakao];
                                let shareHTML = "";
                                if (szTemp == "1") // 값이 비어잇지 않으면
                                {
                                    // 카카오 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/kakao.png" alt="카카오이미지" onclick="kakao();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);       
                                }
                                szTemp = sItems2.sns_share[baseinfo_sns_share_facebook];
                                if (szTemp == "1")
                                {
                                    // 페이스북 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/facebook.png" alt="페이스북이미지" onclick="facebook();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);
                                }
                                szTemp = sItems2.sns_share[baseinfo_sns_share_blog];
                                if (szTemp == "1")
                                {
                                    // 블로그 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/blog.png" alt="블로그이미지" onclick="blog();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);
                                }
                                szTemp = sItems2.sns_share[baseinfo_sns_share_band];
                                if (szTemp == "1")
                                {
                                    // 밴드 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/band.png" alt="밴드이미지" onclick="band();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);
                                }
                                snsIcon.append(shareHTML);
                                if (!bsnsShare)
                                    snsshareDiv.css('display', 'none');
                                
                                // SNS 친구 출력
                                let snsfriendDiv = $("#snsFriendDiv"); 
                                let snsfriendIcon = $("#snsFriend");
                                var bsnsFiend = false;

                                // SNS 친구 추가 제목
                                // TODO : 친구 맺기의 경우 기존 소스에는 테이블을 업데이트 한 다음 페이지로 이동한다.
                                // $sql = mq("update lending set user_count = user_count +1 where user_table ='$user_table'");
                                $('#snsFriend_header').html("SNS 친구추가");
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_kakao]);
                                if (szTemp !== "")
                                {
                                    // 카카오 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/kakao.png" alt="카카오이미지"></a>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_facebook]);
                                if (szTemp !== "")
                                {
                                    // 페이스북 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/facebook.png" alt="페이스북이미지"></a>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_blog]);
                                if (szTemp !== "")
                                {
                                    // 블로그 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/blog.png" alt="블로그이미지"></a>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_band]);
                                if (szTemp !== "")
                                {
                                    // 밴드 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/band.png" alt="밴드이미지"></a>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_instagram]);
                                if (szTemp !== "")
                                {
                                    // 인스타그램 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/instar.png" alt="인스타이미지"></a>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_youtube]);
                                if (szTemp !== "")
                                {
                                    // 유튜브 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/youtube.png" alt="유튜브이미지"></a>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_twiter]);
                                if (szTemp !== "")
                                {
                                    // 트위터 아이콘 출력 및 URL 출력
                                    szTemp = '<a href="' + szTemp + '" target="_blank" class="addit-icon-type-1"><img class="addit-img-width-1" src="img/twiter.png" alt="트위터이미지"></a>';
                                    bsnsFiend = true;
                                    snsfriendIcon.append(szTemp);
                                }
                                if (!bsnsFiend){
                                    snsfriendDiv.css('display', 'none');
                                }
				                /*******************************************************************************************
                                    date : 2023-02-21 / writer(modify): 정용재
                                    desc : 이벤트 참여하기 버튼 보색함수 적용후 컬러 변경
                                ********************************************************************************************/
                                // 백그라운드 칼라 지정 : class에 적용 또는 스타일로 직접 지정, gradient에 따라 
                                var tmpColor = sItems2[baseinfo_bgColor];
                                tmpColor = tmpColor.split(',');
                                var szColorShadow = '-1px 0px rgb(255 255 255), 0px 1px rgb(255 255 255), 1px 0px rgb(255 255 255), 0px -1px rgb(255 255 255)';
                                if (tmpColor.length > 1){
                                    var szgradient = 'linear-gradient(180deg, #' + tmpColor[0] + ' 0%, #' + tmpColor[1] + ' 100%)';
                                    var szColor = getComplementaryColor('#' + tmpColor[0]);
                                    $('.addit-bg-gradiant-2').css('background', szgradient);
                                    $('.addit-privacy-next').css({'background': szgradient, "color" : szColor }); // 이벤트참여하기버튼 배경컬러, 버튼컬러				
                                    setElementCSS('.addit-privacy-next', 'text-shadow', szColorShadow);
				                }
                                else{
                                     var szColor2 = getComplementaryColor('#' + tmpColor[0]);
                                    $('.addit-bg-gradiant-2').css('background', '#' + tmpColor[0]);
                                    $('.addit-privacy-next').css({'background': '#' + tmpColor[0], "color" : szColor2}); // 이벤트참여하기버튼 배경컬러, 버튼컬러	  				    
                                    setElementCSS('.addit-privacy-next', 'text-shadow', szColorShadow);
                                }

                                //  ox이미지 처리
                                // var oimage = sItems2.oimage;
                                // Oimg = oimage;
                                var szName = "";
                                var szPhone = "";
                                var szEmail = "";

                                // 개인정보 입력창   
                                if(sItems2.privacy[privacy_name] === "1"){
                                    szName = `<span>이름을 입력해주세요</span>
                                                <input type="text" placeholder="예)홍길동" id="privacy_name" class="name" onkeyup="noSpaceForm(this);"
                                                onchange="noSpaceForm(this);">`;
                                    $("#div_name").html(szName);
                                }else{
                                    $("#div_name").css('display','none');
                                }
                                if(sItems2.privacy[privacy_phone] === "1"){
                                    szPhone = `<span>연락처를 입력해주세요</span>
                                                <input type="text" maxlength='13' placeholder="예)010-1234-5678" class="phone phoneNumber" id="privacy_phone">`;
                                    $("#div_phone").html(szPhone);
                                }else{
                                    $("#div_phone").css('display','none');
                                }
                                if(sItems2.privacy[privacy_email] === "1"){
                                    szEmail =  `<span>이메일를 입력해주세요</span>
                                                <input type="text" maxlength='13' placeholder="예)010-1234-5678" class="email" id="privacy_email">`
                                    $("#div_email").html(szEmail);           
                                }else{
                                    $("#div_email").css('display','none');
                                }
                                if(sItems2.privacy[privacy_address] === "1"){
                                    szEmail =  `<span>주소를 입력해주세요</span>
                                                <input type="text" maxlength='100' placeholder="주소를 입력해주세요." class="email" id="privacy_address">`
                                    $("#div_address").html(szEmail);           
                                }else{
                                    $("#div_address").css('display','none');
                                }
                                
                                if(isEmpty(sItems2.privacy[privacy_customer])){
                                    $("#privacy_customer").css('display', 'none');
                                }else{
                                    $("#privacy_customer").css('display', 'block');
                                    $("#privacy_customer").append(DecodingUC(sItems2.privacy[privacy_customer]))
                                }
                                
                                break;
                            case "quize" :
                                // 퀴즈 개수를 구해 구조 인터페이스 생성
                                // 퀴즈 개수 설정
                                // 퀴즈 생성 시 결과 값을 위한 TagID 리스트를 생성한다. (값을 확인 위한 ID)
                                
                                var nQizeCnt = sItems2.length;
                                nQizeCnt = 0;
                                
                                // "file/${coId}/${szTemp}"
                                var szHTML = "";
                                var szPopup = "";
                                $.each(sItems2, function (key3, Items3){
                                    // var ResultJSON = {};
                                    nQizeCnt = key3; 
                                    // var quizID = '#quiz' + nQizeCnt + '';   
                                    if(szHTML === ""){
                                        szHTML = `<div class="swiper-slide">
                                        <div class="addit-QuizContent_area first-aniamtion ">
                                            <div class="QuizImg-area ScaleDiv addit-QuizImg-area" data-swiper-parallax="-900">
                                                <img src="file/${coId}/${Items3.ox_quiz_img}" alt="퀴즈이미지">
                                            </div>
                                            <div class="QuizText ScaleDiv">
                                                <span>Q${Number(nQizeCnt + 1)}.</span>
                                                <br>${DecodingUC(Items3["quizTitle"])}
                                            </div>
                                            <div class="addit-ox_area-select" data-swiper-parallax="-200">
                                                @@
                                            </div>
                                        </div>
                                    </div>`;
                                        if ((Items3.answer) == "1"){
                                            var tmpHTML = `<div class="Quizcontent ScaleDiv Num${Number(nQizeCnt + 1)} true">
                                                            <div class="Quiz_anwer">
                                                            <img class="oxImg" data-quiznum="${nQizeCnt}" data-answer="${Items3.ox_answer}" data-ox="1" data-socre="${Items3.ox_quiz_score}" src="file/${coId}/${Oimg}" alt="O이미지">
                                                        </div>
                                                        </div>
                                                        <div class="Quizcontent ScaleDiv Num${Number(nQizeCnt + 1)} false">
                                                        <div class="Quiz_anwer">
                                                            <img class="oxImg" data-quiznum="${nQizeCnt}" data-ox="0" data-answer="${ox_answer}" data-socre="${Items3.ox_quiz_score}" src="file/${coId}/${Ximg}" alt="X이미지">
                                                        </div>
                                                    </div>
                                                    </div>`;                                                        
                                        }else{
                                            var tmpHTML = `<div class="Quizcontent ScaleDiv Num${Number(nQizeCnt + 1)} true">
                                                    <div class="Quiz_anwer">
                                                    <img class="oxImg" data-quiznum="${nQizeCnt}" data-answer="${Items3.ox_answer}" data-ox="0" data-socre="${Items3.ox_quiz_score}" src="file/${coId}/${Oimg}" alt="O이미지">
                                                    </div>
                                                    </div><div class="Quizcontent ScaleDiv Num${Number(nQizeCnt + 1)} false">
                                                        <input type="hidden">
                                                        <div class="Quiz_anwer">
                                                            <img class="oxImg" data-quiznum="${nQizeCnt}" data-ox="1" data-answer="${Items3.ox_answer}" data-socre="${Items3.ox_quiz_score}" src="file/${coId}/${Ximg}" alt="X이미지">
                                                        </div>
                                                                </div>`;
                                        }
                                        szHTML = szHTML.replaceAll('@@', tmpHTML);
                                    }else{
                                        szHTML = szHTML + `<div class="swiper-slide">
                                                        <div class="addit-QuizContent_area first-aniamtion ">
                                                            <div class="QuizImg-area ScaleDiv addit-QuizImg-area" data-swiper-parallax="-900">
                                                                <img src="file/${coId}/${Items3.ox_quiz_img}" alt="퀴즈이미지">
                                                            </div>
                                                            <div class="QuizText ScaleDiv">
                                                                <span>Q${Number(nQizeCnt + 1)}.</span>
                                                                <br>${DecodingUC(Items3["quizTitle"])}
                                                            </div>
                                                            <div class="addit-ox_area-select" data-swiper-parallax="-200">
                                                                @@
                                                            </div>
                                                        </div>
                                                    </div>`;
                                        if ((Items3.answer) == "1"){
                                            var tmpHTML = `<div class="Quizcontent ScaleDiv Num${Number(nQizeCnt + 1)} true">
                                                            <div class="Quiz_anwer">
                                                            <img class="oxImg" data-quiznum="${nQizeCnt}" data-ox="1" data-answer="${Items3.ox_answer}" data-socre="${Items3.ox_quiz_score}" src="file/${coId}/${Oimg}" alt="O이미지">
                                                        </div>
                                                        </div><div class="Quizcontent ScaleDiv Num${Number(nQizeCnt + 1)} false">
                                                        <input type="hidden">
                                                        <div class="Quiz_anwer">
                                                            <img class="oxImg" data-quiznum="${nQizeCnt}" data-ox="0" data-answer="${Items3.ox_answer}" data-socre="${Items3.ox_quiz_score}" src="file/${coId}/${Ximg}" alt="X이미지">
                                                        </div>
                                                    </div>`;                                                        
                                        }else{
                                            var tmpHTML = `<div class="Quizcontent ScaleDiv Num${Number(nQizeCnt + 1)} true">
                                                    <div class="Quiz_anwer">
                                                    <img class="oxImg" data-quiznum="${nQizeCnt}" data-answer="${Items3.ox_answer}" data-ox="0" data-socre="${Items3.ox_quiz_score}" src="file/${coId}/${Oimg}" alt="O이미지">
                                                    </div>
                                                    </div><div class="Quizcontent ScaleDiv Num${Number(nQizeCnt + 1)} false">
                                                        <input type="hidden">
                                                        <div class="Quiz_anwer">
                                                            <img class="oxImg" data-quiznum="${nQizeCnt}" data-answer="${Items3.ox_answer}" data-ox="1" data-socre="${Items3.ox_quiz_score}" src="file/${coId}/${Ximg}" alt="X이미지">
                                                        </div>
                                                                </div>`;
                                        }
                                        szHTML = szHTML.replaceAll('@@', tmpHTML);
                                      
                                        
                                    }
                                    if(szPopup === ""){
                                        szPopup = `<div class="layer_popup ok_layer_popup" id="ok_layer_popup${nQizeCnt}" data-popupNum="${nQizeCnt}">
                                                    <div class="popup_content">
                                                        <div class="popup_anwer" id="popup_anwer${nQizeCnt}"></div>
                                                        <div class="popup_anwer_info">${DecodingUC(Items3.ox_answer_desc)}</div>
                                                        <div class="popup_next">다음</div>
                                                    </div>
                                                </div>`
                                    }else{
                                        szPopup = szPopup + `<div class="layer_popup ok_layer_popup" id="ok_layer_popup${nQizeCnt}" data-popupNum="${nQizeCnt}">
                                                    <div class="popup_content">
                                                        <div class="popup_anwer" id="popup_anwer${nQizeCnt}"></div>
                                                        <div class="popup_anwer_info">${DecodingUC(Items3.ox_answer_desc)}</div>
                                                        <div class="popup_next">다음</div>
                                                    </div>
                                                </div>`
                                    }
                                    nQizeCnt = nQizeCnt + 1;
                                });     
                                $("#popup_result").html(szPopup)
                                szContent = szHTML;  
         
                                break;
                            case "shot":
                                // 인증샷
                                var nShot = sItems2.length;
                                var shotDiv = $("#shotDiv");
                                if (nShot > 0){
                                    $.each(sItems2, function (key3, Items3){
                                        // 세부 정보 입력 (구독 인증샷 0 / 댓글 인증샷 1)
                                        // 인증샷 ID : shot_type + 퀴즈번호
                                        var sztmpID = shot_type + key3;
                                        if (Items3[shot_type] == "0"){   
                                            var szURL = DecodingUC(Items3[shot_shotUrl]);
                                            var szlinkTitle = DecodingUC(Items3[shot_title]);
                                            var szHTML = `<div class="addit-QuizText addit-ScaleDiv addit-upload-div">
                                                            <div class="addit-quiz">
                                                                <span class="addit-span">
                                                                    <div><i class="fa-solid fa-camera-retro"></i> 유튜브 구독 인증샷을 첨부해주세요.</div>
                                                                    <a href="${szURL}" target="blank" class="addit-youtube-url-button"">
                                                                        <img src="img/youtube.png" alt="유튜브아이콘"
                                                                        > ${DecodingUC(szlinkTitle)}
                                                                    </a>
                                                                </span>
                                                            </div>
                                                            <div class="addit-preview-area">
                                                                <img src="img/noneImg.jpg" class="thumb" />
                                                            </div>
                                                            <div class="addit-ScaleDiv flie-div">
                                                                <input class="addit-margin-top2 file-count" type="file" id="upload${sztmpID}" name="upload1">
                                                                <p class="tex">이미지 크기는 10MB 이하 파일만 첨부가능합니다.</p>
                                                            </div>
                                                        </div>`; 
                                            shotDiv.append(szHTML);            
                                        }else if(Items3[shot_type] == "1"){
                                            var szHTML = `<div class="addit-QuizText addit-ScaleDiv addit-upload-div">
                                                            <div class="addit-quiz">
                                                                <span class="addit-span">
                                                                    <div><i class="fa-solid fa-camera-retro"></i>댓글 인증샷을 첨부해주세요.</div>
                                                                </span>
                                                            </div>
                                                            <div class="addit-preview-area">
                                                                <img src="img/noneImg.jpg" class="thumb" />
                                                            </div>
                                                            <div class="addit-ScaleDiv flie-div">
                                                                <input class="addit-margin-top2 file-count" type="file" id="upload${sztmpID}" name="upload1">
                                                                <p class="tex">이미지 크기는 10MB 이하 파일만 첨부가능합니다.</p>
                                                            </div>
                                                        </div>`;
                                            shotDiv.append(szHTML);  
                                        }
                                    });                             
                                    ResultJSON['type'] = "file";
                                    ResultJSON['id'] = sztmpID;
                                    ResultList.push(ResultJSON);
                                    nShot = nShot + 1;        
                                    }else{
                                            shotDiv.css('display','none')
                                    }               
                                break;
                            default:
                                break;
                        }
                    });
                });
            }
            
        });
    } catch (e) {
        // console.log("drawEventData_Real(parser) : " + e.message);
    }
    swiper.appendSlide(szContent); //append the images
    swiper.update(); 
                         
 
    $('.popup_next').last().addClass('last-contents');
}


// desc : 결과 분석을 위한 버튼 인터페이스 생성
function draw_result_button(pTarget){
  var szHTML = ` <button class="addit-button-type9" id="btn_result_inpath">인입율 보기</button>
                <button class="addit-button-type9" id="btn_result_random">랜덤 추첨자 뽑기</button>
                <button class="addit-button-type9" id="btn_flie_download_all">첨부파일 전체 다운로드</button>
               `;       
//   var szHTML = ` <button class="addit-button-type9" id="btn_result_inpath">인입율 보기</button>
//                 <!--<button class="addit-button-type9" id="btn_result_score">점수 우선 순위</button>-->
//                 <button class="addit-button-type9" id="btn_result_right">정답자만 보기</button>
//                 <button class="addit-button-type9" id="btn_result_random">랜덤 추첨자 뽑기</button>
//                 <button class="addit-button-type9" id="btn_result_answer">사용자 입력값 보기</button>
//                 <button class="addit-button-type9 addit-position-button" id="btn_resultList_down"><img class="addit-icon-type-4" src="img/excel.png" alt="엑셀아이콘">참여자명단 다운로드</button>`;       
  $(pTarget).html(szHTML);
}

// 퀴즈에 대한 질문을 출력한다.
function draw_event_quiz_list(pJSON, pTarget){
  var szHTML = "";
  var szHTML2 = "";
  var szButton = '<button class="addit-button-type9 btn-list-prev">접기<i class="fa-solid fa-arrow-up"></i></button>';
  var tmpJSON = JSON.parse(pJSON);
    szHTML = '<label class="addit-h2 addit-margin1">--- 질문 리스트 ---</label>&nbsp';
    szHTML = szHTML + '<button class="addit-button-type9" id="btn_list_more">더 보기<i class="fa-solid fa-arrow-down"></i></button>';
    szHTML = szHTML + '<button class="addit-button-type9 btn-list-prev">접기<i class="fa-solid fa-arrow-up"></i></button>';
    szHTML = szHTML + '<label class="addit-sub-2">질문을 클릭하면 세부 정보를 볼 수 있습니다.(만족도 조사 시)</label>';
    $.each(tmpJSON, function (skey, sItems) {  
      if (skey === "quize"){
        for (var i=0; i<sItems.length; i++){
          if ((szHTML === "") && (szHTML2 === "")){
            szHTML = '<div class="addit-quiz-list" data-idx="' + String(i) + '">'
            szHTML = szHTML + '<p class="addit-p-width quize-tilte" data-idx="' + String(i) + '">' + DecodingUC(sItems[i]['quizTitle']) + '</p>'
            szHTML = szHTML + '<button data-idx="' + String(i) + '" class="addit-button-type9 btn-addit-quiz-list" id="view_chart_' + String(i) + '">차트보기</button>'
            szHTML = szHTML + '<button id="view_text_' + String(i) + '" class="addit-button-type9 btn-addit-quiz-text">사용자 입력 값 보기</button>'
            szHTML = szHTML + '</div>';

            // all chart
            szHTML2 = '<div class="addit-all-chart-item">';
            szHTML2 = szHTML2 + '<canvas id="chart_' + String(i) + '"></canvas>';
            szHTML2 = szHTML2 + '</div>';
        }else{
            szHTML = szHTML + '<div class="addit-quiz-list" data-idx="' + String(i) + '">'
            szHTML = szHTML + '<p class="addit-p-width quize-tilte" data-idx="' + String(i) + '">' + DecodingUC(sItems[i]['quizTitle']) + '</p>'
            szHTML = szHTML + '<button data-idx="' + String(i) + '" class="addit-button-type9 btn-addit-quiz-list" id="view_chart_' + String(i) + '">차트보기</button>'
            szHTML = szHTML + '<button id="view_text_' + String(i) + '" class="addit-button-type9 btn-addit-quiz-text">사용자 입력 값 보기</button>'
            szHTML = szHTML + '</div>';

            // all chart
            szHTML2 = szHTML2 + '<div class="addit-all-chart-item">';
            szHTML2 = szHTML2 + '<canvas id="chart_' + String(i) + '"></canvas>';
            szHTML2 = szHTML2 + '</div>';
        }
        }
      }
    });
  $(pTarget).html(szHTML);
  $("#all_chart_div").html(szHTML2);
  $(pTarget).append(szButton);
}
// desc : 이벤트 리스트를 그린다.
function draw_event_list_checkbox(pJSON, pTarget, pEventIdx){
  var dataHTML = ""; 
  var TotalDataCount = 0;
  try{
      $.each(pJSON, function (key, Items) {
          // 페이징을 위한 정보를 구한다.
          TotalDataCount = pJSON.totcount;
          if (key == "tabledata") {
              tblJSON = JSON.parse(JSON.stringify(pJSON.tabledata));
              $.each(tblJSON, function (skey, sItems) {
                if (pEventIdx == sItems.e_idx){
                  dataHTML = dataHTML + '<option selected value="' + sItems.e_idx + '">';
                  // div_event_quiz_list에 퀴즈를 출력한다.
                  g_event_title = DecodingUC(sItems.e_title);
                  draw_event_quiz_list(sItems.e_data, '#div_event_quiz_list');
                }
                else
                  dataHTML = dataHTML + '<option value="' + sItems.e_idx + '">';
                dataHTML = dataHTML + DecodingUC(sItems.e_title) + '</option>';
              });
          }
      });
      $(pTarget).html(dataHTML);
  } catch (e) {
      console.log("loaddata(parser) : " + e.message);
  }
}


// desc : 사용자 입력 답변을 분석
function draw_user_answer(pJSON){
  var szHTML = "";
  var tmpJSON = JSON.parse(pJSON);
  var i = 0;
  $.each(tmpJSON, function(key, item){
    if(i == 0){
        if (szHTML == "")
      szHTML = item['user-answer'];
        else  
      szHTML = szHTML + ' / ' + item['user-answer'];
    }else{
        szHTML = szHTML + ' / ' + item['user-answer'];
    }
    i = i + 1;
  });
  return szHTML; 
}

// desc : 사용자 입력 답변을 분석
function draw_result_tabledata(pJSON){
    
  var szHTML = "";
  var tmpJSON = JSON.parse(pJSON);
  var i = 0;
    $.each(tmpJSON, function(key, item){
        if(i == 0){
            if (szHTML == "")
        szHTML = item['user-answer'];
            else  
        szHTML = szHTML + ' ` ' + item['user-answer'];
        }else{
            szHTML = szHTML + ' ` ' + item['user-answer'];
        }
        i = i + 1;
    });
  return szHTML;
}
/*
<!-- 문제 유형에 따라 결과 확인 내용이 달라진다. 
                1) 만족도 조사일 경우 (정답이 없다, 객관식/주관식 혼용)
                2) 퀴즈일 경우 : 정답자 보기 
                3) 인증샷 등만 있을 경우 (덕담 이벤트 등)
*/
function draw_event_result(pJSON, pTarget){
    var szHTML = "";
    var nCount = 0;
    try {
        $.each(pJSON, function (key, Items) {
            if (key == "totcount"){
              g_total_result_count = Items;
              $('#span_total_user').html(String(g_total_result_count));
            }
            if (key == "tabledata") {
                var tmpData = JSON.parse(JSON.stringify(Items));
                $.each(tmpData, function (key1, Items1) {
                    nCount = nCount + 1;
                    szHTML = szHTML + '<tr class="addit-border-01">';
                    szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(nCount) + '</td>';
                    szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + Items1.r_date +'</td>';
                    szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + Items1.user_name +'</td>';
                    szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + Items1.user_phone +'</td>';
                    szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + Items1.user_email +'</td>';
                    szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + Items1.user_score +'</td>';
                    szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + draw_user_answer(Items1.user_result) +'</td>';
                    // 2023-02-22 | 정용재
                    // 인증샷 노출 버튼 필요 클릭시 인증샷 경로로 창 띄우기 -> 기존과 동일 
                    // 이전에 td는 밑에 주석처리
                    szHTML = szHTML + '<td class=" addit-padding1 addit-text-center"><button data-shotcount = "' + String(nCount) + '" class="shot_view" id="shot_view_' + String(nCount) + '">보기</button></td>';
                    // szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + Items1.user_shotattach +'</td>';
                    //szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + get_string_length(Items1.user_inpath, 0, 40) +'</td>';
                    // 인입율 관련 정보를 배열에 저장한다.
                    if (getMatchtring(Items1.user_inpath, 'facebook')){
                      inpath_Array[0] = inpath_Array[0] + 1;  
                    }else if (getMatchtring(Items1.user_inpath, 'blog'))
                    {
                      inpath_Array[1] = inpath_Array[1] + 1;
                    }
                    else if (getMatchtring(Items1.user_inpath, 'instagram'))
                    {
                      inpath_Array[2] = inpath_Array[2] + 1;
                    }
                    else if (getMatchtring(Items1.user_inpath, 'menteimo'))
                    {
                      inpath_Array[3] = inpath_Array[3] + 1;
                    }else{
                      inpath_Array[4] = inpath_Array[4] + 1;
                    };
                    szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + Items1.user_os +'</td>';
                    szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + Items1.user_browser +'</td>';
                    szHTML = szHTML + '</tr>';
                });
            }
        });
    } catch (e) {
        console.log("drawEventData(parser) : " + e.message);
    }
    $(pTarget).html(szHTML);
}

//테이블데이터로 결과값 뿌리기
function draw_result_tabledata(pDataJSON, target, porderType){
    var tmpData = {};
    
    $.each(pDataJSON, function (key, Items) {
        if (key == "totcount"){
            g_total_result_count = Items;
            $('#span_total_user').html(String(g_total_result_count));
          }
        if (key == "tabledata") {
           
            tmpData = JSON.parse(JSON.stringify(Items));
            $.each(tmpData, function (key1, Items1) {
                if (getMatchtring(Items1.user_inpath, 'facebook')){
                    inpath_Array[0] = inpath_Array[0] + 1;  
                  }else if (getMatchtring(Items1.user_inpath, 'blog'))
                  {
                    inpath_Array[1] = inpath_Array[1] + 1;
                  }
                  else if (getMatchtring(Items1.user_inpath, 'instagram'))
                  {
                    inpath_Array[2] = inpath_Array[2] + 1;
                  }
                  else if (getMatchtring(Items1.user_inpath, 'menteimo'))
                  {
                    inpath_Array[3] = inpath_Array[3] + 1;
                  }else{
                    inpath_Array[4] = inpath_Array[4] + 1;
                  };
            })

            // return; 
        }
    });           
    //$(target).empty();
    $(target).DataTable({
        data: tmpData,
        paging: false,              // 페이징을 한다.
        pageLength: 20, 
        searching: false,
        order: [1, porderType],
        dom: 'Bfrtip ',
        lengthMenu: [
            [ 25, 40, -1 ],
            [ '25 개씩', '40 개씩', '모두 보기' ]
        ],
        //searchBuilder: {
        //    columns: [5, 6, 7, 8]
        //},
        buttons: [
            // {
            //     extend : 'pageLength',
            //     text : "페이지당 출력 줄수"
            // },
            {
                extend: 'colvis',
                text: "칼럼 숨기기/보기",
                postfixButtons: [ 'colvisRestore' ],
                //columns: ':gt(0)' 첫번째 열은 버튼으로 표시하지 않는다.
            }, 
            {
                extend: 'excelHtml5',
                text: '엑셀로 저장',
                exportOptions: {
                columns: ':visible',
                orthogonal: 'export' 
                }
            }
        ],   
        destroy: true,
        language: {         // url을 통해 language를 부를 경우 desctory 함수 호출 시 오류가 발생한다. 문제가 뭘까? 순서 문제인 듯
            "sDecimal": "",
            "sThousands": ",",
            "sEmptyTable": "데이터가 없습니다",
            "sInfo": "_START_ - _END_ / 전체 : _TOTAL_",
            "sInfoEmpty": "0 - 0 / 0",
            "sInfoFiltered": "(총 _MAX_ 개)",
            "sInfoPostFix": "",
            "sLengthMenu": "페이지당 줄수 _MENU_",
            "sLoadingRecords": "읽는중...",
            "sProcessing": "처리중...",
            "sSearch": "검색:",
            "sZeroRecords": "검색 결과가 없습니다",
            "sSearchPlaceholder": "",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "처음",
                "sLast": "마지막",
                "sNext": "다음",
                "sPrevious": "이전"
            },
            "oAria": {
                "sSortAscending": ": 오름차순 정렬",
                "sSortDescending": ": 내림차순 정렬"
            },
            searchBuilder: {
                add: '조건추가',
                condition: '조건',
                clearAll: '초기화',
                deleteTitle: '삭제',
                data: '기준',
                leftTitle: 'Left',
                logicAnd: '&&',
                logicOr: '||',
                rightTitle: 'Right',
                title: {
                    0: '검색 조건',
                    _: '검색 조건 (%d)'
                },
                value: '값',
            }
        },
        columns: [
            {
                data: "r_idx",
                //className: 'select-checkbox'
                className: "addit-padding1 addit-text-center"
            },
            {
                data: "r_date",
                //className: 'select-checkbox'
                className: "addit-padding1 addit-text-center"
            },
            {
                data: "user_name",
                visible: true,
                className: "addit-padding1 addit-text-center"
            },
            {
                data: "user_phone",
                visible: true,
                className: "addit-padding1 addit-text-center"
            },
            {
                data: "user_email",
                visible: false,
                className: "addit-padding1 addit-text-center"
            },
            {
                data: "user_address",
                visible: true,
                className: "addit-padding1 addit-text-center"
            },
            {
                data: "user_score",
                visible: true,
                className: "addit-padding1 addit-text-center"
            },
            {
                data: function tmpdraw (tmpData){
                    var szHTML = "";
                    var tmpJSON = tmpData.user_result;
                    var i = 0;
                    if(tmpJSON == ""){
                        return szHTML;
                    }else{
                        tmpJSON = JSON.parse(tmpJSON)
                        try{
                            $.each(tmpJSON, function(key, item){
                                if(i == 0){
                                    if (szHTML == ""){
                                        szHTML = item['user-answer'];
                                    }else{  
                                        szHTML = szHTML + ' ` ' + item['user-answer'];
                                    }
                                }else{
                                    szHTML = szHTML + ' ` ' + item['user-answer'];
                                }
                                
                                i = i + 1;
                                // if (szHTML == "")
                                // szHTML = item['user-answer'];
                                // else  
                                // szHTML = szHTML + ' / ' + item['user-answer'];
                            });
                        }
                        catch(e){
                            //
                        }
                        return szHTML; 
                    }
                    
                },
                visible: true,
                className: "addit-padding1 addit-text-center"
            },
            {
                data: function tmpdraw (tmpData){
                    var szHTML = "";
                    var tmpJSON = tmpData.user_inpath;
               
                    if(tmpJSON == ""){
                        szHTML = "URL 기재 접근이나 앱으로 접근"
                        return szHTML;
                    }else{
                        // tmpJSON = JSON.parse(tmpJSON)
                        szHTML = tmpData.user_inpath;
                        return szHTML; 
                    }
                    
                },
                // data: "user_inpath",
                visible: true,
                className: "addit-padding1 addit-text-center"
            },
            {
                data: function(tmpData){
                    try{
                        if(!isEmpty(tmpData.user_shotattach)){
                            var rtnValue ='';
                            var e_idx = decodeURI(decodeURIComponent($.urlParam("e_idx")));
                            var user_shotattach = tmpData.user_shotattach
                            user_shotattach = user_shotattach.split(",")
                            for(var i = 0; i < user_shotattach.length; i++){
                                if(user_shotattach[i].includes("jpg") || user_shotattach[i].includes("png") || user_shotattach[i].includes("JPEG") || user_shotattach[i].includes("PNG") || user_shotattach[i].includes("jpeg") || user_shotattach[i].includes("JPG")){
                                    if(isEmpty(rtnValue)){
                                        rtnValue = '<button data-shotcount = "' + user_shotattach[i] + '" class="shot_view" id="shot_view_' + user_shotattach[i] + '">보기</button>';
                                    }else{
                                        rtnValue = rtnValue + '<button data-shotcount = "' + user_shotattach[i] + '" class="shot_view" id="shot_view_' + user_shotattach[i] + '">보기</button>';
                                    }
                                }else{
                                    if(isEmpty(rtnValue)){
                                        rtnValue = `<a href='file/event_${e_idx}/${user_shotattach[i]}' download='file/event_${e_idx}/${user_shotattach[i]}' class="flie-down" >다운</a>`;
                                    }else{
                                        rtnValue = rtnValue + `<a href='file/event_${e_idx}/${user_shotattach[i]}' download='file/event_${e_idx}/${user_shotattach[i]}' class="flie-down" >다운</a>`;
                                    }
                                }
                                
                            }
                        }else{
                            var rtnValue = "";
                        }
                        
                    }
                    catch(e){
                        alert(e.message);
                    }
                    return rtnValue;
                },
                visible: true,
                className: "addit-padding1 addit-text-center"
            },
            {
                data: "user_os",
                visible: true,
                className: "addit-padding1 addit-text-center"
            },
            {
                data: "user_browser",
                visible: true,
                className: "addit-padding1 addit-text-center"
            }
        ]
    });
    // dataTable.searchBuilder.container().prependTo(dataTable.table().container());
    //table.destroy();
}


// desc : 유입 경로 관련 차트를 그린다.
function draw_chart(pChart, plabelArray, pDataArray, pDatasetLabel, pTitle){
   
  // Chart 범례
  // Chart 데이터
  var tmpchartdata = {
    labels: plabelArray,
    datasets: [{
      label: pDatasetLabel,
      data: pDataArray,
      borderWidth: 1
    }]
  };
  // Chart 옵션
  var tmpoptionData = {
    layout: {
        padding: 20
    },
      plugins: {
        legend: {
            display: true,
            labels: {
                // This more specific font property overrides the global property
                font: {
                    size: 14
                },
            },
            position: "bottom",
            align: "center"
        },
        title: {
          display: true,
          text: pTitle,
          font: {weight: 'bold'},
          padding: {
            top: 10,
            bottom: 30
            }
        },
        datalabels: {
            formatter: function(value, context) {
              var tmpsum = 0;
              var tmpArray = context.dataset.data;
              for (var i =0; i<tmpArray.length; i++)
              {
                tmpsum = tmpsum + parseInt(tmpArray[i]);
              }
              //return context.chart.data.labels[context.dataIndex] + ':' + value + '(' + Math.round((value/tmpsum)*100) + '%)';
              return value + '(' + Math.round((value/tmpsum)*100) + '%)';
            },
            clamp : true,
            anchor : 'end',
            offset : 1,
            align: 'end', 
            color: '#000000',
            labels:{
              title : {
                font :{
                  size: 12,
                  weight: 'bold'
                },
                position: 'right'
              },
            }
          }
        }
      }
    
  pChart.data = tmpchartdata;  
  pChart.options = tmpoptionData;
  pChart.update();
  pChart.render();
}



// desc : 이벤트 차트전체를 그린다.
function draw_event_list_chart(pJSON, pEventIdx){
    var title = $(".quize-tilte").length
    var viewchart = {}
    for(var i = 0; i < title; i++){
      viewchart[`viewchart${i}`] = new Object();
      var chartID = '#chart_' + i + ''
      var chartTextID = '#view_chart_' + i + ''
      var chartText = $(chartTextID).siblings('.quize-tilte').text();
      var tmpArray = [];
      var string = "";
      $('#table_td').children().each(function(index, tr){
        var tmpUserArray = $(tr).children().eq(5).text();   // "/"로 구분
        string = tmpUserArray.split("`")
        if(!isEmpty(string)){
            string = string[i].split(",")
        }
        for(var j = 0; j <string.length; j++){
            tmpArray.push($.trim(string[j]));
        }
                // 선택한 index에 해당되는 답을 얻어온 후, 앞뒤 공백 제거
      });
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
        viewchart[`viewchart${i}`] = new Chart($(chartID), {
            type : 'pie',
            plugins : [ChartDataLabels]
            
        });
        draw_chart(viewchart[`viewchart${i}`], chart_label_array, chart_data_array, '# 분석', chartText);        
    }
  }


  
// desc : 유입 경로 관련 차트를 그린다.
function draw_chart2(pChart, plabelArray, pDataArray, pDatasetLabel, pTitle){
   
    // Chart 범례
    // Chart 데이터
    var tmpchartdata = {
      labels: plabelArray,
      datasets: [{
        label: pDatasetLabel,
        data: pDataArray,
        borderWidth: 1
      }]
    };
    // Chart 옵션
    var tmpoptionData = {
      layout: {
          padding: 20
      },
        plugins: {
          legend: {
              display: true,
              labels: {
                  // This more specific font property overrides the global property
                  font: {
                      size: 14
                  },
              },
              position: "bottom",
              align: "center"
          },
          title: {
            display: true,
            text: pTitle,
            font: {weight: 'bold'},
            padding: {
              top: 10,
              bottom: 30
              }
          },
          datalabels: {
              formatter: function(value, context) {
                var tmpsum = 0;
                var tmpArray = context.dataset.data;
                for (var i =0; i<tmpArray.length; i++)
                {
                  tmpsum = tmpsum + parseInt(tmpArray[i]);
                }
                //return context.chart.data.labels[context.dataIndex] + ':' + value + '(' + Math.round((value/tmpsum)*100) + '%)';
                return value + '(' + Math.round((value/tmpsum)*100) + '%)';
              },
              clamp : true,
              anchor : 'end',
              offset : 1,
              align: 'end', 
              color: '#000000',
              labels:{
                title : {
                  font :{
                    size: 12,
                    weight: 'bold'
                  },
                  position: 'right'
                },
              }
            }
          }
        }
      
    pChart.data = tmpchartdata;  
    pChart.options = tmpoptionData;
    pChart.update();
    pChart.render();
  }

  // desc : 이벤트 기간별 차트 그린다.
function draw_event_data_chart(pJSON, pEventIdx){
    var tmpArray = []

    $('#table_td').children().each(function(index, tr){
    var tmpUserArray = $(tr).children().eq(1).text();   // "/"로 구분
    string = tmpUserArray.substr(0, 10);

    tmpArray.push($.trim(string));
            // 선택한 index에 해당되는 답을 얻어온 후, 앞뒤 공백 제거
    });
    
    // 챠트를 위한 Label(범례)와 Data를 생성한다.
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

    chart_label_array = []; chart_data_array = [];
    $.each(resultJSON, function(key, value){
      chart_label_array.push(key);
      chart_data_array.push(value);
    });

    dataChart = new Chart($('#data_chart'), {
        type : 'bar',
        plugins : [ChartDataLabels]
    });
    // 챠크를 그린다.
    draw_chart2(dataChart, chart_label_array, chart_data_array, '# 분석', '기간별 참여자 수');        

  }



// 2023-02-23 정용재
// 질문리스트 내에 사용자입력값 보기 클릭시 리스트 + 갯수 리스트 구현
// 리스트 구현
// function draw_list(pChart, plabelArray, pDataArray, pTitle, pTarget){
//     var listCount = pDataArray.length;
//     var szHTML = "";
//     for(var i = 0; i < listCount; i++){
//         if(szHTML === ""){
//             szHTML = '<li class="addit-text-list">' + plabelArray[i] + '<span class="quiz-list-sub">' + pDataArray[i] + '명</span></li>';
//         }else{
//             szHTML = szHTML + '<li class="addit-text-list">' + plabelArray[i] + '<span class="quiz-list-sub">' + pDataArray[i] + '명</span></li>';
//         }
//     }
//     pTarget.html(szHTML);
//     $("#quiz_text_list_title").text(pTitle);
 
// }
function draw_list_table(plabelArray, pDataArray, pTitle, pTarget, porderType, tmpArray){
    var listDataList =  [];
    var totalCount = tmpArray.length;
    var listData =  {};
    var listCount = pDataArray.length;
    for(var i = 0; i < listCount; i++){
        var listData =  {};
        listData.plabelArray = plabelArray[i];
        listData.pDataArray = pDataArray[i];
        listData.dataPersent = Math.floor(pDataArray[i] / totalCount * 100) + `%`;
        listDataList.push(listData);
    }
    // alert(listData)
    listData = JSON.parse(JSON.stringify(listData))
    $(pTarget).DataTable({
        data: listDataList,
        paging: false,              // 페이징을 한다.
        pageLength: 30, 
        searching: false,
        order: [1, porderType],
        dom: 'Bfrtip ',
        lengthMenu: [
            [ 25, 40, -1 ],
            [ '25 개씩', '40 개씩', '모두 보기' ]
        ],
        //searchBuilder: {
        //    columns: [5, 6, 7, 8]
        //},
        buttons: [
            {
                extend : 'pageLength',
                text : "페이지당 출력 줄수"
            },
            {
                extend: 'colvis',
                text: "칼럼 숨기기/보기",
                postfixButtons: [ 'colvisRestore' ],
                //columns: ':gt(0)' 첫번째 열은 버튼으로 표시하지 않는다.
            }, 
            {
                extend: 'excelHtml5',
                text: '엑셀로 저장',
                exportOptions: {
                columns: ':visible',
                orthogonal: 'export' 
                }
            }
        ],   
        destroy: true,
        language: {         // url을 통해 language를 부를 경우 desctory 함수 호출 시 오류가 발생한다. 문제가 뭘까? 순서 문제인 듯
            "sDecimal": "",
            "sThousands": ",",
            "sEmptyTable": "데이터가 없습니다",
            "sInfo": "_START_ - _END_ / 전체 : _TOTAL_",
            "sInfoEmpty": "0 - 0 / 0",
            "sInfoFiltered": "(총 _MAX_ 개)",
            "sInfoPostFix": "",
            "sLengthMenu": "페이지당 줄수 _MENU_",
            "sLoadingRecords": "읽는중...",
            "sProcessing": "처리중...",
            "sSearch": "검색:",
            "sZeroRecords": "검색 결과가 없습니다",
            "sSearchPlaceholder": "",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "처음",
                "sLast": "마지막",
                "sNext": "다음",
                "sPrevious": "이전"
            },
            "oAria": {
                "sSortAscending": ": 오름차순 정렬",
                "sSortDescending": ": 내림차순 정렬"
            },
            searchBuilder: {
                add: '조건추가',
                condition: '조건',
                clearAll: '초기화',
                deleteTitle: '삭제',
                data: '기준',
                leftTitle: 'Left',
                logicAnd: '&&',
                logicOr: '||',
                rightTitle: 'Right',
                title: {
                    0: '검색 조건',
                    _: '검색 조건 (%d)'
                },
                value: '값',
            }
        },
        columns: [
            {
                data: "plabelArray",
                visible: true,
                //className: 'select-checkbox'
                className: "addit-padding1 addit-text-center"
            },
            {
                data: "pDataArray",
                //className: 'select-checkbox'
                visible: true,
                className: "addit-padding1 addit-text-center"
            },
            {
                data: "dataPersent",
                visible: true,
                className: "addit-padding1 addit-text-center"
            },
        ]
    });
    // dataTable.searchBuilder.container().prependTo(dataTable.table().container());
    //table.destroy();
    // var listCount = pDataArray.length;
    // var szHTML = "";
    // for(var i = 0; i < listCount; i++){
    //     if(szHTML === ""){
    //         szHTML = '<li class="addit-text-list">' + plabelArray[i] + '<span class="quiz-list-sub">' + pDataArray[i] + '명</span></li>';
    //     }else{
    //         szHTML = szHTML + '<li class="addit-text-list">' + plabelArray[i] + '<span class="quiz-list-sub">' + pDataArray[i] + '명</span></li>';
    //     }
    // }
    // pTarget.html(szHTML);
    $("#quiz_text_list_title").text(pTitle);
 
}

// 유입 경로 관련 테이블을 그린다.
function draw_inpath_table(pTarget){
  var szHTML = "";
  szHTML = szHTML + '<tr class="addit-border-01">';
  szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(inpath_Array[0]) + '건</td>';
  szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(inpath_Array[1]) + '건</td>';
  szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(inpath_Array[2]) + '건</td>';
  szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(inpath_Array[3]) + '건</td>';
  szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(inpath_Array[4]) + '건</td>';
  szHTML = szHTML + '</tr>';

  szHTML = szHTML + '<tr class="addit-border-01">';
  var tmpPercent = (inpath_Array[0]/g_total_result_count).toFixed(2);
  szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(tmpPercent * 100) + '%</td>';
  var tmpPercent = (inpath_Array[1]/g_total_result_count).toFixed(2);
  szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(tmpPercent * 100) + '%</td>';
  var tmpPercent = (inpath_Array[2]/g_total_result_count).toFixed(2);
  szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(tmpPercent * 100) + '%</td>';
  var tmpPercent = (inpath_Array[3]/g_total_result_count).toFixed(2);
  szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(tmpPercent * 100) + '%</td>';
  var tmpPercent = (inpath_Array[4]/g_total_result_count).toFixed(2);
  szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + String(tmpPercent * 100) + '%</td>';
  szHTML = szHTML + '</tr>';
  $(pTarget).html(szHTML);
}

function draw_random_list(pJSON, pArray, pTarget){
    tmpJSON = pJSON.tabledata;
    var szHTML = "";
 
    for (var i=0; i<pArray.length; i++){
        var firtNum = tmpJSON[pArray[i]].user_phone.substr(0,3);
        var secondNum = tmpJSON[pArray[i]].user_phone.substr(3,4);
        var thNum = tmpJSON[pArray[i]].user_phone.substr(7,4);
              szHTML = szHTML + '<tr class="addit-border-01">';
              szHTML = szHTML + '<td class="addit-padding1 addit-font-color5 addit-text-center">' + tmpJSON[pArray[i]].r_idx + '</td>';
              szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + tmpJSON[pArray[i]].user_name + '</td>';
              szHTML = szHTML + '<td style="mso-number-format:"\@";" class="addit-padding1 addit-text-center">&#8203;' + firtNum + '-' + secondNum + '-' + thNum + '</td>';
              szHTML = szHTML + '<td class="addit-padding1 addit-text-center random-answer">' + draw_user_answer(tmpJSON[pArray[i]].user_result) + '</td>';
              szHTML = szHTML + '</tr>';    
    }
    $(pTarget).html(szHTML);
    return;
}

function draw_random_list2(pJSON, pArray, pTarget){
    var szHTML = "";
   
    for (var i=0; i<pArray.length; i++){
        var firtNum = pJSON[pArray[i]].user_phone.substr(0,3)
        var secondNum = pJSON[pArray[i]].user_phone.substr(3,4)
        var thNum = pJSON[pArray[i]].user_phone.substr(7,4)
              szHTML = szHTML + '<tr class="addit-border-01">';
              szHTML = szHTML + '<td class="addit-padding1 addit-font-color5 addit-text-center">' + pJSON[pArray[i]].r_idx + '</td>';
              szHTML = szHTML + '<td class=" addit-padding1 addit-text-center">' + pJSON[pArray[i]].user_name + '</td>';
              szHTML = szHTML + '<td style="mso-number-format:"\@";" class="addit-padding1 addit-text-center">&#8203;' + firtNum + '-' + secondNum + '-' + thNum + '</td>';
              szHTML = szHTML + '<td class="addit-padding1 addit-text-center random-answer">' + draw_user_answer(pJSON[pArray[i]].user_result) + '</td>';
              szHTML = szHTML + '</tr>';    
    }
    $(pTarget).html(szHTML);
    return;
}

//ox 퀴즈관련 이벤트

// 퀴즈갯수 입력 시
// 퀴즈 개수 만큼 퀴즈 인터페이스를 그린다.
function DrawOxQuizInfo(pCount, pTarget){
    // let PA =[];
    var szHTML = ""
    let sztmpImgID = "ox_quiz_img";
    let sztmpTitleID = "ox_quiz_title";
    let sztmpScoreID = "ox_quiz_score";
    let sztmpAnsID = "ox_answer";
    let sztmpDescID = "ox_answer_desc";
    var tmppblnum = 0;
    // 퀴즈 동적 추가 / 삭제를 위해 최초 퀴즈 정보를 기록한다.
    //let pblLength = $(".pblnum").length; // 첫 실행될떄 퀴즈 길이
    // 전체 퀴즈 카운트가 0일 경우 추가할 퀴즈 개수를 전체 퀴즈 카운트에 할당
    for (var i=0; i<pCount; i++){
        // 퀴즈 배열이 0일 경우 문제 인덱스는 0, 퀴즈 배열이 존재할 경우 배열의 마지막 값이 문제 인덱스
        if (Problem_Array.length === 0){
            tmppblnum = 0;
        }
        else{
           tmppblnum =  Problem_Array[Problem_Array.length-1]+1;
        }
        szHTML = "";
        szHTML = szHTML + '<div class="addit-box-type2" data-pblnum="' + String(tmppblnum) + '"><h2 class="addit-h2 addit-quiz-number">';
        szHTML = szHTML + String(tmppblnum+1);
        szHTML = szHTML + '번 퀴즈</h2>';
        szHTML = szHTML + '<button class="addit-button-right" id="btn_delete_problem" data-pblnum="' + String(tmppblnum) + '">삭제</button>';
        szHTML = szHTML + '<div class="addit-box-type3">';
        szHTML = szHTML + '<label class="addit-grid-8">퀴즈 이미지</label>';
        szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" type="file" id="' + sztmpImgID  + String(tmppblnum) +'">';
        szHTML = szHTML + '<img src="" id="ox_quiz_img' + String(tmppblnum) + '_img" class="addit-preview-size"></img>';
        szHTML = szHTML + '</div>';
        szHTML = szHTML + '<div class="addit-box-type3">';
        szHTML = szHTML + '<label class="addit-grid-8">퀴즈 제목</label>';
        szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" maxlength="100" type="text" id="' + sztmpTitleID  + String(tmppblnum) +'" placeholder="퀴즈 문제 제목을 입력해주세요">';
        szHTML = szHTML + '</div>';
        szHTML = szHTML + '<div class="addit-box-type3">';
        szHTML = szHTML + '<label class="addit-grid-8">퀴즈 점수</label>';
        szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" oninput="maxLengthCheck(this)" maxlength="3" type="number" id="' + sztmpScoreID  + String(tmppblnum) +'" placeholder="해당퀴즈 배점 점수를 입력해주세요">';
        szHTML = szHTML + '</div>';
        szHTML = szHTML + '<div class="addit-box-type3">';
        szHTML = szHTML + '<label class="addit-grid-8">퀴즈 정답</label>';
        szHTML = szHTML + '<label class="addit-grid-11 addit-margin5 addit-p" for="' + sztmpAnsID  + String(tmppblnum) +'">';
        szHTML = szHTML + '맞다<input type="radio" name="' + sztmpAnsID  + String(tmppblnum) +'" id="' + sztmpAnsID  + String(tmppblnum) +'" class="addit-pointer" value="0"></label>';
        szHTML = szHTML + '<label class="addit-grid-11 addit-margin5 addit-p" for="' + sztmpAnsID  + String(tmppblnum) +'_1">';
        szHTML = szHTML + '아니다<input type="radio" name="' + sztmpAnsID  + String(tmppblnum) +'" id="' + sztmpAnsID  + String(tmppblnum) +'_1"" class="addit-pointer" value="1"></label>';
        szHTML = szHTML + '</div>';
        szHTML = szHTML + '<div class="addit-box-type3">';
        szHTML = szHTML + '<label class="addit-grid-8">결과 설명</label>';
        szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" maxlength="500" type="text" id="' + sztmpDescID  + String(tmppblnum) +'" placeholder="퀴즈정답 설명을 입력하세요.">';
        szHTML = szHTML + '</div>';
        szHTML = szHTML + '</div>';
        
        

        Problem_Array.push(tmppblnum);
        if (Problem_Array.length === 0)
            $(pTarget).html(szHTML);
        else    
            $(pTarget).append(szHTML);
    }
    console.log(Problem_Array);
}

// 퀴즈결과페이지 수 입력 시
// 결과페이지 개수 만큼 결과페이지 인터페이스를 그린다.
function DrawResultPageInfo(pCount, pTarget){
    // let PA =[];
    var szHTML = ""
    let sztmpresultImgID = "ox_result_img";
    let sztmpRtextID = "result_text";
    let sztmpRscoreID = "result_score";
    var tmpRpagenum = 0;
    // 퀴즈 동적 추가 / 삭제를 위해 최초 퀴즈 정보를 기록한다.
    //let pblLength = $(".pblnum").length; // 첫 실행될떄 퀴즈 길이
    // 전체 퀴즈 카운트가 0일 경우 추가할 퀴즈 개수를 전체 퀴즈 카운트에 할당
    for (var i=0; i<pCount; i++){
        // 퀴즈 배열이 0일 경우 문제 인덱스는 0, 퀴즈 배열이 존재할 경우 배열의 마지막 값이 문제 인덱스
        if (rPage_Array.length === 0){
            tmpRpagenum = 0;
        }
        else{
            tmpRpagenum =  rPage_Array[rPage_Array.length-1]+1;
        }
        szHTML = "";
        szHTML = szHTML + '<div class="addit-box-type2" data-pblnum="' + String(tmpRpagenum) + '"><h2 class="addit-h2 addit-quiz-number">';
        szHTML = szHTML + String(tmpRpagenum+1);
        szHTML = szHTML + '번 결과</h2>';
        szHTML = szHTML + '<button class="addit-button-right" id="btn_delete_Rpage" data-rpnum="' + String(tmpRpagenum) + '">삭제</button>';
        szHTML = szHTML + '<div class="addit-box-type3">';
        szHTML = szHTML + '<label class="addit-grid-8">결과 이미지</label>';
        szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" type="file" id="' + sztmpresultImgID  + String(tmpRpagenum) +'">';
        szHTML = szHTML + '<img src="" id="ox_result_img' + String(tmpRpagenum) + '_img" class="addit-preview-size"></img>';
        szHTML = szHTML + '</div>';
        szHTML = szHTML + '<div class="addit-box-type3">';
        szHTML = szHTML + '<label class="addit-grid-8">결과 문구</label>';
        szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" type="text" id="' + sztmpRtextID  + String(tmpRpagenum) +'" placeholder="결과 문구를 입력해주세요">';
        szHTML = szHTML + '</div>';
        szHTML = szHTML + '<div class="addit-box-type3">';
        szHTML = szHTML + '<label class="addit-grid-8">결과 점수</label>';
        szHTML = szHTML + '<input class="addit-grid-5 addit-input-type1" oninput="maxLengthCheck(this)" maxlength="3" type="number" id="' + sztmpRscoreID  + String(tmpRpagenum) +'" placeholder="결과 점수를 입력해주세요">';
        szHTML = szHTML + '</div>';
        szHTML = szHTML + '</div>';
        szHTML = szHTML + '</div>';
        

        rPage_Array.push(tmpRpagenum);
        if (rPage_Array.length === 0)
            $(pTarget).html(szHTML);
        else    
            $(pTarget).append(szHTML);
    }
    console.log(rPage_Array);
}

// ox퀴즈 결과페이지
function drawoxresult_Data(pJSON, e_score, scoreCount){
    try {
        $.each(pJSON, function (key, Items) {
            if (key == "tabledata") {
                var tmpData = JSON.parse(JSON.stringify(Items));
               
                $.each(tmpData, function (key1, Items1) {
                    var szTemp = Items1.e_data;
                    szTemp = szTemp.replaceAll('\\', '');
                    szTemp = szTemp.replaceAll('`', '');
                    szTemp = szTemp.replaceAll('\'', ''); 
                    var parseJSON = JSON.parse(szTemp);
                    // agree 뿌리기
                    const coId = Items1.e_idx;
                    let quizCount = "";
                    //agree 외에 것 뿌리기
                    $.each(parseJSON, function (key2, sItems2) {                      
                        switch (key2){
                            case "baseinfo" :
                                var customerName = "";
                                if(sItems2["customer_name"] === "undefined"){
                                    customerName = "";
                                }else{
                                    customerName = sItems2["customer_name"];
                                }
                                                            
                                // 메타태그 정보를 설정한다.
                                var tmpTagName = 'meta[name="apple-mobile-web-app-title"]';
                                setMetaTag(tmpTagName, sItems2[baseinfo_event_title]);
                                
                                tmpTagName = 'meta[property="og:title"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_event_title]));
                                tmpTagName = 'meta[property="og:site-name"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_event_title]));
                                tmpTagName = 'meta[property="og:description"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_event_description]));
                                tmpTagName = 'meta[property="og:image"]';
                                setMetaTag(tmpTagName, DecodingUC(sItems2[baseinfo_mainimage]));
                                tmpTagName = 'meta[property="og:url"]';
                                setMetaTag(tmpTagName, DecodingUC(location.href));
                                

                                // SNS 공유 출력 TODO:
                                let snsshareDiv = $("#snsShareDiv"); 
                                let snsIcon = $("#snsShare");
                                var bsnsShare = false;
                                // snsShareDiv SNS 공유 제목
                                // TODO : 기존에는 window.open으로 500, 500 크기르 출력한다. 
                                $('#snsShare_header').text('SNS 공유하기');
                                var szTemp = sItems2.sns_share[baseinfo_sns_share_kakao];
                                let shareHTML = "";
                                if (szTemp == "1") // 값이 비어잇지 않으면
                                {
                                    // 카카오 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/kakao.png" alt="카카오이미지" onclick="kakao();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);       
                                }
                                szTemp = sItems2.sns_share[baseinfo_sns_share_facebook];
                                if (szTemp == "1")
                                {
                                    // 페이스북 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/facebook.png" alt="페이스북이미지" onclick="facebook();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);
                                }
                                szTemp = sItems2.sns_share[baseinfo_sns_share_blog];
                                if (szTemp == "1")
                                {
                                    // 블로그 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/blog.png" alt="블로그이미지" onclick="blog();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);
                                }
                                szTemp = sItems2.sns_share[baseinfo_sns_share_band];
                                if (szTemp == "1")
                                {
                                    // 밴드 아이콘 출력 및 URL 출력
                                    shareHTML += '<span class="addit-icon-type-1"><img class="addit-img-width-1" src="img/band.png" alt="밴드이미지" onclick="band();"></span>';
                                    bsnsShare = true;
                                    // snsIcon.html(shareHTML);
                                }
                                snsIcon.append(shareHTML);
                                if (!bsnsShare){
                                    snsshareDiv.css('display', 'none');
                                }
                                // SNS 친구 출력
                                var bsnsFiend = false;
                                var kakao = "";
                                var facebook = "";
                                var bolg = "";
                                var band = "";
                                var insta = "";
                                var youtube = "";
                                var twiter = "";

                                // SNS 친구 추가 제목
                                // TODO : 친구 맺기의 경우 기존 소스에는 테이블을 업데이트 한 다음 페이지로 이동한다.
                                // $sql = mq("update lending set user_count = user_count +1 where user_table ='$user_table'");
                                $('#event_join_text').html(customerName + 'SNS를 팔로우하면<br>이벤트 당첨 확률은 UP! UP!!');
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_kakao]);
                                if (szTemp !== "")
                                {
                                    // 카카오 아이콘 출력 및 URL 출력
                                    kakao = '<a href="' + DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_kakao]) + '" target="_blank"><img src="img/kakao.png" alt="카카오아이콘">' + customerName + ' 카카오</a>';
                                    bsnsFiend = true;   

                                }else{
                                    $("#kakao_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_facebook]);
                                if (szTemp !== "")
                                {
                                    // 페이스북 아이콘 출력 및 URL 출력
                                    facebook = '<a href="' + DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_facebook]) + '" target="_blank"><img src="img/facebook.png" alt="페이스북아이콘">' + customerName + ' 페이스북</a>';
                                    bsnsFiend = true;
                                }else{
                                    $("#facebook_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_blog]);
                                if (szTemp !== "")
                                {
                                    // 블로그 아이콘 출력 및 URL 출력
                                    bolg = '<a href="' + DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_blog]) + '" target="_blank"><img src="img/blog.png" alt="블로그아이콘">' + customerName + ' 블로그</a>';
                                    bsnsFiend = true;              
                                }else{
                                    $("#blog_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_band]);
                                if (szTemp !== "")
                                {
                                    // 밴드 아이콘 출력 및 URL 출력
                                    band = '<a href="' + DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_band]) + '" target="_blank"><img src="img/band.png" alt="밴드아이콘">' + customerName + ' 밴드</a>';
                                    bsnsFiend = true;              
                                }else{
                                    $("#band_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_instagram]);
                                if (szTemp !== "")
                                {
                                    // 인스타그램 아이콘 출력 및 URL 출력
                                    insta = '<a href="' + DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_instagram]) + '" target="_blank"><img src="img/instar.png" alt="인스타아이콘">' + customerName + ' 인스타</a>';
                                    bsnsFiend = true;
                                }else{
                                    $("#insta_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_youtube]);
                                if (szTemp !== "")
                                {
                                    // 유튜브 아이콘 출력 및 URL 출력
                                    youtube = '<a href="' + DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_youtube]) + '" target="_blank"><img src="img/youtube.png" alt="유튜브아이콘">' + customerName + ' 유튜브</a>';
                                    bsnsFiend = true;
                                }else{
                                    $("#youtube_event").css('display','none');
                                }
                                var szTemp = DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_twiter]);
                                if (szTemp !== "")
                                {
                                    // 트위터 아이콘 출력 및 URL 출력
                                    twiter = '<a href="' + DecodingUC(sItems2.sns_friend[baseinfo_sns_friend_twiter]) + '" target="_blank"><img src="img/youtube.png" alt="유튜브아이콘">' + customerName + ' 유튜브</a>';
                                    bsnsFiend = true;
                                }else{
                                    $("#twiter_event").css('display','none');
                                }
                                if (!bsnsFiend){
                                    $("#event_join_popup").css('display', 'none');
                                }
                                $("#kakao_event").html(kakao);
                                $("#facebook_event").html(facebook);
                                $("#blog_event").html(bolg);
                                $("#band_event").html(band);
                                $("#insta_event").html(insta);
                                $("#youtube_event").html(youtube);
                                $("#twiter_event").html(twiter);
                                
                                break;
                            case "quize" :
                                var nQizeCnt = sItems2.length; 
                                quizCount = nQizeCnt;                             
                                break;
                            case "resultPage":
                                var link_div = $("#div_customer_link_btn");
                                var scoreView_div = $("#LevScore");
                                var scorechk_div = $("#div_answer_chk");
                                var mentView_div = $("#ox_score_ment");
                                var imgtView_div = $(".addit-oxresultwrap");
                                $.each(sItems2, function (key3, sItems3){
                                    switch (key3){
                                        case "customerLinkPage" :
                                            var szHTML = '<a href="' + sItems3.linke + '" target="_blank">' + sItems3.title + '</a>'
                                            oxQuizeUrl = sItems3.linke;
                                            link_div.html(szHTML);
                                        break;
                                        case "rPage" :
                                            var rPageLength = sItems3.length
                                            for(var i = 0; i < rPageLength; i++){
                                                if(sItems3[i].result_score == e_score){
                                                    scoreView_div.text(e_score);
                                                    scorechk_div.html(`${quizCount}개 문항중 <span id="leva">${scoreCount}</span>개 맞추셨네요.<br>`);
                                                    mentView_div.text(DecodingUC(sItems3[i].result_text))
                                                    var tmpImsgSrc = "file/" + coId + "/" + sItems3[i].ox_result_img;
                                                    // var szTmpHTML = '<img src="' + tmpImsgSrc + '" alt="결과이미지">'
                                                    imgtView_div.css({'background':'url(' + tmpImsgSrc + ')','background-repeat':'no-repeat','background-size':'contain'})
                                                }
                                            }
                                        break;
                                    default:
                                        break;
                                    }
                                });      
                                break;
                            default:
                                break;
                        }
                    });
                });
            }
        });
    } catch (e) {
    }

}