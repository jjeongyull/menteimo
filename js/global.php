<?php
    // 데이터베이스 연결
    $DB_SERVER_NAME = "121.254.170.181";                  // 데이터베이스 주소
    $DB_USER_NAME = "additdev";                     // 데이터베이스 사용자명
    $DB_USER_PASSWORD = "Vp5lmtFF9q7nmytc";         // 데이터베이스 사용자 비밀번호    
    $DB_EVENT_NAME = "menteimo_test";


    $ADDWORK_SERVER_NAME = "121.254.170.181";                  // 데이터베이스 주소
    $ADDWORK_USER_NAME = "additdev";                     // 데이터베이스 사용자명
    $ADDWORK_USER_PASSWORD = "Vp5lmtFF9q7nmytc";         // 데이터베이스 사용자 비밀번호    
    $ADDWORK_USERDB_NAME = "menteimo_test";                  // 데이터베이스명


    // 비밀번호 초기화 시
    $INIT_PASS = "!addit2022#";

    

    $IS_DEBUG = true;
    
    define("ERR_UPLOAD_MESSAGE", array(
        '업로드 최대 크기 초과(post_max_size)', // 0
        '업로드 최대 크기 초과', // 1
        '업로드 최대 크기 초과(upload_max_filesize)', // 2
        '파일 부분적 업로드', //3
        '업로드 파일 없음', //4
        'TEMP 폴더 없음', //5
        '디스크 쓰기 실패', //6
        '업로드 불가 확장자(시스템 파일)', // 7
        '업로드 폴더 생성 오류', // 8
        '업로드 POST 실행 오류' , // 9
        '허용 불가 확장자 (허용가능 : %s)', // 10
        '동일한 파일명 존재', // 11
        '알 수 없는 오류 (%d %s)', //12
        '업로드 형식 미정의'
    ));

    define("RESULT_TABLE", "CREATE TABLE @ (
        r_idx INT NOT NULL AUTO_INCREMENT,
        user_name varchar(30) DEFAULT NULL,
        user_phone varchar(20) DEFAULT NULL,
        user_email varchar(50) DEFAULT NULL,
        user_address varchar(150) DEFAULT NULL,
        user_result text DEFAULT NULL, 
        user_score INT DEFAULT 0,          
        user_shotattach text DEFAULT NULL,
        user_inpath text DEFAULT NULL,
        user_os varchar(20) DEFAULT NULL,          
        user_browser varchar(20) DEFAULT NULL,          
        r_date datetime DEFAULT NULL,
        PRIMARY KEY (r_idx)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;");
    // 오류 메시지 출력 처리, 실제 배포시에는 display_errors = 0으로
    error_reporting(E_ALL ^ E_NOTICE);
    ini_set("display_errors", 1);

    //error_reporting(0);
?>

