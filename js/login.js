$(function(){
    $(".addit-banner-phone-img").addClass("active");
 let url =  $(location).attr('href');
if(window.location.href === 'http://additdev.iptime.org:8000/menteimo/index.html'){
    $("#btn_logout").css('display', 'none')
    
}else{
    $("#btn_logout").css('display', 'block')
    $("#btn_login_popup_open").css('display', 'none')

}

console.log(window.location)
})
