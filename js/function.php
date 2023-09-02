<?php
    function fn_EscapeString($param, $mysqli){
        $param = htmlentities($param, ENT_QUOTES); 
        $param = mysqli_real_escape_string($mysqli, $param);               
        return $param;
    }

    function fn_URIString($param, $ptype, $pdefault){
        if ($ptype == "string"){
            $tmpStr = isset($_POST[$param]) ? $_POST[$param] : $pdefault;           
            if ($tmpStr == ""){
                $tmpStr = isset($_GET[$param]) ? $_GET[$param] : $pdefault;         
            }     
        }   
        elseif ($ptype == "int"){
            $tmpStr = isset($_POST[$param]) ? $_POST[$param] : $pdefault;           
            if ($tmpStr == ""){
                $tmpStr = isset($_GET[$param]) ? $_GET[$param] : $pdefault;         
            }        
        }
        return$tmpStr;
    }

    // PDO 디버깅 값을 스트링으로 출력하기 위해
    function pdo_debugStrParams($stmt, $isDebug) {
      if ($isDebug){
        ob_start();
        $stmt->debugDumpParams();
        $r = ob_get_contents();
        ob_end_clean();
        return $r;
      }
    }

    function generateAccessToken($pLoginID){
        return true;
    }

    function generateRefreshToken(){
        return true;
        
    }
    
    function fn_getHash(){

    }

    // 사용자 유입 경로 체크
  // 주소줄에 직접 입력해서 들어올 경우 처리 불가
  function getUserInPath(){
    if (isset($_SERVER['HTTP_REFERER'])) {
      return $_SERVER['HTTP_REFERER'];
    }
    else{
      return "알수없는 경로";
    }
  }

  // $_SERVER['HTTP_USER_AGENT']로 부터 사용자가 접속한 기기 정보를 얻어온다.
  function getUserOS(){
      $tmp = $_SERVER['HTTP_USER_AGENT'];
      if( strpos($tmp, 'iPhone') !== false ){
          return 'iOS';
      }else if(strpos($tmp, 'Android') !== false ){
          return 'Android';
      }else if(strpos($tmp, 'Mac') !== false ){
          return 'Mac';
      }else if(strpos($tmp, 'Windows') !== false ){
          return 'Windows';
      }else{
          return 'Other';
      }
  }

  function getUserBrowser(){
      $tmp = $_SERVER['HTTP_USER_AGENT'];
      if( strpos($tmp, 'Chrome') !== false ){
          return 'Chrome';
      }else if(strpos($tmp, 'CriOS') !== false ){         // 모바일일 경우 크롬
          return 'Chrome';                
      }else if(strpos($tmp, 'Edg') !== false ){
          return 'Edg';
      }else if(strpos($tmp, 'Safari') !== false ){
          return 'Safari';
      }else{
          return 'Other';
      }
  }

?>