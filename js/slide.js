//ox 퀴즈 슬라이드 js
var swiper = new Swiper('.swiper-container', {
    touchRatio: 0,
    slidesPerView: "auto",
    allowTouchMove: false,
    resistance: false,
    speed: 1000,
    autoHeight: true, 
    // parallax: true,
    pagination: {
        el: ".swiper-pagination",
        type: "fraction",
        //type: "progressbar",
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    // observer: true,
// observeParents: true,
});



var QuizThis = $(this).addClass('active');
setTimeout(function () {
    $('.swiper-wrapper').css({
        'pointer-events': 'auto'
    });
}, 1500);




