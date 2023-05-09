import { TDataSettingOpionsReturn } from '../input-groupbox';

/** 콤보박스 속성 인터페이스 */
export default interface IComboboxProps extends IComboboxPropsStyles {
  /** 콤보박스 아이디 */
  id: string;

  name?: string;

  value?: string;
  /** 라벨 */
  label?: string;

  /** 콤보박스 리스트 배열 */
  options: IComboboxItem[];

  /** 기본 선택값 */
  defaultValue?: string;
  /** 기본 선택값 */
  defaultText?: string;

  /** 중요 여부 */
  important?: boolean;

  /** 비허용(잠금) 여부 */
  disabled?: boolean;

  firstItemType?: TComboFirstItemType;

  /** 콤보박스 값 변경 이벤트 */
  onChange?: (value: any, option: any) => void;

  /** 서버 데이터로 콤보박스 리스트를 구성하기 위한 요소 */
  dataSettingOptions?:
    | TDataSettingOpionsReturn
    | Promise<TDataSettingOpionsReturn>;
}

export type TComboFirstItemType = 'none' | 'empty' | 'all' | undefined;

/** 콤보박스 리스트 값 인터페이스 */
export interface IComboboxItem {
  /** 숨은 값 */
  code: string;

  /** 보여줄 값 */
  text: string;

  /** 비허용(잠금) 여부 */
  disabled?: boolean;
}

export interface IComboboxPropsStyles {
  widthSize?: 'default' | 'auto' | 'flex';
  fontSize?: 'default' | 'large';
}
