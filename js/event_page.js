$(function(){

    // 프라이버시 관련 정보 로드
    $('#privacy').load('privacy.html');    

    //sns 공유 체크여부
    $(".addit-chk-sns-share").prop("disabled", true);
    $("#kakao_share").prop("disabled", true);
    $("#facebook_share").prop("disabled", true);
    $("#blog_share").prop("disabled", true);
    $("#band_share").prop("disabled", true);
    $("#instagram_share").prop("disabled", true);

    $("#sns_share").click(function(){
        if(this.checked){
            $(".addit-chk-sns-share").prop("disabled", false);
        }else{
            $(".addit-chk-sns-share").prop("disabled", true);
        }
    });
    $("#share_kakao_url").click(function(){
        if(this.checked){
            $("#kakao_share").prop("disabled", false);
        }else{
            $("#kakao_share").prop("disabled", true);
        }
    });
    $("#share_facebook_url").click(function(){
        if(this.checked){
            $("#facebook_share").prop("disabled", false);
        }else{
            $("#facebook_share").prop("disabled", true);
        }
    });
    $("#share_blog_url").click(function(){
        if(this.checked){
            $("#blog_share").prop("disabled", false);
        }else{
            $("#blog_share").prop("disabled", true);
        }
    });
    $("#share_band_url").click(function(){
        if(this.checked){
            $("#band_share").prop("disabled", false);
        }else{
            $("#band_share").prop("disabled", true);
        }
    });
    $("#share_instagram_url").click(function(){
        if(this.checked){
            $("#instagram_share").prop("disabled", false);
        }else{
            $("#instagram_share").prop("disabled", true);
        }
    });

    //sns 친구 체크여부
    $(".addit-chk-sns-friend").prop("disabled", true);
    $("#kakao_friend").prop("disabled", true);
    $("#facebook_friend").prop("disabled", true);
    $("#blog_friend").prop("disabled", true);
    $("#band_friend").prop("disabled", true);
    $("#instagram_friend").prop("disabled", true);
    $("#instagram_share").prop("disabled", true);

    $("#sns_friend").click(function(){
        if(this.checked){
            $(".addit-chk-sns-friend").prop("disabled", false);
        }else{
            $(".addit-chk-sns-friend").prop("disabled", true);
        }
    });
    $("#friend_kakao_url").click(function(){
        if(this.checked){
            $("#kakao_friend").prop("disabled", false);
        }else{
            $("#kakao_friend").prop("disabled", true);
        }
    });
    $("#friend_facebook_url").click(function(){
        if(this.checked){
            $("#facebook_friend").prop("disabled", false);
        }else{
            $("#facebook_friend").prop("disabled", true);
        }
    });
    $("#friend_blog_url").click(function(){
        if(this.checked){
            $("#blog_friend").prop("disabled", false);
        }else{
            $("#blog_friend").prop("disabled", true);
        }
    });
    $("#friend_band_url").click(function(){
        if(this.checked){
            $("#band_friend").prop("disabled", false);
        }else{
            $("#band_friend").prop("disabled", true);
        }
    });
    $("#friend_instagram_url").click(function(){
        if(this.checked){
            $("#instagram_friend").prop("disabled", false);
        }else{
            $("#instagram_friend").prop("disabled", true);
        }
    });

    //인증샷 체크여부
    $("#shot_count").prop("disabled", true);
    $("#shot_yesNo").click(function(){
        if(this.checked){
            $("#shot_count").prop("disabled", false);
        }else{
            $("#shot_count").prop("disabled", true);
        }
    });

    
    
    //사전정보 체크여부
    $("#event_prev_info_count").prop("disabled", true);
    $("#event_prev_info").click(function(){
        if(this.checked){
            $("#event_prev_info_count").prop("disabled", false);
        }else{
            $("#event_prev_info_count").prop("disabled", true);
        }
    });


    // 고객사추가 팝업 열기 / 닫기
    $("#btn_customer_popup_open").click(function(){
    $("#customer_popup").fadeIn();
    });
    $("#btn_customer_popup_close").click(function(){
    $("#customer_popup").fadeOut();
    });
});




function load_pre_event(e_idx)
{
    if (!isEmpty(e_idx)){
        var pParms = {};
        pParms.cmd = "load_event";
        pParms.e_idx = e_idx;
        var problemdata = load_event_data(pParms);
        problemdata = problemdata.replaceAll('\\', '');
        problemdata = problemdata.replaceAll('`', '');
        problemdata = problemdata.replaceAll('\'', '');

        $('#btn_event_makes').text("수정하기");
        // 데이터를 읽어서 정해진 HTML 객체에 입력한다.
        eventObj = JSON.parse(problemdata);
        $.each(eventObj, function(key, value) {
            if (key === "baseInfo") {
                szTemp = value.Notice;
                if ($.isArray(szTemp))
                {

                    //유의사항 값 그리기
                    $('#event_info').prop("checked");
                    var count = $('#event_info_count').val();
                    $('#btn_event_info_text').html("");
                    DrawEventInfo(count, '#btn_event_info_text');
                    // 이벤트 유의사항 갯수 객체에 값 할당
                    $('#event_info_count').val(String(szTemp.length));
                    // 확인 이벤트 처리 후 객수에 대한 입력 객체 생성
                    $('#btn_event_info_count').trigger('click');
                    // 입력 객체에 대한 값 할당
                    szTmpID = "#event_info_content_";
                    for (var i=0; i<szTemp.length; i++)
                    {
                        szTargetTmpID = szTmpID + i;
                        $(szTargetTmpID).val(szTemp[i]);
                    }
                }
                else{

                }
            }
        });
    }
    else{
        //유의사항 체크여부
        $("#event_info_count").attr("disabled", true);
    }
}