export enum SENTENCE {
  FAVORITE = '즐겨찾기 추가됨',
  UNFAVORITE = '즐겨찾기 삭제됨',
  RESET_PASSWORD = '비밀번호 초기화됨',
  IS_RESET_PASSWORD = '비밀번호를 초기화 하시겠습니까?',
  DONE_RESET_PASSWORD = '비밀번호가 초기화되었습니다',
  INPUT_PASSWORD = '비밀번호를 입력해주세요',
  ADD_RECORD = '신규 항목 추가',
  SAVE_DATA = '저장하기',
  SAVE_CONFIRM = '정보를 저장하시겠습니까?',
  SAVE_COMPLETE = '저장이 완료되었습니다',
  DELETE_CONFIRM = '삭제하시겠습니까?',
  DELETE_COMPLETE = '삭제가 완료되었습니다',
  NO_DELETE_ITEMS = '삭제할 항목이 없습니다',
  NO_SELECTED_WORK_TYPE = '근무 유형을 선택해주세요',
  ONLY_NUMBER = '숫자만 입력해주세요',
  EDIT_CONFIRM = '수정하시겠습니까?',
  EDIT_COMPLETE = '수정이 완료되었습니다',
  SELECT_RECORD = '항목을 선택해주세요',
  EXCEL_UPLOAD = '엑셀 업로드',
  EXCEL_DOWNLOAD = '엑셀 다운로드',
  OVER_8 = '8자리 이상 입력해주세요',
  UNDER_16 = '16자리 이하 입력해주세요',
  INCLUDE_COMBINATION_2 = '영문 소문자, 숫자, 특수문자 중 2종을 조합을 포함해야 합니다.',
  CHECK_SHEET_IS_VALID_UPLOAD = '업로드할 엑셀 파일을 확인해주세요',
  SELECT_SHEET_BEFORE_UPLOAD = '업로드할 엑셀 파일을 선택해주세요',
  CLICK_DATA_VALIDATION_BUTTON_BEFORE_UPLOAD = '데이터 검증 버튼을 클릭해주세요',
  CHECK_ERROR_COLUMN_CAUSED_BY_INVALID_DATA = '데이터 검증 결과 오류가 발생한 열을 확인해주세요',
  UPLOAD_COMPLETE = '업로드가 완료되었습니다',
  WORK_PLAN_LOAD = '생산계획 불러오기',
  PLEASE_DO_WORK_PLAN_LOAD = '통합 작업지시 등록 화면은 "생산계획 불러오기" 기능을 이용해주세요',
  PROD_ORDER_REGISTER = '작업지시 등록',
  CHILD_PROD_ORDER_REGISTER = '하위작업지시 등록',
  LOADING_PERMISSION_INFO = '권한 정보를 불러오는 중입니다',
  ERROR_OCCURRED = '오류가 발생했습니다',
  BEFORE_INPUT_WORK_AND_ADD_RECORD = '공정검사 이력을 선택한 후 추가 버튼을 눌러주세요',
  BEFORE_SELECT_INSP_REPORT_AND_EDIT = '검사 성적서를 선택하고 수정 버튼을 눌러주세요',
  BEFORE_SELECT_INSP_REPORT_AND_DELETE = '검사 성적서를 선택하고 삭제 버튼을 눌러주세요',
  CONFIRM_TO_INSP_REPORT_DELETE = '검사 성적서를 삭제하시겠습니까?',
  INPUT_INSPECTOR = '검사자를 입력해주세요',
  INPUT_INSPECT_TIME = '검사 시간을 입력해주세요',
  INPUT_INSPECT_DATE = '검사 일자를 입력해주세요',
  EXIST_INSPECT_MISSING_VALUE = '결측치가 존재합니다. 확인 후 다시 저장해주세요',
  CANNOT_FOUND_INSP_REPORT_RESULT_VALUE_TO_SAVE_OPTION = '검사성적서 결과값 전체등록 여부 옵션을 찾을 수 없습니다',
  INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT = '검사 결과값을 시료 수 만큼 입력해주세요',
  CONFIRM_TO_SAVE_NOT_INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT = '검사 결과값을 시료 수 만큼 입력하지 않았습니다. 저장하시겠습니까?',
  UNKNOWN_ERROR_OCCURRED_WHEN_SAVE_INSP_REPORT = '검사 성적서 저장 중 알 수 없는 오류가 발생했습니다',
  DO_ADD_DATA = '데이터 추가하기',
  DO_UPDATE_DATA = '데이터 수정하기',
  CHECK_YOUR_ADAPTABLE_INSPECT_BASE_REPORT = '적용중인 검사 기준서가 없습니다. 기준서를 확인 후 다시 시도해주세요.',
  BEFORE_INPUT_HANDLING_TYPE = '처리유형을 입력해주세요',
  INSPECT_RESULT_FLAG_TRUE_CAN_BE_INCOME = '검사 결과가 "합격"일 경우 입고가 가능합니다',
  BEFORE_INPUT_INCOME_STORE = '입고 창고를 입력해주세요',
  BEFORE_INPUT_REJECT_TYPE = '불량유형을 입력해주세요',
  BEFORE_INPUT_REJECT_STORE = '불량 창고를 입력해주세요',
  RECEIVE_QTY_OVER_THEN_INCOME_QTY = '판정 수량이 입고 수량보다 많습니다. 확인 후 다시 시도해주세요',
}
