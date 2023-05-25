export enum MESSAGE {
  PARTNER_TYPE_CREATABLE_NOT_FOUND = '등록할 거래처 유형이 없습니다.',
  PARTNER_TYPE_UPDATABLE_NOT_FOUND = '수정할 거래처 유형이 없습니다.',
  PARTNER_TYPE_DELETABLE_NOT_FOUND = '삭제할 거래처 유형이 없습니다.',
  UNIT_CONVERT_CREATABLE_NOT_FOUND = '등록할 단위 변환 정보가 없습니다.',
  UNIT_CONVERT_UPDATABLE_NOT_FOUND = '수정할 단위 변환 정보가 없습니다.',
  UNIT_CONVERT_DELETABLE_NOT_FOUND = '삭제할 단위 변환 정보가 없습니다.',
  UNIT_CONVERT_CREATE_SUCCESS = '단위 변환 정보가 등록되었습니다.',
  UNIT_CONVERT_UPDATE_SUCCESS = '단위 변환 정보가 수정되었습니다.',
  UNIT_CONVERT_DELETE_SUCCESS = '단위 변환 정보가 삭제되었습니다.',
  UNIT_CONVERT_UUID_IS_REQUIRED = '단위 변환 데이터를 입력해주세요.',
  UNIT_CONVERT_FROM_VALUE_IS_REQUIRED = '변환 전 값은 필수 입력입니다.',
  UNIT_CONVERT_TO_VALUE_IS_REQUIRED = '변환 후 값은 필수 입력입니다.',
  UNIT_CONVERT_CONVERT_VALUE_IS_REQUIRED = '변환 값은 필수 입력입니다.',
  UNIT_CONVERT_TO_UNIT_UUID_IS_REQUIRED = '변환 단위는 필수 입력입니다.',
  UNIT_CONVERT_DELETE = '단위 변환 삭제',
  UNIT_CONVERT_DELETE_QUESTION = '단위 변환 정보를 삭제하시겠습니까?',
  ROUTING_CREATABLE_NOT_FOUND = '등록할 라우팅 정보가 없습니다.',
  ROUTING_UPDATABLE_NOT_FOUND = '수정할 라우팅 정보가 없습니다.',
  ROUTING_DELETABLE_NOT_FOUND = '삭제할 라우팅 정보가 없습니다.',
  PROC_UUID_IS_REQUIRED = '공정 데이터를 입력해주세요.',
  PROC_NO_IS_REQUIRED = '공정 순서는 필수 입력입니다.',
  AUTO_WORK_FG_IS_REQUIRED = '자동 실적 처리 여부는 필수 입력입니다.',
  ROUTING_CREATE_SUCCESS = '라우팅 정보가 등록되었습니다.',
  ROUTING_UPDATE_SUCCESS = '라우팅 정보가 수정되었습니다.',
  ROUTING_DELETE_SUCCESS = '라우팅 정보가 삭제되었습니다.',
  ROUTING_UUID_IS_REQUIRED = '라우팅 데이터를 입력해주세요.',
  ROUTING_DELETE = '라우팅 삭제',
  ROUTING_DELETE_QUESTION = '라우팅 정보를 삭제하시겠습니까?',
  PRODUCTION_WORK_CREATABLE_NOT_FOUND = '등록할 생산 실적 정보가 없습니다.',
  PRODUCTION_WORK_REG_DATE_IS_REQUIRED = '실적 일시 데이터를 입력해주세요.',
  PRODUCTION_WORK_WORKINGS_UUID_IS_REQUIRED = '작업장 데이터를 입력해주세요.',
  PRODUCTION_WORK_SHIFT_UUID_IS_REQUIRED = '작업 교대 데이터를 입력해주세요.',
  PRODUCTION_WORK_TO_STORE_UUID_IS_REQUIRED = '입고 창고 데이터를 입력해주세요.',
  PRODUCTION_WORK_CREATE_SUCCESS = '생산 실적 정보가 등록되었습니다.',
  PROD_UUID_IS_REQUIRED = '품목 데이터를 입력해주세요.',
  MOLD_UUID_IS_REQUIRED = '금형 데이터를 입력해주세요.',
  MOLD_PRODUCT_CREATABLE_NOT_FOUND = '등록할 금형 품목 정보가 없습니다.',
  MOLD_PRODUCT_UPDATABLE_NOT_FOUND = '수정할 금형 품목 정보가 없습니다.',
  MOLD_PRODUCT_DELETABLE_NOT_FOUND = '삭제할 금형 품목 정보가 없습니다.',
  MOLD_PRODUCT_CREATE_SUCCESS = '금형 품목 정보가 등록되었습니다.',
  MOLD_PRODUCT_DELETE = '금형 품목 삭제',
  MOLD_PRODUCT_DELETE_QUESTION = '금형 품목 정보를 삭제하시겠습니까?',
  MOLD_PRODUCT_DELETE_SUCCESS = '금형 품목 정보가 삭제되었습니다.',
  PROD_MOLD_UUID_IS_REQUIRED = '금형 품목 데이터를 입력해주세요.',
  MATERIAL_ORDER_UPDATABLE_NOT_FOUND = '수정할 자재 발주 정보가 없습니다.',
  MATERIAL_ORDER_UPDATE_SUCCESS = '자재 발주 정보가 수정되었습니다.',
  MATERIAL_RETURN_UPDATABLE_NOT_FOUND = '수정할 자재 반품 정보가 없습니다.',
  RETURN_UUID_IS_REQUIRED = '반품 데이터를 입력해주세요.',
  STMT_NO_IS_REQUIRED = '전표 번호는 필수 입력입니다.',
  RETURN_DETAIL_UUID_IS_REQUIRED = '반품 상세 데이터를 입력해주세요.',
  QTY_IS_REQUIRED = '수량은 필수 입력입니다.',
  CONVERT_VALUE_IS_REQUIRED = '변환 값은 필수 입력입니다.',
  PRICE_IS_REQUIRED = '단가는 필수 입력입니다.',
  MONEY_UNIT_UUID_IS_REQUIRED = '화폐 단위는 필수 입력입니다.',
  EXCHANGE_IS_REQUIRED = '환율은 필수 입력입니다.',
  MATERIAL_RETURN_UPDATE_SUCCESS = '자재 반품 정보가 수정되었습니다.',
  SALES_RETURN_UPDATABLE_NOT_FOUND = '수정할 제품 반입 정보가 없습니다.',
  SALES_RETURN_UUID_IS_REQUIRED = '제품 반입 데이터를 입력해주세요.',
  SALES_RETURN_DETAIL_UUID_IS_REQUIRED = '제품 반입 상세 데이터를 입력해주세요.',
  SALES_RETURN_UPDATE_SUCCESS = '제품 반입 정보가 수정되었습니다.',
  OUT_RECEIVE_UPDATABLE_NOT_FOUND = '수정할 외주 입하 정보가 없습니다.',
  OUT_RECEIVE_UPDATE_SUCCESS = '외주 입하 정보가 수정되었습니다.',
  OUT_RECEIVE_UUID_IS_REQUIRED = '외주 입하 데이터를 입력해주세요.',
  OUT_RECEIVE_DETAIL_UUID_IS_REQUIRED = '외주 입하 상세 데이터를 입력해주세요.',
  UNIT_QTY_IS_REQUIRED = '단위 수량은 필수 입력입니다.',
  CARRY_FG_IS_REQUIRED = '이월 여부는 필수 입력입니다.',
  MAT_RECEIVE_NOT_REGISTERED = '등록된 자재 입고 정보가 없습니다.',
  MAT_RECEIVE_DELETABLE_NOT_FOUND = '삭제할 자재 입고 정보가 없습니다.',
  MAT_RECEIVE_DELETE_QUESTION = '자재 입고 정보를 삭제하시겠습니까?',
  DELETE = '삭제',
  MAT_RECEIVE_CANT_RESTORE = '삭제된 자재 입고 정보는 복원할 수 없습니다.',
  MAT_RECEIVE_DETAIL_DELETE_SUCCESS = '자재 입고 상세 정보가 삭제되었습니다.',
  MAT_RECEIVE_CREATE = '자재 입고 등록',
  PARTNER_UUID_IS_REQUIRED = '거래처 데이터를 입력해주세요.',
  PARTNER_NAME_IS_REQUIRED = '거래처명은 필수 입력입니다.',
  MAT_RECEIVE_REG_DATE_IS_REQUIRED = '입고 일시는 필수 입력입니다.',
  MAT_RECEIVE_CREATE_SUCCESS = '자재 입고 정보가 등록되었습니다.',
  MAT_RECEIVE_UPDATE_SUCCESS = '자재 입고 정보가 수정되었습니다.',
  ORDER_DETAIL = '발주 상세',
  MAT_RECEIVE_IS_SELECT = '자재 입고 정보를 선택해주세요.',
  MAT_RECEIVE_DETAIL_CREATE = '자재 입고 상세 등록',
  MAT_RECEIVE_DETAIL_UPDATE = '자재 입고 상세 수정',
  QUALITY_INSPECT_REPORT_UPDATABLE_NOT_FOUND = '수정할 검사 기준서 정보가 없습니다.',
  POSITION_NO_IS_REQUIRED = '위치 번호는 필수 입력입니다.',
  SPEC_STD_IS_REQUIRED = '검사 기준은 필수 입력입니다.',
  QUALITY_INSPECT_REPORT_UPDATE_SUCCESS = '검사 기준서 정보가 수정되었습니다.',
  QUALITY_INSPECT_REPORT_AMENDABLE_NOT_FOUND = '개정할 검사 기준서 정보가 없습니다.',
  QUALITY_INSPECT_REPORT_AMEND_SUCCESS = '검사 기준서 정보가 개정되었습니다.',

  EQUIPMENT_INSPECT_REPORT_UPDATABLE_NOT_FOUND = '수정할 설비 검사 기준서 정보가 없습니다.',
  EQUIPMENT_INSPECT_REPORT_UPDATE_SUCCESS = '설비 검사 기준서 정보가 수정되었습니다.',
  EQUIPMENT_INSPECT_REPORT_DELETABLE_NOT_FOUND = '삭제할 설비 검사 기준서 정보가 없습니다.',
  EQUIPMENT_INSPECT_REPORT_DELETE_SUCCESS = '설비 검사 기준서 정보가 삭제되었습니다.',
}
