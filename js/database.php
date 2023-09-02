  <?php
    // 데이터베이스 연결을 위한 class 생성

    class DatabaseService {

      private $db_host;
      private $db_name;
      private $db_user;
      private $db_user_password;
      private $db_charset;

      private $connection;

      public function __construct(string $db_host, string $db_user, string $db_user_password, string $db_name, string $db_charset = "utf8"){
          $this->db_host = $db_host;
          $this->db_user = $db_user;
          $this->db_user_password = $db_user_password;
          $this->db_name = $db_name;
          $this->db_charset = $db_charset;

      }

      public function getConnection(){
          try{
          // PDO(PHP Data Objects)는 여러 종류의 데이터베이스를 같은 방식으로 사용 가능하게 해줌
          // PDOStatement와 데이터 바인딩을 통해 SQL 인젝션을 막아주고, 성능을 향상
          /*
              // 쿼리를 담은 PDOStatement 객체 생성
              $stmt = $pdo -> prepare("SELECT * FROM girl_group WHERE name = :name");
              // PDOStatement 객체가 가진 쿼리의 파라메터에 변수 값을 바인드
              $stmt -> bindValue(":name", "나연");
              // PDOStatement 객체가 가진 쿼리를 실행
              $stmt -> execute();
              // PDOStatement 객체가 실행한 쿼리의 결과값 가져오기
              $row = $stmt -> fetch();
              $print_r($row);
          */
              $db_dsn = "mysql:host=$this->db_host;dbname=$this->db_name;charset=$this->db_charset";
              $this->connection = new PDO ($db_dsn, $this->db_user, $this->db_user_password);
              // DB한글 깨짐 처리
              $this->connection->exec('SET NAMES utf8'); 
              $this->connection->exec('SET session character_set_connection=utf8'); 
              $this->connection->exec('SET session character_set_results=utf8'); 
              $this->connection->exec('SET session character_set_client=utf8'); 
          }catch(PDOException $exception){
              echo "Connection Failed : " . $exception->getMessage();
          }
          return $this->connection;
      }
    }

    // 이벤트 스케쥴러 등록 - MySQL
    /* information_schema의 EVENTS 정보에 저장
      CREATE EVENT eventActiveUpdate
        ON SCHEDULE 
        EVERY 1 DAY  # 매일 반복 실행, EVERY 1 MONTH -> 한달에 한번 실행, EVERY 1 YEAR -> 1년에 한번 반복 실행
        STARTS '2023-02-05 00:00:00'
        DO CALL update_active_event();
    */        
?>