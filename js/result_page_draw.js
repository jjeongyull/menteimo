$(document).ready(function(){
    $.ajax({
        url : "js/event_value.json", // 파일경로
        datatype : "json",
        type: 'get',
        async: false,
        success : function(data) { 
            let jsonData = JSON.stringify(data);
            let obj = JSON.parse(jsonData);
            alert(obj);
            console.log(obj);

            let eveneT = $("#result_event_title"); // 이벤트 명 들어갈 h1태그
            let customerN = $("#result_customer_name"); //고객사가 들어갈 p태그

            $.each(obj, function(index, item) { 
            // let customer_name = index.customer_name;
            // let event_title = index.event_title;
            // let quiz_answer_count = index.quizValue.length;
            // let quiz_shot_count = index.shotImg.length;

            // console.log(customer_name, event_title, quiz_answer_count, quiz_shot_count)
                //key값이 baseinfo일때

                //메인이미지 삽입
                switch(index){
                    case  "event_title" :
                    eveneT.text(item);
                    break;      
                case "customer_name" :
                    customerN.text(item)
                    break;
                case "quizValue" : //퀴즈문제 출력
                    let tHead = $("#result_th"); //참여자 명단 head뿌려질 곳
                    let tbody = $("#result_td"); //참여자 명단 head뿌려질 곳

                    let qValueCount = item.length; //해당 이벤트 문제 길이 값
                    let thHeadHTML = `<tr>
                                      <th class=" addit-padding1 addit-font-color5">이름</th>
                                      <th class=" addit-padding1 addit-font-color5">전화번호</th>
                                      <th class=" addit-padding1 addit-font-color5">참여날짜</th>`; 

                    let thBodyHTML = `<tr>
                                      <td class=" addit-padding1  addit-text-center">${obj.name}</td>
                                      <td class=" addit-padding1  addit-text-center">${obj.phone}</td>
                                      <td class=" addit-padding1  addit-text-center">2022.02.28</td>`;  

                    for(var i = 0; i<qValueCount; i++){
                        thHeadHTML = thHeadHTML + `<th class=" addit-padding1 addit-font-color5">정답${i + 1}</th>`;

                        thBodyHTML = thBodyHTML +`<td class=" addit-padding1  addit-border-01">${item[i]}</td>`;
                    }


                    tHead.html(thHeadHTML);
                    tbody.html(thBodyHTML);
                    tHead.append('<tr>');
                    tbody.append('<tr>');
               
                    break;
                case "shotImg" :   //퀴즈 인증샷 출력
                
                    break; 
                default:
                    break;
            }
            });
        },
        error : function() {
            alert('error');			
        }
    });
})
