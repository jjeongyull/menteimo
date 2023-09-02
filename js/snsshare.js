// 메타태그를 세팅한다.
function setMetaTag(pTagName, pValue){
    $(pTagName).prop("content", pValue);
}

function facebook() {
    var url = location.href;
    var title = $('meta[property="og:title"]').attr('content');
    window.open('http://www.facebook.com/sharer/sharer.php?u=' + url + '&t=' + title, "", "width=500,height=500,left=0,top=0");
}

// 네이버 블로그 공유 : https://developers.naver.com/docs/share/navershare/
function blog() {
    var url = encodeURI(encodeURIComponent(location.href));
    var title = encodeURI($('meta[property="og:title"]').attr('content'));
    var shareURL = "https://share.naver.com/web/shareView?url=" + url + "&title=" + title;
    window.open(shareURL, "네이버 공유하기", "width=500,height=500,left=0,top=0");
}

// 밴드 공유 : https://developers.band.us/develop/guide/share
function band(){
    //var url = encodeURI(encodeURIComponent(location.href));
    //var title = encodeURI($('meta[property="og:title"]').attr('content'));
    var url = location.href;
    var title = $('meta[property="og:title"]').attr('content');
    // 밴드 공유 버튼을 사용하는 서비스의 도메인
    var route = window.location.href;
    // 밴드에 게시할 내용(문자셋: UTF-8, 인코딩 방식: URL 인코딩)
    var body = encodeURIComponent(title+'\r\n'+url+'&route='+route);
    var shareURL = "https://band.us/plugin/share?body=" + body;
    window.open(shareURL, "", "width=500,height=650,left=0,top=0");
}

// 카카오 공유 : https://developers.kakao.com/docs/latest/ko/message/js-link
function kakao() {
    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: $('meta[property="og:title"]').attr('content'),
            description: $('meta[property="og:description"]').attr('content'),
            // 이미지는 반드시 들어가야 된다.
            imageUrl: $('meta[property="og:image"]').attr('content'),
            link: {
                mobileWebUrl: location.href,
                webUrl: location.href
            }
        },
        social: {
            likeCount: 286,
            commentCount: 45,
            sharedCount: 845
        },
        buttons: [
            {
                title: '웹으로 보기',
                link: {
                    webUrl: window.location.href
                }
            }
        ]
    });
  }