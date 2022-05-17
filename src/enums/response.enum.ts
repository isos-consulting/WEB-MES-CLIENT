// 📌 공통 Success, Error 상태 코드 정의(0000 ~ 4999)

type TSuccessState = {
  READ: '0000'; // 📌 데이터 조회 성공
  CREATE: '0001'; // 📌 데이터 생성 성공
  UPDATE: '0002'; // 📌 데이터 수정 성공
  PATCH: '0003'; // 📌 데이터 일부 수정 성공
  DELETE: '0004'; // 📌 데이터 삭제 성공
  HEALTH_CHECK: '0005'; // 📌 Health Check 성공
  PUBLISHED_TOKEN: '0006'; // 📌 토큰 발행 성공
};
const successState: TSuccessState = {
  READ: '0000', // 📌 데이터 조회 성공
  CREATE: '0001', // 📌 데이터 생성 성공
  UPDATE: '0002', // 📌 데이터 수정 성공
  PATCH: '0003', // 📌 데이터 일부 수정 성공
  DELETE: '0004', // 📌 데이터 삭제 성공
  HEALTH_CHECK: '0005', // 📌 Health Check 성공
  PUBLISHED_TOKEN: '0006', // 📌 토큰 발행 성공
};

type TErrorState = {
  NO_DATA: '0000'; // 📌 영향받은 데이터가 없음
  NO_INPUT_REQUIRED_PARAM: '0001'; // 📌 데이터 조회시 필수 Parameter 값이 입력되지 않음
  INVALID_READ_PARAM: '0002'; // 📌 데이터 조회시 잘못된 Parameter 값이 입력 되었음
  NO_INPUT_REQUIRED_VALUE: '0003'; // 📌 데이터 생성, 수정, 삭제시 필수 값이 입력되지 않음
  VIOLATE_UNIQUE_CONSTRAINT: '0004'; // 📌 데이터 생성, 수정, 삭제시 고유 값 입력 제약조건을 위반함
  INVALID_DATA_TYPE: '0005'; // 📌 잘못된 데이터 타입이 입력 되었음
  VIOLATE_FOREIGN_KEY_CONSTRAINT: '0006'; // 📌 데이터 생성, 수정, 삭제시 외래키 입력 제약조건을 위반함
  NO_TOKEN: '0007'; // 📌 토큰 정보가 없음
  INVALID_TOKEN: '0008'; // 📌 잘못된 토큰정보가 입력되었음
  NOT_FOUND_USER: '0009'; // 📌 사용자가 유효하지 않음
  EXPIRED_ACCESS_TOKEN: '0010'; // 📌 Access 토큰정보가 만료되었음
  EXPIRED_REFRESH_TOKEN: '0011'; // 📌 Refresh 토큰정보가 만료되었음
  NOT_EXPIRED_ACCESS_TOKEN: '0012'; // 📌 Access 토큰정보가 만료되지 않았음
  INVALID_DIFF_DATE: '0013'; // 📌 시작일자 데이터가 종료일자 데이터보다 늦음
  EMPTY_FILE_IN_TEMP_STORAGE: '0014'; // 📌 Temp Storage에 파일이 존재 하지 않음
  EMPTY_FILE_IN_REAL_STORAGE: '0015'; // 📌 Real Storage에 파일이 존재 하지 않음
  FAILED_UPLOAD_FILE: '0016'; // 📌 파일업로드 요청 중 문제가 발생되었음
  FAILED_DELETE_FILE: '0017'; // 📌 파일삭제 요청 중 문제가 발생되었음
  FAILED_SAVE_TO_RELATED_DATA: '0018'; // 📌 관련된 데이터로 인하여 데이터 저장 실패
  INVALID_DUP_DATA: '0019'; // 📌 중복된 데이터가 존재
  INVALID_DATA: '0020'; // 📌 잘못된 데이터가 입력되었음
  NOT_ENOUGH_STOCK: '0021'; // 📌 재고수량이 부족함
};

const errorState: TErrorState = {
  NO_DATA: '0000', // 📌 영향받은 데이터가 없음
  NO_INPUT_REQUIRED_PARAM: '0001', // 📌 데이터 조회시 필수 Parameter 값이 입력되지 않음
  INVALID_READ_PARAM: '0002', // 📌 데이터 조회시 잘못된 Parameter 값이 입력 되었음
  NO_INPUT_REQUIRED_VALUE: '0003', // 📌 데이터 생성, 수정, 삭제시 필수 값이 입력되지 않음
  VIOLATE_UNIQUE_CONSTRAINT: '0004', // 📌 데이터 생성, 수정, 삭제시 고유 값 입력 제약조건을 위반함
  INVALID_DATA_TYPE: '0005', // 📌 잘못된 데이터 타입이 입력 되었음
  VIOLATE_FOREIGN_KEY_CONSTRAINT: '0006', // 📌 데이터 생성, 수정, 삭제시 외래키 입력 제약조건을 위반함
  NO_TOKEN: '0007', // 📌 토큰 정보가 없음
  INVALID_TOKEN: '0008', // 📌 토큰이 유효하지 않음
  NOT_FOUND_USER: '0009', // 📌 사용자가 유효하지 않음
  EXPIRED_ACCESS_TOKEN: '0010', // 📌 Access 토큰정보가 만료되었음
  EXPIRED_REFRESH_TOKEN: '0011', // 📌 Refresh 토큰정보가 만료되었음
  NOT_EXPIRED_ACCESS_TOKEN: '0012', // 📌 Access 토큰정보가 만료되지 않았음
  INVALID_DIFF_DATE: '0013', // 📌 시작일자 데이터가 종료일자 데이터보다 늦음
  EMPTY_FILE_IN_TEMP_STORAGE: '0014', // 📌 Temp Storage에 파일이 존재 하지 않음
  EMPTY_FILE_IN_REAL_STORAGE: '0015', // 📌 Real Storage에 파일이 존재 하지 않음
  FAILED_UPLOAD_FILE: '0016', // 📌 파일업로드 요청 중 문제가 발생되었음
  FAILED_DELETE_FILE: '0017', // 📌 파일삭제 요청 중 문제가 발생되었음
  FAILED_SAVE_TO_RELATED_DATA: '0018', // 📌 관련된 데이터로 인하여 데이터 저장 실패
  INVALID_DUP_DATA: '0019', // 📌 중복된 데이터가 존재
  INVALID_DATA: '0020', // 📌 잘못된 데이터가 입력되었음
  NOT_ENOUGH_STOCK: '0021', // 📌 재고수량이 부족함
};

export { successState, errorState };
