/** 팝 오버 속성 인터페이스 */
export default interface IPopoverProps {
  /** 제목 */
  title?: string;

  /** 내용 */
  content?: any;

  /** 버튼 글자 */
  btnText?: string;

  /** 버튼 객체 */
  btnComponent?: any;

  /** 동작 유형 */
  trigger?: 'hover' | 'click';

  /** 표시될 방향 */
  placement?:
    | 'leftTop'
    | 'left'
    | 'leftBottom'
    | 'topLeft'
    | 'top'
    | 'topRight'
    | 'rightTop'
    | 'right'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottom'
    | 'bottomRight';
}
