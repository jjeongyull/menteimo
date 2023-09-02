<?php

    session_start();
    $Logined = isset($_SESSION['logined']) ? $_SESSION['logined'] : ""; 

    include_once 'global.php';
    include_once 'function.php';
    include_once 'database.php';

    // 사용자 정보 분석을 위한 처리
    //$user_inpath = getUserInPath();
    $user_os = getUserOS();    
    $user_browser = getUserBrowser();

    // 결과값 리턴 배열 선언
    $return_data = array();
    $data_array = array();

    // 보안 관련
    header('Access-Control-Allow-Origin: *');
    // 설정할 경우 자바스크립트에서 객체로 인식, JSON 타입으로 리턴을 위해 설정
    Header('Content-Type: application/json');  


    // 명령 처리 구분
    $cmd = fn_URIString('cmd', "string", "");
    if ($cmd == ""){
        $ERR_MSG = "error : command blank";
        echo "<script>alert('" . $ERR_MSG . "');</script>";   
        die();
    }

    // 수정, 삭제를 위한 idx
    $e_idx = fn_URIString('e_idx', "int", 0);
    // 수정, 삭제를 위한 idx
    // $idx = fn_URIString('idx', "int", 0);
    // 페이지 정보 변수
    // 현재 페이지
    $nowpage = fn_URIString('nowpage', "int", 1);
    // 페이지당 카운트할 개수 (기본 10개씩 리턴)
    // loaccount가 -1일 경우 모든 데이터를 리턴
    $loadcount = fn_URIString('loadcount', "int", 10);
    // 시작 페이지가 0보다 작을 경우 0으로 설정, 읽어들일 개수물 시작점
    $startcount = ($nowpage-1) * $loadcount;
    if ($startcount < 0) {
        $startcount = 0;
    }

    // 이벤트 관련 파라미터 처리
    $e_customer_idx = fn_URIString('e_customer_idx', "int", 0);
    $e_description = fn_URIString('e_description', "string", "");
    $e_active = fn_URIString('e_active', "string", "");                // 활성화 1, 비활성화 0
    $e_title = fn_URIString('e_title', "string", "");
    $e_startdate = fn_URIString('e_startdate', "string", "");
    $e_enddate = fn_URIString('e_enddate', "string", "");
    $e_data = fn_URIString('e_data', "string", "");
    $e_mainimage = fn_URIString('e_mainimage', "string", "");    
    $user_inpath = fn_URIString('user_inpath', "string", "");      

    $e_shot= fn_URIString('e_shot', "string", "");
    $user_email= fn_URIString('user_email', "string", "");
    $user_name= fn_URIString('user_name', "string", "");
    $user_phone= fn_URIString('user_phone', "string", "");
    // 전화번호 문자열에 - 가 포함되어 있을 경우 제거한다.
    $user_phone = str_replace("-", "", $user_phone);
    $resultArray= fn_URIString('resultArray', "string", "");
    $shot = fn_URIString('shot', "string", "");             // 인증샷 파일명 "," 로 구분
    $user_score = fn_URIString('user_score', "int", 0);     // 점수

    // 고객사 처리
    $customer_name = fn_URIString('customer_name', "string", "");

    // sns로그인 이메일 처리
    $e_email = fn_URIString('e_email', "string", "");
    // 검색 처리
    /*
    $e_searchdata = fn_URIString('e_searchdata', "string", ""); 
    $e_searchtype = fn_URIString('e_searchtype', "string", ""); 
    $e_search_sdate = fn_URIString('e_search_sdate', "string", ""); 
    $e_search_edate = fn_URIString('e_search_edate', "string", ""); 

    if (($e_searchtype <> "") && ($e_searchdata <> "")) {
        if ($e_searchtype == "s_title") {
            $e_searchdata = " e_title like '%" . $e_searchdata . "%' ";
        }
        else if  ($b_searchtype == "s_contents"){
            $e_searchdata = " e_contents like '%" . $e_searchdata . "%' ";
        }
        else if  ($b_searchtype == "s_writer"){
            $e_searchdata = " e_writer like '%" . $e_searchdata . "%' ";
        }    
    }

    if (($b_search_sdate <> "") &&  ($b_search_edate <> "")){
        if ($b_searchdata === ""){
            $b_searchdata = " DATE(b_date) = BETWEEN '" . $b_search_sdate . "' AND '" . $b_search_edate . "'";
        }else{
            $b_searchdata = $b_searchdata . " AND DATE(b_date) = BETWEEN '" . $b_search_sdate . "' AND '" . $b_search_edate . "'";
            $b_searchdata = $b_searchdata . " AND DATE(b_date) = BETWEEN '" . $b_search_sdate . "' AND '" . $b_search_edate . "'";
        }
    }
    else{
        if ($b_search_sdate <> "") {
            if ($b_searchdata === ""){
                $b_searchdata = " DATE(b_date) = '" . $b_search_sdate . "'";
            }else{
                $b_searchdata = $b_searchdata . " AND DATE(b_date) = '" . $b_search_sdate . "'";
            }
        }
        if ($b_search_edate <> "") {
            if ($b_searchdata === ""){
                $b_searchdata = " DATE(b_date) = '" . $b_search_edate . "'";
            }else{
                $b_searchdata = $b_searchdata . " AND DATE(b_date) = '" . $b_search_edate . "'";
            }
        }
    }
    */
    // 데이터베이스 커넥션 생성 (additwork)
    if (($cmd == "login") || ($cmd == "load_customer")){
        $databaseService = new DatabaseService($ADDWORK_SERVER_NAME, $ADDWORK_USER_NAME, $ADDWORK_USER_PASSWORD, $ADDWORK_USERDB_NAME);
        $user_conn = $databaseService->getConnection();
        if ($user_conn === NULL)
        {
            $ERR_MSG = "데이터베이스 연결 오류 : " . $mysqli->connect_error;
            echo "<script>alert('" . $ERR_MSG . "');</script>";   
            die();
        }
    }

    // 데이터베이스 커넥션 생성 (menteimo)
    $databaseService = new DatabaseService($DB_SERVER_NAME, $DB_USER_NAME, $DB_USER_PASSWORD, $DB_EVENT_NAME);
    $event_conn = $databaseService->getConnection();
    if ($event_conn === NULL)
    {
        $ERR_MSG = "데이터베이스 연결 오류 : " . $mysqli->connect_error;
        echo "<script>alert('" . $ERR_MSG . "');</script>";   
        die();
    }
    // 관리자 로그인 정보
    $login_id = fn_URIString('login_id', "string", "");  
    $login_password = fn_URIString('login_password', "string", "");  

    // 로그인이거나 결과 전송이 아닐 경우에는 로그인을 체크한다.
    if (!(($cmd == "login") || ($cmd == "send_event_result") || ($cmd == "load_event") || ($cmd == "update_email"))){
        if ($Logined == "")
        {
            $tmp_json["value"] = "error";
            $tmp_json["desc"] = "로그인이 필요합니다.";
            $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
            echo($return_data);  
            $user_conn=null;
            $event_conn=null;
            die();
        }
    };

    // 타겟 테이블 설정
    switch ($cmd){
        case "init_password":
        case "login" :
            $tbl_name = "aw_member";
            break;
          case "customer" :
          case "insert_customer" :
          case "update_customer" :
          case "delete_customer" :
          case "load_customer" : 
            $tbl_name = "aw_customer";
            break;
          case "event_page":  
          case "active_event" : 
          case "update_event" : 
          case "delete_event":  
          case "insert_event":
          case "load_event": 
            $tbl_name = "event";
            break;
          case "send_event_result":
          case "load_event_result" :
          case "load_event_result_right":
          case "load_inpath:":      // 유입 URL 집계 
            $tbl_name = "result_" . $e_idx;
            break;
          case "update_email":      // email올리기
            $tbl_name = "member_email";
            break;
        default:
            break;
    }
    switch ($cmd){
        case "load_event_result_right":
          if ($e_idx != "") {
            // 테이블로부터 모든 칼럼정보를 구하는 구문 
            // 시작일이 가장 늦은 순으로 출력한다.
            $sql = "SELECT * FROM " . $tbl_name . " WHERE user_score = (SELECT MAX(user_score) FROM " . $tbl_name . ") order by user_name ASC"; 
            // 테이블의 cs_idx의 개수를 구하는 구문
            $sql_count = "SELECT count(r_idx) as cnt FROM " . $tbl_name . " WHERE user_score = (SELECT MAX(user_score) FROM " . $tbl_name;  
          }

          try{
              // 준비하시고
              $stmt = $event_conn->prepare($sql_count);
              // 실행
              $stmt->execute();
              // 결과
              $totcount = $stmt->fetchColumn();

              $stmt = $event_conn->prepare($sql);
              $stmt->execute();
              $nowpage = $nowpage;
              while($row = $stmt->fetchAll(PDO::FETCH_ASSOC))
              {
                  $data_array = $row;
              }   
              
              $result_data = array("totcount"=>$totcount, "nowpage"=>$nowpage);
              $result_data["tabledata"] = $data_array;
              $return_data = json_encode($result_data, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
              echo($return_data);      
          }
          catch(PDOException $e){
              $tmp_json["value"] = "error";
              $tmp_json["desc"] = $e->getMessage();
              $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
              echo($return_data);      
          }
          break;
        case "load_event_result" :
            if ($e_idx != "") {
                // 테이블로부터 모든 칼럼정보를 구하는 구문 
                // 시작일이 가장 늦은 순으로 출력한다.
                $sql = "SELECT * FROM " . $tbl_name . " order by user_name ASC limit " . $startcount . ", " . $loadcount; 
                // 테이블의 cs_idx의 개수를 구하는 구문
                $sql_count = "SELECT count(r_idx) as cnt FROM " . $tbl_name; 
            }
            try{
                // 준비하시고
                $stmt = $event_conn->prepare($sql_count);
                // 실행
                $stmt->execute();
                // 결과
                $totcount = $stmt->fetchColumn();

                $stmt = $event_conn->prepare($sql);
                $stmt->execute();
                $nowpage = $nowpage;
                while($row = $stmt->fetchAll(PDO::FETCH_ASSOC))
                {
                    $data_array = $row;
                }   
                
                $result_data = array("totcount"=>$totcount, "nowpage"=>$nowpage);
                $result_data["tabledata"] = $data_array;
                $return_data = json_encode($result_data, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
            catch(PDOException $e){
                $tmp_json["value"] = "error";
                $tmp_json["desc"] = $e->getMessage();
                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
            break;
        // 테이블 초기화
        case "send_event_result" :
            $bjoined = false;
            // 이벤트 중복 참여 처리 : 동일한 핸드폰, 동일한 이름(???), (동일한 이메일일???) -> 핸드폰만 중복 처리 
            $search_query = "";
            if ($user_phone != ""){
                $search_query = " WHERE user_phone = :user_phone";
            }
            /*
            if ($user_name != ""){    
                if ($search_query == "")
                    $search_query = "WHERE user_name = :user_name";
                else
                    $search_query = $search_query . " AND user_name = :user_name";
            }
            if ($user_email != ""){    
                if ($user_email == "")
                    $search_query = "WHERE user_email = :user_email";
                else
                    $search_query = $search_query . " AND user_email = :user_email";
            }
            */
            if ($search_query != "")
            {
                $sql = "SELECT count(user_phone) as cnt FROM " . $tbl_name . $search_query;
                // PDO 준비
                $stmt = $event_conn->prepare($sql);
                // 파라미터 바인딩, ?로 할 경우 bindValue로 
                /*
                if ($user_name != ""){
                    $stmt->bindValue(":user_name", $user_name, PDO::PARAM_STR);
                }
                */
                if ($user_phone != ""){
                    $stmt->bindValue(":user_phone", $user_phone, PDO::PARAM_STR);
                }
                /*
                if ($user_email != ""){
                    $stmt->bindValue(":user_email", $user_email, PDO::PARAM_STR);
                }
                */
                $stmt->execute();
                $count = $stmt->fetchColumn();
//                $stmt->debugDumpParams();
                //  이미 참여 했으면
                if ($count > 0){
                    $tmp_json["value"] = "error";
                    $tmp_json["desc"] = "이미 이벤트에 참가하셨습니다.";
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);    
                    $bjoined = true;
                }
            }
            if (!$bjoined){
                $sql = "INSERT INTO " . $tbl_name . " (user_name, user_phone, user_email, user_result, user_shotattach, user_inpath, user_os, user_browser, user_score, r_date) VALUES" ;
                $sql = $sql . "(:user_name, :user_phone, :user_email, :user_result, :user_shotattach, :user_inpath, :user_os, :user_browser, :user_score, now())";
                try{
                    // PDO 준비
                    $stmt = $event_conn->prepare($sql);
                    // 파라미터 바인딩, ?로 할 경우 bindValue로 

                    $stmt->bindValue(":user_name", $user_name, PDO::PARAM_STR);
                    $stmt->bindValue(":user_phone", $user_phone, PDO::PARAM_STR);
                    $stmt->bindValue(":user_email", $user_email, PDO::PARAM_STR);
                    $stmt->bindValue(":user_result", $resultArray, PDO::PARAM_STR);
                    $stmt->bindValue(":user_shotattach", $shot, PDO::PARAM_STR);
                    $stmt->bindValue(":user_inpath", $user_inpath, PDO::PARAM_STR);
                    $stmt->bindValue(":user_os", $user_os, PDO::PARAM_STR);
                    $stmt->bindValue(":user_browser", $user_browser, PDO::PARAM_STR);
                    $stmt->bindValue(":user_score", $user_score, PDO::PARAM_INT);

                    $stmt->execute();
                    //$stmt->debugDumpParams();
                    // 실행이 성공하면
                    $count = $stmt->rowCount();
                    if ( $count > 0){
                        $tmp_json["value"] = "ok";
                        $tmp_json["desc"] = "success";
                        $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        echo($return_data);      
                    }
                    // 실패하면
                    else{
                        $tmp_json["value"] = "error";
                        $tmp_json["desc"] = pdo_debugStrParams($stmt, $IS_DEBUG);
                        $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        echo($return_data);      
                    }
                }
                catch(PDOException $e){
                    $tmp_json["value"] = "error";
                    $tmp_json["desc"] = $e->getMessage();
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);      
                }
            }
            break;
        // 아이디가 있을 경우 패스워드를 초기화 시킨다.
        case "init_password" :
            $sql = "SELECT count(mem_id) as cnt FROM ". $tbl_name . " where mem_id = :mem_id";
            // PDO 준비
            try{
                $stmt = $user_conn->prepare($sql);
                $chg_password = hash("sha256", utf8_encode($INIT_PASS));
                // 파라미터 바인딩, ?로 할 경우 bindValue로 
                $stmt->bindValue(":mem_id", $login_id, PDO::PARAM_STR);
                $stmt->execute();
                $count = $stmt->fetchColumn();
                if ($count == 0){
                  $tmp_json["value"] = "error";
                  $tmp_json["desc"] = '등록된 사용자가 아닙니다.';
                  $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                }
                else{
                    // 주의 : PDO를 사용할 경우 Update가 일어나지 않을 경우 rowCount는 0을 반환 (mysql에서 동일한 값이 있을 경우 0을 반환한다.)
                    /*   $pdoStatement -> execute([
                                ":name" => $name
                                , ":email" => $email
                            ]); 이 경우 모든 데이터 타입은 PDO::PARAM_STR로 처리된다.
                    */
                    $sql = "UPDATE ". $tbl_name . " SET mem_password = :init_password WHERE mem_id = :mem_id'";
                    try{
                        // PDO 준비
                        $stmt = $user_conn->prepare($sql);
                        $chg_password = hash("sha256", utf8_encode($INIT_PASS));
                        // 파라미터 바인딩, ?로 할 경우 bindValue로 
                        $stmt->bindValue(":init_password", $chg_password, PDO::PARAM_STR);
                        $stmt->bindValue(":mem_id", $login_id, PDO::PARAM_STR);
                        $stmt->execute();
                        // PDO 처리 결과 반환
                        $count = $stmt->rowCount();
                        if ($count  > 0){
                            $tmp_json["value"] = "ok";
                            $tmp_json["desc"] = "update";
                            $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                            echo($return_data);      
                        }
                        else{
                            if ($count ==  0){
                                $tmp_json["value"] = "ok";
                                $tmp_json["desc"] = "변경할 값이 동일합니다.";
                                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                                echo($return_data);       
                            }
                            else{
                                $tmp_json["value"] = "error";
                                $tmp_json["desc"] = pdo_debugStrParams($stmt, $IS_DEBUG);
                                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                                echo($return_data);       
                            }
                        }
                    }
                    catch(PDOException $e){
                        $tmp_json["value"] = "error";
                        $tmp_json["desc"] = $e->getMessage();
                        $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        echo($return_data);      
                    }
                }
            }
            catch(PDOException $e){
                $tmp_json["value"] = "error";
                $tmp_json["desc"] = $e->getMessage();
                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
            break;
        case "login" :
            $sql = "SELECT count(mem_id) as cnt FROM ". $tbl_name . " where mem_id = :login_id and mem_password = :login_password";
            $login_password = hash("sha256", utf8_encode($login_password));
            // PDO 준비
            try{
                // 준비하시고
                $stmt = $user_conn->prepare($sql);

                // 바인딩하시고
                $stmt->bindValue(":login_id", $login_id, PDO::PARAM_STR);
                $stmt->bindValue(":login_password", $login_password, PDO::PARAM_STR);

                // 실행
                $stmt->execute();

                // 결과
                $count = $stmt->fetchColumn();
                if ($count == 1){
                    try{                        //{ "value" : "ok", "desc" : "success"}
                        // 세션 방식
                        //$_SESSION["login_id"] = $login_id;
                        /* JWT 방식
                        1) 로그인 성공 시 Access Token, Refresh Token 을 발행한다.
                        2) Refresh Token을 사용자 로그인 정보 테이블에 업데이트 한다
                        */
                        //generateAccessToken($login_id);
                        //generateRefreshToken();
                        $_SESSION['logined'] = "logined";    

                        $tmp_json["value"] = "ok";
                        $tmp_json["desc"] = $_SESSION['logined'];
                        $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        echo($return_data);    
                    }
                    catch(PDOException $e){
                        $tmp_json["value"] = "error";
                        $tmp_json["desc"] = $e->getMessage();
                        $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        echo($return_data);      
                    }
                }
                else{
                    $tmp_json["value"] = "error";
                    if ($count ==  0){
                        $tmp_json["desc"] = "로그인 정보가 올바르지 않습니다.";
                    }
                    else{
                        $tmp_json["desc"] = pdo_debugStrParams($stmt, $IS_DEBUG);
                    }
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);       
                }
            }
            catch(PDOException $e){
                $tmp_json["value"] = "error";
                $tmp_json["desc"] = $e->getMessage();
                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
            break;
        // 이벤트 삭제 : (조건) 이벤트 인덱스 값
        case "delete_event":
          $sql = "DELETE FROM " . $tbl_name . " WHERE e_idx = :e_idx"; 
          try{
              $stmt = $event_conn->prepare($sql);
              // PARAM_INT(숫자), PARAM_STR(문자) 주의. 
              $stmt->bindParam(":e_idx", $e_idx, PDO::PARAM_INT);
              $stmt->execute();
              $count = $stmt->rowCount();
              // 쿼리 정상 실행 && 영향을 받은 행이 있을 경우 해당 적용되는 수를 리턴
              if ($count >  0){
                  $tmp_json["value"] = "ok";
                  $tmp_json["desc"] = "delete";
                  $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                  echo($return_data);      
              }
              else{
                  $tmp_json["value"] = "error";
                  $tmp_json["desc"] = pdo_debugStrParams($stmt, $IS_DEBUG);
                  $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                  echo($return_data);       
              }
          }
          catch(PDOException $e){
              $tmp_json["value"] = "error";
              $tmp_json["desc"] = $e->getMessage();
              $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
              echo($return_data);      
          }
          break;
        // 고객사 리스트 출력
        case "load_customer":
          if ($loadcount == -1){
            $sql = "SELECT * FROM " . $tbl_name . " order by cs_name"; 
          }
          else{
            $sql = "SELECT * FROM " . $tbl_name . " order by cs_name limit " . $startcount . ", " . $loadcount; 
          }            
          // 테이블로부터 모든 칼럼정보를 구하는 구문
          //$sql = "SELECT * FROM " . $tbl_name; 
          // 테이블의 cs_idx의 개수를 구하는 구문
          $sql_count = "SELECT count(cs_idx) as cnt FROM " . $tbl_name; 

          try{
              // 준비하시고
              $stmt = $user_conn->prepare($sql_count);
              // 실행
              $stmt->execute();
              // 결과
              $totcount = $stmt->fetchColumn();

              $stmt = $user_conn->prepare($sql);
              $stmt->execute();
              //print_r($stmt->debugDumpParams());
              while($row = $stmt->fetchAll(PDO::FETCH_ASSOC))
              {
                  $data_array = $row;
              }   
              
              $result_data = array("totcount"=>$totcount, "nowpage"=>$nowpage);
              $result_data["tabledata"] = $data_array;
              $return_data = json_encode($result_data, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
              echo($return_data);      
          }
          catch(PDOException $e){
              $tmp_json["value"] = "error";
              $tmp_json["desc"] = $e->getMessage();
              $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
              echo($return_data);      
          }
          break;
        case "load_event":
            // 저장 프로시저 호출
            // $sql_sp = "CALL update_event_status()";
            // $stmt = $pdo->prepare($sql_sp);
            // $stmt->execute();
            // if (($e_idx === 0) || ($e_idx === "")){
            //     if ($e_active != ""){
            //         if ($loadcount == -1){
            //             $sql = "SELECT * FROM " . $tbl_name . " WHERE e_active = :e_active order by e_startdate DESC"; 
            //             $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name . " WHERE e_active = :e_active"; 
            //         }
            //         else{
            //             $sql = "SELECT * FROM " . $tbl_name . " WHERE e_active = :e_active order by e_startdate DESC limit " . $startcount . ", " . $loadcount; 
            //             $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name . " WHERE e_active = :e_active"; 
            //         }
            //     }
            //     else {
            //         $sql = "SELECT * FROM " . $tbl_name . " order by e_startdate DESC limit " . $startcount . ", " . $loadcount; 
            //         $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name; 
            //     }
            // }
            // else{
            //     if ($Logined == ""){
            //         if ($type == "preview"){
            //             $sql = "SELECT * FROM " . $tbl_name . " WHERE e_idx = " . $e_idx;
            //             $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name . " WHERE e_idx = " . $e_idx;
            //         }
            //         else{
            //             $sql = "SELECT * FROM " . $tbl_name . " WHERE e_active = 1 && e_idx = " . $e_idx . " && e_startdate < now() && e_enddate > now()";
            //             $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name . " WHERE e_active = 1 && e_idx = " . $e_idx . " && e_startdate < now() && e_enddate > now()";
            //         }
            //     }
            //     else{
            //         $sql = "SELECT * FROM " . $tbl_name . " WHERE e_idx = " . $e_idx; 
            //         $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name . " WHERE e_idx = " . $e_idx;
            //     }
            // }
            if (($e_idx === 0) || ($e_idx === "")){
                // 테이블로부터 모든 칼럼정보를 구하는 구문 
                // 시작일이 가장 늦은 순으로 출력한다.
                if ($e_active != ""){
                    if ($loadcount == -1){
                        $sql = "SELECT * FROM " . $tbl_name . " WHERE e_active = :e_active order by e_startdate DESC"; 
                        // 테이블의 cs_idx의 개수를 구하는 구문
                        $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name . " WHERE e_active = :e_active"; 
                    }
                    else{
                        $sql = "SELECT * FROM " . $tbl_name . " WHERE e_active = :e_active order by e_startdate DESC limit " . $startcount . ", " . $loadcount; 
                        // 테이블의 cs_idx의 개수를 구하는 구문
                        $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name . " WHERE e_active = :e_active"; 
                    }
                }
                else {
                    $sql = "SELECT * FROM " . $tbl_name . " order by e_startdate DESC limit " . $startcount . ", " . $loadcount; 
                    // 테이블의 cs_idx의 개수를 구하는 구문
                    $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name; 
                }
            }
            else{
                if ($Logined == ""){
                    if ($type == "preview"){   // 미리보기 모드일 경우에는 보여준다.
                      $sql = "SELECT * FROM " . $tbl_name . " WHERE e_idx = " . $e_idx;
                      $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name . " WHERE e_idx = " . $e_idx;
                    }
                    else{
                      $sql = "SELECT * FROM " . $tbl_name . " WHERE e_active = 1 && e_idx = " . $e_idx . " && e_startdate < now() && e_enddate > now()";
                      $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name . " WHERE e_active = 1 && e_idx = " . $e_idx . " && e_startdate < now() && e_enddate > now()";
                    }
                  }
                  else{
                    $sql = "SELECT * FROM " . $tbl_name . " WHERE e_idx = " . $e_idx; 
                    $sql_count = "SELECT count(e_idx) as cnt FROM " . $tbl_name . " WHERE e_idx = " . $e_idx;
                  }
                // 테이블로부터 모든 칼럼정보를 구하는 구문
                //$sql = "SELECT * FROM " . $tbl_name; 
                // 테이블의 cs_idx의 개수를 구하는 구문
              
            }

            try{
                // 준비하시고
                $stmt = $event_conn->prepare($sql_count);
                // 실행
                if ($e_active != "")
                {
                    $stmt->bindParam(":e_active", $e_active, PDO::PARAM_STR);
                }
                $stmt->execute();
                //$stmt->debugDumpParams();
                // 결과
                $totcount = $stmt->fetchColumn();

                $stmt = $event_conn->prepare($sql);
                if ($e_active != "")
                {
                    $stmt->bindParam(":e_active", $e_active, PDO::PARAM_STR);
                }
                $stmt->execute();
                //$stmt->debugDumpParams();
                $nowpage = $nowpage;
                while($row = $stmt->fetchAll(PDO::FETCH_ASSOC))
                {
                    $data_array = $row;
                }   
                
                $result_data = array("totcount"=>$totcount, "nowpage"=>$nowpage);
                $result_data["tabledata"] = $data_array;
                $return_data = json_encode($result_data, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
            catch(PDOException $e){
                $tmp_json["value"] = "error";
                $tmp_json["desc"] = $e->getMessage();
                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
          break;
        case "insert_customer" : // user_conn 사용
            $sql = "INSERT INTO ". $tbl_name . " (cs_name) VALUES" ;
            $sql = $sql . "(:customer_name)";
            try{
                // PDO 준비
                $stmt = $user_conn->prepare($sql);
                // 파라미터 바인딩, ?로 할 경우 bindValue로 

                $stmt->bindParam(":customer_name", $customer_name, PDO::PARAM_STR);
                $stmt->execute();
                //$stmt->debugDumpParams();
                // 실행이 성공하면
                $count = $stmt->rowCount();
                if ( $count > 0){
                    $tmp_json["value"] = "ok";
                    $tmp_json["desc"] = "write";
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);      
                }
                // 실패하면
                else{
                    $tmp_json["value"] = "error";
                    $tmp_json["desc"] = pdo_debugStrParams($stmt, $IS_DEBUG);
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);      
                }
            }
            catch(PDOException $e){
                $tmp_json["value"] = "error";
                $tmp_json["desc"] = $e->getMessage();
                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
            break;
        // 이벤트 등록 성공 후 결과 테이블을 자동 생성한다. 
        // 결과 테이블명 : result_ + SELECT last_insert_id() 값
        case "insert_event":
            $sql = "INSERT INTO ". $tbl_name . " (e_customer_idx, e_data, e_description, e_title, e_startdate, e_enddate, e_mainimage) VALUES" ;
            $sql = $sql . "(:e_customer_idx, :e_data, :e_description, :e_title, :e_startdate, :e_enddate, :e_mainimage)";
            try{
                // 트랜잭션 준비
                //$event_conn->beginTransaction();
                // PDO 준비
                $stmt = $event_conn->prepare($sql);
                // 파라미터 바인딩, ?로 할 경우 bindValue로 
                $stmt->bindParam(":e_customer_idx", $e_customer_idx, PDO::PARAM_INT);
                $stmt->bindParam(":e_data", $e_data, PDO::PARAM_STR);
                $stmt->bindParam(":e_description", $e_description, PDO::PARAM_STR);
                $stmt->bindParam(":e_title", $e_title, PDO::PARAM_STR);
                $stmt->bindParam(":e_startdate", $e_startdate, PDO::PARAM_STR);
                $stmt->bindParam(":e_enddate", $e_enddate, PDO::PARAM_STR);
                $stmt->bindParam(":e_mainimage", $e_mainimage, PDO::PARAM_STR);

                $stmt->execute();
                //$stmt->debugDumpParams();
                // 실행이 성공하면
                if (($stmt->rowCount()) > 0){
                    //$event_conn->commit();
                    // 마지막 성공한 쿼리의 auto_increment 값을 얻어온다.
                    $lastIdx = $event_conn->lastInsertId();
                    // 결과 테이블을 생성한다.
                    $result_table = "result_" . $lastIdx;
                    // echo $lastIdx;
                    $sql = "SELECT 1 FROM Information_schema.tables WHERE table_schema = '" . $DB_EVENT_NAME . "'";
                    $sql = $sql . " AND table_name = :table_name";
                    try {
                        $stmt = $event_conn->prepare($sql);
                        $stmt->bindParam(":table_name", $result_table, PDO::PARAM_STR);
                        $stmt->execute();
                        // 테이블이 존재하지 않을 경우
                        if ($stmt->fetchColumn() != "1") {
                            $sql = str_replace("@", $result_table, RESULT_TABLE);
                            $stmt = $event_conn->prepare($sql);
                            $stmt->execute();
                            // $stmt->debugDumpParams();
                            if ($stmt == false){
                                //$event_conn->rollback();
                                $tmp_json["value"] = "error";
                                $tmp_json["desc"] = "create result table : " . pdo_debugStrParams($stmt, $IS_DEBUG);
                                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                                echo($return_data);      
                            }
                            else{
                                $tmp_json["value"] = "ok";
                                $tmp_json["desc"] = $lastIdx;
                                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                                echo($return_data);   
                            }
                        }
                        else{
                            // $stmt->debugDumpParams();
                            $tmp_json["value"] = "error";
                            $tmp_json["desc"] = "create result table : exists result table";
                            $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                            echo($return_data);      
                        }
                    }
                    catch(PDOException $e){
                        $tmp_json["value"] = "error";
                        $tmp_json["desc"] = $e->getMessage();
                        $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        echo($return_data);      
                    }  
                }
                // 실패하면
                else{
                    $tmp_json["value"] = "error";
                    $tmp_json["desc"] = $b_title . $b_contents . $b_writer . $sql;
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);      
                }
            }
            catch(PDOException $e){
                $tmp_json["value"] = "error";
                $tmp_json["desc"] = $e->getMessage();
                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
            break;
        case "update_event" :
            $sql = "UPDATE ". $tbl_name . " SET e_title=:e_title, e_description=:e_description, e_startdate=:e_startdate, ";
            $sql = $sql . "e_enddate=:e_enddate, e_data=:e_data, e_mainimage=:e_mainimage WHERE e_idx = :e_idx";
            try{
                // PDO 준비
                $stmt = $event_conn->prepare($sql);
                // 파라미터 바인딩, ?로 할 경우 bindValue로 
                $stmt->bindParam(":e_data", $e_data, PDO::PARAM_STR);
                $stmt->bindParam(":e_description", $e_description, PDO::PARAM_STR);
                $stmt->bindParam(":e_title", $e_title, PDO::PARAM_STR);
                $stmt->bindParam(":e_startdate", $e_startdate, PDO::PARAM_STR);
                $stmt->bindParam(":e_enddate", $e_enddate, PDO::PARAM_STR);
                $stmt->bindParam(":e_idx", $e_idx, PDO::PARAM_INT);
                $stmt->bindParam(":e_mainimage", $e_mainimage, PDO::PARAM_STR);
                $stmt->execute();
                //$stmt->debugDumpParams();
                if ($stmt !== false){
                    $count = $stmt->rowCount();
                    if ($count > 0){
                        $tmp_json["value"] = "ok";
                        $tmp_json["desc"] = "update";
                        $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        echo($return_data);      
                    }else{
                        $tmp_json["value"] = "ok";
                        $tmp_json["desc"] = "update : equal data";
                        $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        echo($return_data);      
                    }
                }
                else{
                    $tmp_json["value"] = "error";
                    $tmp_json["desc"] = pdo_debugStrParams($stmt, $IS_DEBUG);
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);       
                }
            }
            catch(PDOException $e){
                $tmp_json["value"] = "error";
                $tmp_json["desc"] = $e->getMessage();
                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
            break;
        case "active_event":
            // 주의 : PDO를 사용할 경우 Update가 일어나지 않을 경우 rowCount는 0을 반환 (동일한 값이 있을 경우 0을 반환한다.)
            $sql = "UPDATE ". $tbl_name . " SET e_active = :e_active WHERE e_idx = :e_idx";
            try{
                // PDO 준비
                $stmt = $event_conn->prepare($sql);
                $stmt->bindValue(":e_idx", $e_idx, PDO::PARAM_INT);
                $stmt->bindValue(":e_active", $e_active, PDO::PARAM_STR);
                $stmt->execute();
                if ($stmt !== false){
                    if ($stmt->rowCount() == 0){
                        $tmp_json["value"] = "error";
                        $tmp_json["desc"] = "update : " . pdo_debugStrParams($stmt, $IS_DEBUG);
                        $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        echo($return_data);
                    }
                    else{      
                        $tmp_json["value"] = "ok";
                        $tmp_json["desc"] = "update : toggle event : " . $e_active;
                        $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        echo($return_data);
                            
                    }
                }
                else{
                    $tmp_json["value"] = "error";
                    $tmp_json["desc"] = '쿼리 실행 처리 오류';
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);       
                }
            }
            catch(PDOException $e){
                $tmp_json["value"] = "error";
                $tmp_json["desc"] = $e->getMessage();
                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
            break;
            case "update_email" :
                $sql = "INSERT INTO ". $tbl_name . " (email) VALUES (:e_email)";
                try{
                    // 트랜잭션 준비
                    //$event_conn->beginTransaction();
                    // PDO 준비
                    $stmt = $event_conn->prepare($sql);
                    // 파라미터 바인딩, ?로 할 경우 bindValue로 
                    $stmt->bindParam(":e_email", $e_email, PDO::PARAM_STR);
    
                    $stmt->execute();
                    //$stmt->debugDumpParams();
                    // 실행이 성공하면
                    $count = $stmt->rowCount();
                if ( $count > 0){
                    $tmp_json["value"] = "ok";
                    $tmp_json["desc"] = "write";
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);      
                }
                // 실패하면
                else{
                    $tmp_json["value"] = "error";
                    $tmp_json["desc"] = pdo_debugStrParams($stmt, $IS_DEBUG);
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);      
                }
                }
                catch(PDOException $e){
                    $tmp_json["value"] = "error";
                    $tmp_json["desc"] = $e->getMessage();
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);      
                }
                break;
        default:
            break;
        }
    $user_conn=null;
    $event_conn=null;
/*
case "test" :
            $sql = "INSERT INTO event (e_data) VALUES" ;
            $sql = $sql . "(:e_data)";
            try{
                // PDO 준비
                $stmt = $event_conn->prepare($sql);
                // 파라미터 바인딩, ?로 할 경우 bindValue로 

                $stmt->bindParam(":e_data", $e_data, PDO::PARAM_STR);
                $stmt->execute();
                //$stmt->debugDumpParams();
                // 실행이 성공하면
                $count = $stmt->rowCount();
                if ( $count > 0){
                    $tmp_json["value"] = "ok";
                    $tmp_json["desc"] = "write";
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);      
                }
                // 실패하면
                else{
                    $tmp_json["value"] = "fail";
                    $tmp_json["desc"] = pdo_debugStrParams($stmt, $IS_DEBUG);
                    $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    echo($return_data);      
                }
            }
            catch(PDOException $e){
                $tmp_json["value"] = "fail";
                $tmp_json["desc"] = $e->getMessage();
                $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                echo($return_data);      
            }
            break;   
        case "test_load" :
              $sql = "SELECT * FROM event WHERE e_idx = 24"; 
              // 테이블로부터 모든 칼럼정보를 구하는 구문
              //$sql = "SELECT * FROM " . $tbl_name; 
              // 테이블의 cs_idx의 개수를 구하는 구문
              $sql = "SELECT (e_idx) as net FROM event WHERE e_idx = 24"; 
    
              try{
                  // 준비하시고
                  $stmt = $event_conn->prepare($sql_count);
                  // 실행
                  $stmt->execute();
                  // 결과
                  $totcount = $stmt->fetchColumn();
    
                  $stmt = $event_conn->prepare($sql);
                  $stmt->execute();
                  //print_r($stmt->debugDumpParams());
                  while($row = $stmt->fetchAll(PDO::FETCH_ASSOC))
                  {
                      $data_array = $row;
                  }   
                  
                  $result_data = array("totcount"=>$totcount, "nowpage"=>$nowpage);
                  $result_data["tabledata"] = $data_array;
                  $return_data = json_encode($result_data, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                  echo($return_data);      
              }
              catch(PDOException $e){
                  $tmp_json["value"] = "fail";
                  $tmp_json["desc"] = $e->getMessage();
                  $return_data = json_encode($tmp_json, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                  echo($return_data);      
              }
              break;
*/                  
?>

