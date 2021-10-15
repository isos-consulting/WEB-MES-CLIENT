/** 날짜선택기 속성 인터페이스 */
export default interface IDatePickerProps extends IDatepickerStyles {
  /** 날짜 선택기 아이디 */
  id: string;

  name?: string;

  /** 날짜 선택기 유형 */
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year' | 'time';

  /** 날짜 선택기 포맷 (기본값:YYYY-MM-DD) */
  format?: string;

  /** 라벨 */
  label?: string;

  /** 빈값 상태일때 표시될 설명 */
  placeholder?: string;

  /** 값 */
  value?: any;

  /** 기본값 */
  defaultValue?: string | any;

  /** 중요여부 */
  important?: boolean;

  /** 비허용(잠금)여부 */
  disabled?: boolean;
  
  /** 날짜 변경 이벤트 */
  onChange?: (e) => void;//(value: any | null, dateString: string) => void;
}


/** 날짜선택기 스타일 인터페이스 */
export interface IDatepickerStyles {
  /** 날짜 선택기 너비 유형 */
  widthSize?: 'default' | 'auto' | 'flex';
}