<?php

include_once 'global.php';
include_once 'function.php';

/* 한글로 전달된 파일일 경우의 처리를 위해 */
setlocale(LC_ALL,'ko_KR.UTF-8');

Header('Content-Type: application/json');

// 파일이 전송될 경우 처리
$upload_direct = "../file/";
$b_file = "";
// 결과 리턴 객체
$result_array = array();

/*
if(isset($_FILES["uploadfile"]))
{
  if (!is_array($_FILES["uploadfile"]['name']))
  {
    if (is_uploaded_file($_FILES['uploadfile']['tmp_name'])){
        echo "<h2>파일정보</h2>";
        echo "<p>업로드한 파일명 : " . $_FILES['uploadfile']['name'] . "</p>";
        echo "<p>업로드한 확장자 (mime type) : " . $_FILES['uploadfile']['type'] . "</p>";
        echo "<p>업로드한 파일크기 (byte) : " . $_FILES['uploadfile']['size'] . "</p>";
        echo "<p>임시 디렉토리에 저장된 파일 : " . $_FILES['uploadfile']['tmp_name'] . "</p>";
        echo "<p>업로드 과정에서 나타난 에러코드 : " . $_FILES['uploadfile']['error'] . "</p>";
    }
  }
  else{
    $fileCount = count($_FILES["uploadfile"]['name']);
    for($i=0; $i<$fileCount; $i++)
    {
        echo "<h2>파일정보</h2>";
        echo "<p>업로드한 파일명 : " . $_FILES['uploadfile']['name'][$i] . "</p>";
        echo "<p>업로드한 확장자 (mime type) : " . $_FILES['uploadfile']['type'][$i] . "</p>";
        echo "<p>업로드한 파일크기 (byte) : " . $_FILES['uploadfile']['size'][$i] . "</p>";
        echo "<p>임시 디렉토리에 저장된 파일 : " . $_FILES['uploadfile']['tmp_name'][$i] . "</p>";
        echo "<p>업로드 과정에서 나타난 에러코드 : " . $_FILES['uploadfile']['error'][$i] . "</p>";
    }
  }
}
die();
*/
function exception_error_handler($errno, $errstr, $errfile, $errline) {
    echo "error detected";
}

// 업로드 폴더명 : 고객사 IDX
$eventdir = fn_URIString('eventdir', "string", "tmp");
// 업로드 파일 중복을 피하기 위한 타임스탬프
$uploadstamp = fn_URIString('uploadstamp', "string", "");
$upload_direct = $upload_direct . $eventdir . '/';

// 업로드 디렉토리를 체크 후 존재하지 않을 경우 생성한다.
set_error_handler("exception_error_handler");

if (!file_exists($upload_direct)) {
    try {
        mkdir($upload_direct, 0755, true);
    } catch (ErrorException $ex) {
        $result_array["value"] = 0;
        $result_array["error"]["message"] = $ex->getMessage() . ' (' . ERR_UPLOAD_MESSAGE[8] . ':' . $upload_direct . ')';
        echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
        die();
    }
}
restore_error_handler();


/*
업로드 파일에 대한 제한 크기를 설정한다. (클라이언트에서도 체크)
$content_length = isset($_SERVER['CONTENT_LENGTH']) ? $_SERVER['CONTENT_LENGTH'] : 0;
// php.ini 파일에 설정된 정보를 확인한다. (php.ini 파일내 post_max_size, upload_max_filesize, max_file_uplodes, max_execution_tiem, memeory_limit, max_input_time)
// 참고 자료 : https://m.blog.naver.com/woaksdl14/221924259293
$config_max_upload_size = parse_size(ini_get('post_max_size'));

if ($content_length > $config_max_upload_size) {
    $result_array["uploaded"] = 0;
    $result_array["error"]["message"] = ERR_UPLOAD_MESSAGE[0] . ' : ' . $content_length . '/' . $config_max_upload_size;
    echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
    die();
}
업로드 파일에 대한 확장자 제한 (클라이언트에서도 체크함)
*/
if(isset($_FILES["uploadfile"]))
{
    $ret = array();
    $custom_error= array();

    if (!is_array($_FILES["uploadfile"]['name']))  // 단일 파일일 경우
    {
        $upload_target_file = basename($_FILES["uploadfile"]["name"]);
        // 테이블 입력을 위한 파일명 설정
        // 한글 파일명 및 특수문자 파일 처리
        $upload_target_file = $upload_target_file;
        $upload_target_path = $upload_direct . $uploadstamp . '_' . $upload_target_file;
        // 동일한 파일명이 존재하는지 검사
        if (file_exists($upload_target_path)) {
            $result_array["value"] = "fail";
            $result_array["FileExist"] = $upload_target_file;
            echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
            die();
        }
        else{
            try {
                if (move_uploaded_file($_FILES["uploadfile"]["tmp_name"], $upload_target_path)) {
                    $b_file = $upload_target_file;
                } 
                else {
                    if (UPLOAD_ERR_OK != $_FILES['uploadfile']['error']) {
                        switch ($_FILES['uploadfile']['error']) {
                            case UPLOAD_ERR_INI_SIZE:
                                $rtnMessage = ERR_UPLOAD_MESSAGE[0];
                                break;
                            case UPLOAD_ERR_FORM_SIZE:
                                $rtnMessage = ERR_UPLOAD_MESSAGE[1];
                                break;
                            case UPLOAD_ERR_PARTIAL:
                                $rtnMessage = ERR_UPLOAD_MESSAGE[3];
                                break;
                            case UPLOAD_ERR_NO_FILE:
                                $rtnMessage = ERR_UPLOAD_MESSAGE[4];
                                break;
                            case UPLOAD_ERR_NO_TMP_DIR:
                                $rtnMessage = ERR_UPLOAD_MESSAGE[5];
                                break;
                            case UPLOAD_ERR_CANT_WRITE:
                                $rtnMessage = ERR_UPLOAD_MESSAGE[6];
                                break;
                            case UPLOAD_ERR_EXTENSION:
                                $rtnMessage = ERR_UPLOAD_MESSAGE[7];
                                break;
                            default:
                                $rtnMessage = sprintf(ERR_UPLOAD_MESSAGE[12], 1, "");
                                break;
                        }
                        $result_array["value"] = "error";      
                        $result_array["desc"] = $rtnMessage;
                        echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        die();
                    } else {
                        $result_array["value"] = "error";      
                        $error = error_get_last();
                        $result_array["desc"] = sprintf(ERR_UPLOAD_MESSAGE[12], 2, $error['message']);
                        echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        die();
                    }
                }
            } catch (Exception $e) {
                $result_array["value"] = "error";      
                $result_array["desc"] = sprintf(ERR_UPLOAD_MESSAGE[12], 2, $e->getMessage());
                echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                die();
            }
        }
        $result_array["value"] = "ok";        
        $result_array["desc"] = "$b_file";        
        echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
    }
    else
    {
        $fileCount = count($_FILES["uploadfile"]['name']);
        for($i=0; $i<$fileCount; $i++)
        {
            $upload_target_file = basename( $_FILES["uploadfile"]["name"][$i]);
            // 특수 문자 및 한글 처리
            $upload_target_file = $upload_target_file;
            $upload_target_path = $upload_direct . $uploadstamp . '_' . $upload_target_file;
            if (file_exists($upload_target_path)) {
                $result_array["value"] = "error";     
                $result_array["FileExist"] = $upload_target_file;
                echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                die();
            } else {
                try {
                    if (move_uploaded_file($_FILES["uploadfile"]["tmp_name"], $upload_target_path)) {
                        if ($b_file == ""){
                            $b_file = $upload_target_file;
                        }
                        else{
                            $b_file = $b_file . "|" . $upload_target_file;
                        }
                        //$result_array["File01"] = $userdir . '/' . $type . '/' . $upload_target_file;
                        //echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                        //die();
                    } else {
                        if (UPLOAD_ERR_OK != $_FILES['uploadfile']['error']) {
                            switch ($_FILES['uploadfile']['error']) {
                                case UPLOAD_ERR_INI_SIZE:
                                    $rtnMessage = ERR_UPLOAD_MESSAGE[0];
                                    break;
                                case UPLOAD_ERR_FORM_SIZE:
                                    $rtnMessage = ERR_UPLOAD_MESSAGE[1];
                                    break;
                                case UPLOAD_ERR_PARTIAL:
                                    $rtnMessage = ERR_UPLOAD_MESSAGE[3];
                                    break;
                                case UPLOAD_ERR_NO_FILE:
                                    $rtnMessage = ERR_UPLOAD_MESSAGE[4];
                                    break;
                                case UPLOAD_ERR_NO_TMP_DIR:
                                    $rtnMessage = ERR_UPLOAD_MESSAGE[5];
                                    break;
                                case UPLOAD_ERR_CANT_WRITE:
                                    $rtnMessage = ERR_UPLOAD_MESSAGE[6];
                                    break;
                                case UPLOAD_ERR_EXTENSION:
                                    $rtnMessage = ERR_UPLOAD_MESSAGE[7];
                                    break;
                                default:
                                    $rtnMessage = sprintf(ERR_UPLOAD_MESSAGE[12], 1, "");
                                    break;
                            }
                            $result_array["value"] = "error";     
                            $result_array["desc"] = $rtnMessage;
                            echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                            die();
                        } else {
                          $result_array["value"] = "error";     
                            $error = error_get_last();
                            $result_array["desc"] = sprintf(ERR_UPLOAD_MESSAGE[12], 2, $error['message']);
                            echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                            die();
                        }
                    }
                } catch
                
                (Exception $e) {
                    $result_array["value"] = "error";     
                    $result_array["ERROR"] = sprintf(ERR_UPLOAD_MESSAGE[12], 2, $e->getMessage());
                    echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
                    die();
                }
            }
        }
        $result_array["value"] = "ok";        
        $result_array["desc"] = $b_file;        
        echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
    }
}
else{
  $result_array["value"] = "fail";        
  $result_array["desc"] = "파일 객체가 존재하지 않습니다.";        
  echo json_encode($result_array, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT);
}
?>