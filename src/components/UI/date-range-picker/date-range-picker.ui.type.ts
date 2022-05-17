import IDatePickerProps from '../date-picker/date-picker.ui.type';

/** 날짜 기간 선택기 속성 인터페이스 */
export default interface IDateRangepPickerProps
  extends Omit<IDatePickerProps, 'id' | 'placeholder' | 'defaultValue'> {
  /** 날짜 선택기 아이디 배열 */
  ids: string[];
  names?: string[];

  /** 빈값일때 들어갈 설명 배열 */
  placeholders?: string[];

  /** 기본 값 배열 */
  defaultValues?: any[];

  values?: any[];

  onChanges?: ((e) => void)[];

  //❗❗❗❗ inputGroupbox안에서 사용할때 초기값이 적용 안돼서 임시로 넣음, 해결되면 빼야함
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
}
