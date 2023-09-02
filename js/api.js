// AJAX JS
let gloabl_error_message = "";

// parameter 형태로 전송 후 결과를 리턴한다.
// pKey에 해당되는 키를 찾으면 해당 값을 리턴한다 ('tabledata')
//  return : JSON
function load_data(pParams){
    var rtnJSON = {};
    $("#loding_container").css('display','block');
    if (pParams)
    {
        try{    
            $.ajax({
                type: "POST",
                url: "js/server_api.php",
                dataType: 'json',
                async: false,
                data: pParams,
                success: function (result) {
                    if (result != null) {
                        try {
                            rtnJSON = JSON.parse(JSON.stringify(result));
                            $.each(rtnJSON, function(key, value){
                              if (value == "error"){
                                alert(rtnJSON.desc);
                                $('#btn_logout').trigger('click');
                                rtnJSON = "";
                                return; 
                              }
                            });
                        } catch (e) {
                            gloabl_error_message = "load_data(parser) : " + e.message;
                        }

                    } else {
                        gloabl_error_message = '오류(load_data) : result null';
                        return;
                    }
                },
                beforeSend: function() {
                    $("#loding_container").css('display','block');
                },
                complete: function () {
                    $("#loding_container").css('display','none');
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    gloabl_error_message = "오류(load_data : ajax): " + xhr.status + "\n" + thrownError;
                     $("#loding_container").css('display','none');
                   
                }
            });
        } catch(e) {
            gloabl_error_message = e.message;    
        }
    }
    return rtnJSON;
}

// formdata 형태로 전송 후 결과를 리턴한다.
//  return : string
function send_formdata(pParams, pAsync=false, purl="js/server_api.php"){
    szRtnValue = "";
    try{
        $.ajax({
            type: "POST",
            url: purl,
            dataType: 'json',
            async: pAsync,
            data: pParams,
            enctype: "multipart/form-data", //form data 설정,
            processData: false, //프로세스 데이터 설정 : false 값을 해야 form data로 인식합니다
            contentType: false, //헤더의 Content-Type을 설정 : false 값을 해야 form data로 인식합니다
            success: function (result) {
                if (result != null) {
                    try {
                        var JsonData = JSON.parse(JSON.stringify(result));
                        var desc = JsonData.desc;
                        if (JsonData.value == 'ok') {
                            szRtnValue = 'success';
                        } else {
                            szRtnValue = desc;
                        }
                    } catch (e) {
                        szRtnValue =  e.message;
                    }
                } else {
                    szRtnValue = '오류 : result null'
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                szRtnValue = "오류(ajax : send_paramdata)\n" + xhr.status + "\n" + thrownError;
            }
        });
    } catch(e) {
        szRtnValue = e.message;    
    }
    return szRtnValue;
}

// parameter 형태로 전송 후 결과를 리턴한다.
//  return : string
//  bRtnMsg가 true 일 경우에 JosnData의 desc 값을 리턴한다.
function send_paramdata(pParams, pAsync=false, bRtnMsg=false){
    szRtnValue = "";
    try{
        $.ajax({
            type: "POST",
            url: "js/server_api.php",
            dataType: 'json',
            async: pAsync,
            data: pParams,
            success: function (result) {
                if (result != null) {
                    try {
                        var JsonData = JSON.parse(JSON.stringify(result));
                        var desc = JsonData.desc;
                        if (JsonData.value == 'ok') {
                            if (bRtnMsg)
                                szRtnValue = $.trim(desc);
                            else
                            szRtnValue = 'success';
                        } else {
                            szRtnValue = "오류\n => " + desc;
                        }
                    } catch (e) {
                        szRtnValue =  e.message;
                    }
                } else {
                    szRtnValue = '오류 : result null'
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                szRtnValue = "오류(ajax : send_paramdata)\n" + xhr.status + "\n" + thrownError;
            }
        });
    } catch(e) {
        szRtnValue = e.message;    
    }
    return szRtnValue;
}

// JSON으로 부터 정보를 추출한다. 
//  pJSON : JSON 객체 (tabledata 내부의 값을 찾는다)
/*
{
    "totcount": "36",
    "nowpage": 1,
    "tabledata": [
        {

        }
    ]
}
*/
//  pSearchKey : 찾을키 이름
//  pSearchData : 비교할 키의 값
//  pRtnKeyName : 리턴할 값의 키 이름
//  => getDataFromJSON(global_customer_list_json, 'cs_idx', '40', 'cs_name');
function getTableDataFromJSON(pJSON, pSearchKey, pSearchKeyData, pRtnKeyName){
    var rtnValue = "";
    try {
        $.each(pJSON, function (key, Items) {
            // tabledata 배열내의 JSON 객체를 검색 후 해당 값을 리턴한다.
            if (key == "tabledata") {
              tblJSON = JSON.parse(JSON.stringify(pJSON.tabledata));
              $.each(tblJSON, function (skey, sItems) {
                // 겁색하기 위한 키를 찾으면
                if (sItems[pSearchKey] === pSearchKeyData)
                    rtnValue = sItems[pRtnKeyName];
                return;
              });
            }
        });
    } catch (e) {
        console.log("getTableDataFromJSON(parser) : " + e.message);
    }
    return rtnValue;
}

// JSON 객체로 부터 키의 값을 비교 후 pRtnKeyName의 값을 리턴한다. 
function getDataFromJSON(pJSON, pSearchKey, pSearchKeyData, pRtnKeyName){
    var rtnValue = "";
    try {
        $.each(pJSON, function (skey, sItems) {
        // 겁색하기 위한 키를 찾으면
        if (sItems[pSearchKey] === pSearchKeyData)
            rtnValue = sItems[pRtnKeyName];
        return;
        });
    } catch (e) {
        console.log("getDataFromJSON(parser) : " + e.message);
    }
    return rtnValue;
}

// JSON 객체로 부터 주어진 키의 값을 리턴한다.
function getKeyDataFromJSON(pJSON, pSearchKey){
    var rtnValue = "";
    try {
        $.each(pJSON, function (skey, sItems) {
            // 겁색하기 위한 키를 찾으면
            if (skey === pSearchKey)
                rtnValue = sItems;
            return;
        });
    } catch (e) {
        console.log("getKeyDataFromJSON(parser) : " + e.message);
    }
    return rtnValue;
}

// 이메일 디비에 업로드
function saveEmailToDatabase(email,  bRtnMsg=false) {
    console.log(email)
    var szRtnValue = ''
    try{
        $.ajax({
            type: "POST",
            url: "js/server_api.php",
            dataType: 'json',
            async: false,
            data: email,
            success: function (result) {
                if (result != null) {
                    try {
                        var JsonData = JSON.parse(JSON.stringify(result));
                        var desc = JsonData.desc;
                        if (JsonData.value == 'ok') {
                            if (bRtnMsg)
                                szRtnValue = $.trim(desc);
                            else
                            szRtnValue = 'success';
                        } else {
                            szRtnValue = "오류\n => " + desc;
                        }
                    } catch (e) {
                        szRtnValue =  e.message;
                    }
                } else {
                    szRtnValue = '오류 : result null'
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                szRtnValue = "오류(ajax : saveEmailToDatabase)\n" + xhr.status + "\n" + thrownError;
            }
        });
    } catch(e) {
        szRtnValue = e.message;    
    }
    return szRtnValue
}
