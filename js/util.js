/* 
Date : 2023.01.08
Desc : 유틸리티 함수 정의
Copyright : GreenPot Co., Ltd.
*/

function getNameFromPath(strFilepath) {
    var objRE = new RegExp(/([^\/\\]+)$/);
    var strName = objRE.exec(strFilepath);
    if (strName == null) {
        return null;
    }
    else {
        return strName[0];
    }
}

// 새창을 출력
function OpenWindow(pURL, pTitle, nWidth, nHeight)
{
    var popupX = (document.body.offsetWidth / 2) - (nWidth / 2);
    var popupY= (window.screen.height - nHeight) / 2;
    nHeight = nHeight-100;
    window.open(pURL, pTitle, 'scrollbars=1, status=no, height=' + nHeight + ', width=' + nWidth +', left='+ popupX + ', top='+ popupY);
}

// 디버깅 메시지 출력
function ShowDebug(Messagse, Debug){
    if (Debug){
        alert(Messagse);
    }
}

// 페이지 이동
// url : http를 포함한 url : http://www.additcorp.com , param : param1=aaa&param2=bb
function goToPage(url, param, param2){
    if (isEmpty(param)){
        location.href=url;    
    } else if((!isEmpty(param)) && (isEmpty(param2))) {
        location.href=url + "?" + param;    
    } else if((!isEmpty(param)) && (!isEmpty(param2))){
        location.href=url + "?" + param + "&" + param2; 
    }
}
// ox퀴즈 결과 페이지 이동
// url : http를 포함한 url : http://www.additcorp.com , param : param1=aaa&param2=bb
function goToResultPage(url, param, score, count){
    if (isEmpty(param)){
        location.href=url;    
    } else {
        location.href=url + "?" + param + "&" + score + "&" + count;    
    }
}

// 이메일 유효성 체크
function ValidateEmail(InputData) 
{
    var emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if(emailRule.test(InputData)) {    
        return true;
    }
    else{
        return false; 
    }
}

// 숫자 입력 체크 (정규식으로 처리)
function ValidateNumber(InputData) {
    var Number = /^\d{10}$/;
    if (InputData.match(Number)) {
        return true;
    } else {
        return false;
    }
}

// pData가 숫자일 경우 true 리턴 (pBase가 주어질 경우 비교해 결과를 리턴)
// pCase : + (양수 체크), - (음수체크)
// pBase : 기준값
// fn_isNumeric(10, +, 11) => 11보다 작으므로 false
// fn_isNumeric(10, +) => 양수이므로 true
function fn_isNumeric(pData, pCase, pBase = 0){
    var rtnValue = false;

    // 숫자인지 체크
    if ($.isNumeric(pData))
    {
        var tmp = parseInt(pData);
        switch (pCase){
            case "+" : 
                if (pBase != 0){
                    if (tmp >= pBase)
                        rtnValue = true;
                }else{
                    if (tmp > 0)
                        rtnValue = true;
                }
                break;
            case "-" :
                if (pBase != 0){
                    if (tmp <= pBase)
                        rtnValue = true;
                }else{
                    if (tmp < 0)
                        rtnValue = true;
                }
                break;
            default :
                if (tmp >= pBase)
                    rtnValue = true;
                break;
        }
    }
    return rtnValue;
}

// 아이디 유효성 검증
// 자리수 : 4~15자리 (영어 대소문자 + 숫자만 )
function ValidateID(InputData) {
    var RegID = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/;
    if (InputData.match(RegID)) {
        return true;
    } else {
        return false;
    }
}
// 비밀번호 정규식 체크
// 8자리~20자리, 특수문자+대소문자+숫자 반드시 포함
function ValidatePassword(InputData){
    var passwordRule = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    if (InputData.match(passwordRule)) {
        return true;
    } else {
        return false;
    }
}

// 한글 입력 방지 (크롬일 경우)
function fncRplc(obj)
{
    var patt = /[\ㄱ-ㅎ가-힣]/g;
    obj.value = obj.value.replace(patt, '');
}

// 숫자 및 소수점만 입력되도록
function numberWithPoint(object) {
    var x;
    x = object.value;
    x = x.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
    x = x.replace(/,/g,'');          // ,값 공백처리
    $(object).val(x.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 정규식을 이용해서 3자리 마다 , 추가 
}

// GET 방식으로 전달된 파라미터를 배열로 리턴
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

// 현재 페이지 가져오기
function getPageName(){
    var pageName = "";
    var tempPageName = window.location.href;
    var strPageName = tempPageName.split("/");
    pageName = strPageName[strPageName.length-1].split("?")[0];
 
    return pageName;
}

// 쿠키 설정
function setCookie(cookieName, value, exdays){
    var exdate = new Date();
    if (exdays == ""){
        exdate.setDate(exdate.getDate() + exdays);
        var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    }
    else{
        exdate.setDate(exdate.getDate() + exdays);
        var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    }
    // TODO : JWT 적용 시 변경해야 한다. (쿠키가 노출될 수 있으므로)
    document.cookie = cookieName + "=" + cookieValue + ";"
    //document.cookie = cookieName + "=" + cookieValue + "; httpOnly";
        // SSL에서만 요청할 경우
        //document.cookie = cookieName + "=" + cookieValue + "; httpOnly; Secure";
}

// 쿠키 삭제
function deleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

// 쿠키 불러오기
function getCookie(cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if(start != -1){
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}

// 도메인명을 제외한 서버 경로를 리턴한다. (http://wwww.xxxx.com/path)
function getServerPath(url){
    var arSplitUrl = url.split("/"); // "/" 로 전체 url 을 나눈다
    var szFullPath = "";
    var nArLength = arSplitUrl.length;
    for (var i = 3; i < nArLength; i++) {
        if (szFullPath == "")
            szFullPath = '/' + arSplitUrl[i]
        else
            szFullPath = szFullPath + '/' + arSplitUrl[i];
    }
    return szFullPath;
}

// 모바일일 경우 Body의 95% 크기로 반환
// PC의 경우 지정된 크기로 반환
// 미리 보기일 경우 50%로 줄인다. (flag true)
function ResizeImage(orgwidth, orgheight, flag) {
    var width = orgwidth;
    var height = orgheight;
    var viewWidth = 0, viewHeight = 0;
    var mRaito = 0.9;
    if (flag){
        mRaito = 0.5;
    }
    var resizeWidth, resizeHeight; 

    resizeWidth = width; 
    resizeHeight = height;
    if (window.matchMedia("(max-width: 465px)").matches) {
        viewWidth = document.body.offsetWidth; // 기준 넓이 
        viewHeight = parseInt(document.body.offsetHeight * 0.7); // 기존 높이
        if ((width < viewWidth) && (height < viewHeight)){
            resizeWidth = parseInt(width * mRaito);
            resizeHeight = parseInt(height * mRaito);
        }
        else if (width > viewWidth ){
            resizeWidth = parseInt(viewWidth * mRaito);
            resizeHeight = parseInt(((viewWidth * height) / width) * mRaito);
        }
        else if(height > viewHeight)
        {
            resizeWidth = parseInt(((viewHeight * width) / height) * mRaito);
            resizeHeight = parseInt(viewHeight * mRaito);
        }
    }
    else{   // 가로세로 비율
        viewWidth = document.body.offsetWidth; // 기준 넓이 
        viewHeight = parseInt(document.body.offsetHeight * 0.7); // 기존 높이
        if ((width < viewWidth) && (height < viewHeight)) {
            resizeWidth = parseInt(width * mRaito);
            resizeHeight = parseInt(height * mRaito);
        } else if (width > viewWidth) {
            resizeWidth = parseInt(viewWidth * mRaito);
            resizeHeight = parseInt(((viewWidth * height) / width) * mRaito);
        } else if (height > viewHeight) {
            resizeWidth = parseInt(((viewHeight * width) / height) * mRaito);
        resizeHeight = parseInt(viewHeight * mRaito);
        }
    }
    return [resizeWidth, resizeHeight];
}

// Syncronize blocking 
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

// URL이미지를 base64로 변경
function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function IsBase64Valid(data)
{
    if ((typeof (data) != "undefined") && (data != null)) {
        if (data.indexOf('base64') != -1)
            return true;
        else
            return false;
    }
    return false;
}

function IsBase64Valid__(param) {
    var base64Rejex = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
    var isBase64Valid = base64Rejex.test(param); // base64Data is the base64 string
    return isBase64Valid;
}

// 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다. 
function isEmpty(value){
    if( value == "" || value == "undefined" || value == null || value == 'null' || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
        return true
    }else{
        return false
    }
}

function isEmptyMsg(value, pMsg){
    if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
        alert(pMsg);
        return true
    }else{
        return false
    }
}

// value : 값, pMsg : 출력메시지, pID : 포커를 보낼 TagID, pType : 0 이면 아이디, 1 이면 객체 자체
function isEmptyToFocus(value, pMsg, pID, pType = 0){
    if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
        alert(pMsg);
        if (pType == 0)
          $(pID).focus();
        else  
          pID.focus();
        return true
    }else{
        return false
    }
}

// 문자열이 포함되어 있으면 
function getMatchtring(pString, pWord){
  var bMatch = false;
  if(isEmpty(pString)){
    return bMatch
  }else{
    if (pString.match(pWord))
    bMatch = true;
  return bMatch;
  }

}

// 데이터의 공백을 삭제한다.
function TrimData(param){
    return $.trim($(param).val());
}

// URIEcoding을 한다.
function TrimDataEncoding(param){
    var sztemp = $.trim($(param).val());
    sztemp = encodeURIComponent(sztemp);
    return sztemp;
}

// URIDecoding을 한다.
function DecodingUC(param){
    var sztemp  = decodeURIComponent(param);
    return sztemp;
}

// php에서 rawurlencode 함수 구현
function rawurlencode(str) {
    str = (str + '').toString();
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}


// 로그인+ 비밀번호 스페이스 바 방지 
function noSpaceForm(obj) {
    var str_space = /\s/;  
    if(str_space.exec(obj.value)) { 
        obj.focus();
        obj.value = obj.value.replace(/\s| /gi,''); // 공백제거
        return false;
    }
}

/*
이벤트 사이의 간격 체크
var last, diff;
$("div").click(function (event) {
    if (last) {
        diff = event.timeStamp - last;
        $("div").append("time since last event: " + diff + "<br>");
    } else {
        $("div").append("Click again.<br>");
    }
    last = event.timeStamp;
});
*/

// 문자열의 주어진 숫자부터의 길이를 구한다.
function get_string_length(pString, pStartNum, pLength){
    if (!isEmpty(pString))
        return pString.substr(pStartNum, pLength);
}

// input type이 number일 경우 최대 글자수 지정 oninput 이벤트에 처리
function maxLengthCheck(object){
    if (object.value.length > object.maxLength){
      object.value = object.value.slice(0, object.maxLength);
    }    
}

// string에 #을 앞에, pAddString을 뒤에 붙여 리턴한다.
function rtnIDString(pString, pAddString = ""){
    var sztemp = "";
    sztemp = "#" + pString + pAddString;
    return sztemp;
}

// 날짜를 비교 후 시작 날짜가 종료 날짜보다 클 경우 False를 리턴
//  pStart : 시작 날짜 Datapicker ID
//  eEnd : 종료 날짜 Datapicker ID
function compareDate(pStart, pEnd){
    var rtnValue = true;
    var date1 = new Date($(pStart).datepicker("getDate"));
    var date2 = new Date($(pEnd).datepicker("getDate"));
    if (date2 - date1 < 0){
        rtnValue = false;
    }
    return rtnValue;
}
/***********************************************************************************
 * 파일 업로드 관련 체크 함수
 /**********************************************************************************/
// 허용 파일 확장자 체크
function isAllowFileExt(pFileName){
    var allwowExt = ['jpg','jpeg','gif','png'];
    if(pFileName != "" ){
        var ext = pFileName.split('.').pop().toLowerCase(); //확장자분리
        //아래 확장자가 있는지 체크
        if($.inArray(ext, allwowExt) == -1) {
          return false;
        }
    }
    return true
}
// 최대 업로드 용량 체크, oSize가 nSize보다 클 경우 False 리턴
function  isUploadMaxSize(oSize, nSize){
    var maxSize = nSize * 1024 * 1024; // nSzie : MB
    if(oSize > maxSize){
        alert("첨부파일 사이즈는 " + nSize + "MB 이내로 등록 가능합니다.");
        return false;
    }
    return true;
}

// 업로드 불가 문자가 포함된 파일명 체크
function uploadFile(pFileName) {
    var pattern =  /[\{\}\/?,;:|*~`!^\+<>@\#$%&\\\=\'\"]/gi;
    var fileName = pFileName.split('\\').pop().toLowerCase();
    if(pattern.test(fileName) ){
        alert('파일명에 특수문자가 포함되어 있습니다.\n등록할 수 없습니다.');
        return false;
    }
    return true;
}

function getFileNameExceptPath(filename){
    var rtnvalue = filename.split("\\").pop();
    return rtnvalue;
}

/**
 * 파일명에서 확장자명 추출
 * @param filename   파일명
 * @returns _fileExt 확장자명
 */
function getExtensionOfFilename(filename) {
    var _fileLen = filename.length;
    /** 
     * lastIndexOf('.') 
     * 뒤에서부터 '.'의 위치를 찾기위한 함수
     * 검색 문자의 위치를 반환한다.
     * 파일 이름에 '.'이 포함되는 경우가 있기 때문에 lastIndexOf() 사용
     */
    var _lastDot = filename.lastIndexOf('.');
    var _fileExt = filename.substring(_lastDot+1, _fileLen);
    return _fileExt;
}

// 확장자 제외한 파일명 추출 (url에서 확장자명을 제외한 파일명까지 추출)
function getOfwithurlFilename(filename) {
    var _fileLen = filename.length;
    /** 
     * lastIndexOf('.') 
     * 뒤에서부터 '.'의 위치를 찾기위한 함수
     * 검색 문자의 위치를 반환한다.
     * 파일 이름에 '.'이 포함되는 경우가 있기 때문에 lastIndexOf() 사용
     */
    var _lastDot = filename.lastIndexOf('.');
    var _fileExt = filename.substring(0, _lastDot);
    return _fileExt;
}

// url에서 확장자 제외, url제외 파일명만 추출하기
function getOfFileName(filename){
    var arSplitUrl = filename.split("/"); //   "/" 로 전체 url 을 나눈다
    var nArLength = arSplitUrl.length;
    var arFileName = arSplitUrl[nArLength - 1]; // 나누어진 배열의 맨 끝이 파일명이다
    var arSplitFileName = arFileName.split("."); // 파일명을 다시 "." 로 나누면 파일이름과 확장자로 나뉜다
    sFileName = arSplitFileName[0]; // 파일이름
    return sFileName;
    //var sFileExtension = arSplitFileName[1] // 확장자
}

// url에서 경로를 제외한 파일명만 추출하기
function getOfFileNameFromUrl(filename) {
    if (!isEmpty(filename)){
      var arSplitUrl = filename.split("/"); //   "/" 로 전체 url 을 나눈다
      var nArLength = arSplitUrl.length;
      var arFileName = arSplitUrl[nArLength - 1]; // 나누어진 배열의 맨 끝이 파일명이다
  /*    
      var arSplitFileName = arFileName.split("."); // 파일명을 다시 "." 로 나누면 파일이름과 확장자로 나뉜다
      var sFileExtension = arSplitFileName[1]; // 확장자
      sFileName = arSplitFileName[0] + '.' + sFileExtension; // 파일명
  */    
      return arFileName;
    }
    else{
      return "";
    }
}

// 엘리먼트 속성 관련
// selectbox를 pData값으로 선택한다. 
// pData : selectbox의 option value 또는 Text
// pType : 0 이면 value, 1이면 Text
function selected_selectbox(pTarget, pData, pOption=0){
    if (pOption === 0)
    {
        $(pTarget).val(pData).prop("selected", true);
        $(pTarget).prop("disabled", false);
    }
    else{
    }
}

// pTarget의 값을 pData로 설정한다.
// pData가 공백일 경우 false를 리턴한다.
function setElementValue(pTarget, pData){
    $(pTarget).val(pData);
    if (isEmpty(pData)){
        return false;
    }
    return true;
}

// pTarget의 속성값(pProp)를 pValue로 설정한다.
function setElementProp(pTarget, pProp, pValue=0){
    if (pValue == 0)
        $(pTarget).prop(pProp, false);
    else if (pValue == 1)
        $(pTarget).prop(pProp, true);
    else
        $(pTarget).prop(pProp, pValue);
}

// pTarget의 속성값(pProp)를 pValue로 설정한다.
function setElementCSS(pTarget, pProp, pValue=0){
    $(pTarget).css(pProp, pValue);
}

// checkbox 값이 설정되어있을 경우 값 리턴
// pTarget의 속성값(pProp)를 pValue로 설정한다.
function getElementCheckValue(pTarget){
    var rtnValue = "0";
    if ($(pTarget).is(':checked'))
        rtnValue = "1";
    return rtnValue;
}

// 문자열의 공백을 모두 제거한 뒤 비교한 결과 값을 리턴
// 같을 경우 1을 리턴
function compareText(pStr1, pStr2){
    szRtnValue = "";
    pStr1 = pStr1.replace(/\s/gi, "")
    pStr2 = pStr2.replace(/\s/gi, "")
    if (pStr1 === pStr2)
        szRtnValue = "1";
    return szRtnValue;
}

// 현재시간 타임스탬프를 구해 Text로 리턴
function getTimeStamp(){
    //var timeStamp = new Date().getTime();
    // 세컨드까지만
    var timestampSecond = Math.floor(+ new Date() / 1000);
    return String(timestampSecond);
}

//현재 시간 + 파일명 함수
function getNewDateFileName(fileName){
    szRtnDate = "";
    let date = new Date();

    var yy = date.getFullYear();
    var mm = date.getMonth()+1;
    var dd = date.getDate();
    var hh = date.getHours();
    var mn = date.getMinutes();
    var sc = date.getSeconds();

    szRtnDate = szRtnDate = String(yy)+String(mm)+String(dd)+String(hh)+String(mn)+String(sc)+String(fileName);
    return szRtnDate;

}

//현재 시간 함수
function getNewDate(){
    szRtnDate = "";
    let date = new Date();

    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    szRtnDate = szRtnDate = `${yy}-${mm >= 10 ? mm : '0' + mm}-${dd >= 10 ? dd : '0' + dd}`;
    return szRtnDate;

}

// 배열내에서 특정 값을 삭제
function DeleteArray(pVal, pArray){
    var rtnValue = false;
    for(var i = 0; i < pArray.length; i++) {
        if(pArray[i] === pVal)  {
            pArray.splice(i, 1);
            i--;
            rtnValue = true;
            break;
        }
    }
    return rtnValue;
}

// 특수문자 입력 불가
function chkChar(obj){
    //var RegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;	//정규식 구문
    var RegExp = /[\{\}\[\]\/;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;	//정규식 구문
    if (RegExp.test(obj.value)) {
      // 특수문자 모두 제거    
      alert('입력 불가능한 문자가 포함되어 있습니다.');
      obj.value = obj.value.replace(RegExp , '');
    }
}

// desc : 주어진 숫자값내에서 랜덤 숫자를 생성
// pCount : 생성할 숫자 개수, pNum : 주어진 숫자값
function generateRandom(pCount, pNUm){
  // undefined로 채워진 배열을 생성
  let randomIndexArray = [];
  for (i=0; i<pCount; i++) {
    randomNum = Math.floor(Math.random() * pNUm);
    if (randomIndexArray.length == 0)
      randomIndexArray.push(randomNum);
    else{
      var bExists = false;
      for (var j=0; j<randomIndexArray.length; j++)
      {
        if (randomIndexArray[j] == randomNum){
          bExists = true;
          break;
        }
      }
      if (!bExists){
        randomIndexArray.push(randomNum);
      }
      else
        i = i-1;
    }
  }
  return randomIndexArray;
}

// 랜덤추첨 정답 값 작성시 정답만 추출
function randomAnswer(pAnswer, pData, pLength){
  // undefined로 채워진 배열을 생성
  let randomIndexAnswerArray = [];
  for (i=0; i<pLength; i++) {
    if(pData[i].user_result.indexOf(pAnswer) != -1){
        randomIndexAnswerArray.push(pData[i])
    }
  }
  return randomIndexAnswerArray;
}

// desc : pColor에 대한 보색값을 리턴
//  pColor : color 헥사 코드 
function getComplementaryColor(pColor){
  const colorPart = pColor.slice(1);
  const ind = parseInt(colorPart, 16);
  let iter = ((1 << 4 * colorPart.length) - 1 - ind).toString(16);
  while (iter.length < colorPart.length) {
     iter = '0' + iter;
  };
  return '#' + iter;
};

//팝업창 드래그 함수


// 메타태그 변경 스크립트
function cmaMetaTagsChange(url,stitle,scontent,simg){
/*    
    $("#meta_image_src").attr("href", simg); // 트위터 카드를 사용하는 URL이다.
    // 트위터 관련 메타태그
    $("#meta_twitter_url").attr("content", url); // 트위터 카드를 사용하는 URL이다.
    $("#meta_twitter_title").attr("content", stitle+" [chongmoa.com]"); // 트위터 카드에 나타날 제목
    $("#meta_twitter_description").attr("content", scontent); // 트위터 카드에 나타날 요약 설명
    $("#meta_twitter_image").attr("content", simg); // 트위터 카드에 보여줄 이미지
*/

    // 페이스북 관련 메타태그
    $("#meta_og_title").attr("content", stitle); //    제목표시
    $("#meta_og_image").attr("content", simg); //    이미지경로 w:90px , h:60px(이미지를 여러 개 지정할 수 있음)
    $("#meta_og_site_name").attr("content", stitle+" [chongmoa.com]"); //    사이트 이름
    $("#meta_og_url").attr("content", url); //    표시하고싶은URL
    $("#meta_og_description").attr("content", scontent); //    본문내용
/*  
    // 네이트온 관련 메타태그
    $("#meta_nate_title").attr("content", stitle); //    제목표시
    $("#meta_nate_description").attr("content", scontent); //    본문내용
    $("#meta_nate_site_name").attr("content", stitle+" [chongmoa.com]"); //    사이트 이름
    $("#meta_nate_url").attr("content",url); //    표시하고싶은URL
    $("#meta_nate_image").attr("content", simg); //    이미지경로
*/
    // 카카오관련 메타태그
    $('meta[property="og:title"]').attr("content", stitle); //    제목표시
    $('meta[property="og:description"]').attr("content", scontent); //    본문내용
    $('meta[property="og:image"]').attr("content", simg); //    이미지경로
    $('meta[property="og:url"]').attr("content", url); //    이미지경로
}

// 로딩바 스크립트 보이기
function loadingView(){
    var szHTML = ' <div class="loading-container" id="loding_container"><div class="loading"></div><div class="loading-text" id="loading_text">loading</div></div>';

    $('body').append(szHTML);
    $("#loding_container").show();
}

//로딩바 안보이기
function loadingClose(){
    $("#loding_container").hide();
}

// 유튜브 불러오는 함수
function youtubeView(pTargetId, pTarget){
    // let youtube = document.querySelectorAll( ".addit-youtube-test" );
              
    let source = "https://img.youtube.com/vi/"+ pTargetId +"/sddefault.jpg";
    let image = new Image();
    image.src = source;
    image.alt = 'youtube thumbnail'
    image.addEventListener( "load", function() {
        youtube.appendChild( image );
    });

    youtube.addEventListener( "click", function() {

        let iframe = document.createElement( "iframe" );
        iframe.setAttribute( "frameborder", "0" );
        iframe.setAttribute( "allowfullscreen", "" );
        iframe.setAttribute( "src", "https://www.youtube.com/embed/"+ pTargetId +"?rel=0&autoplay=1" );

        pTarget.innerHTML = "";
        pTarget.appendChild( iframe );
    });    
}

// 오늘날짜 구하는 방법
function getTodayDate(){
    var date = new Date();
    return date.getFullYear() + ("0" + (date.getMonth()+1)).slice(-2) + ("0" + date.getDate()).slice(-2);
}

// sns로그인 관련 함수
function loginWithKakao() {
    // 카카오 SDK 초기화
    if (!Kakao.isInitialized()) {
        Kakao.init('1999f1e12378237fc4cb44334c9d3404');
      }
    // Kakao.init('1999f1e12378237fc4cb44334c9d3404'); // 여기서 YOUR_APP_KEY는 카카오 디벨로퍼에서 발급받은 앱 키를 넣어야 합니다.

    // 카카오 로그인 창 호출
    Kakao.Auth.login({
        success: function(authObj) {
            Kakao.API.request({
                url: '/v2/user/me',
                success: function(response) {
                    let kakaoEmail = new Object();
                    var email = response.kakao_account.email;
                    kakaoEmail.cmd = 'update_email'
                    kakaoEmail.e_email = email
                    // 이메일 값을 서버로 전달하여 데이터베이스에 저장하는 로직을 작성합니다.
                    var msg = saveEmailToDatabase(kakaoEmail, true);
                    alert(msg)
                },
                fail: function(error) {
                    console.log(error);
                    alert(error);
                }
            });
        },
        fail: function(error) {
            // 로그인 실패 시 처리할 로직을 여기에 작성합니다.
            alert(error);
            console.log(error);
        }
    });
}

