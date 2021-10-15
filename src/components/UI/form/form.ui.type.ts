import {FormInstance} from 'antd';

/** 폼 속성 인터페이스 */
export default interface IFormProps {
  /** 폼 객체 값 */
  form?: FormInstance<any>;

  /** 폼 이름 */
  name?: string;

  /** 폼 레이아웃 유형 */
  layout: 'horizontal' | 'inline' |  'vertical';

  /** 폼 아이템 */
  formItem?: any;
}