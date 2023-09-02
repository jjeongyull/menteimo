<?php
  session_start();        

  // 세션 초기화
  unset($_SESSION["logined"]);

  session_unset();        // 현재 연결된 세션에 등록되어 있는 모든 변수의 값을 삭제한다 (개별처리 : unset($_SESSION["Variable"]);
  session_destroy();      // 세션해제함
?>
