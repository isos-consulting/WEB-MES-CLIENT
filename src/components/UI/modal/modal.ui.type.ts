import {ModalProps} from 'antd/lib/modal';


/** 모달 속성 인터페이스 */
export default interface IModalProps extends ModalProps {
  /** 제목 */
  title?:string | React.ReactNode;

  /** 포지티브 버튼 이벤트 */
  okText?:string;

  /** 네거티브 버튼 이벤트 */
  cancelText?:string;
  
  /** 모달 고정 너비 */
  width?:number | string;

  /** 내용 */
  children?:any;

  /** 숨김 여부 */
  visible?:boolean;

  /** 모달 바깥 클릭시 모달을 닫을것인지에 대한 여부 */
  maskClosable?: boolean;

  /** 포지티브 버튼 액션 타입 */
  okActionType?: TGridPopupAction;
}


export type TGridPopupAction = 
| 'popupSave'
| 'save' 
| 'cancel' 
| 'selectRow' 
| 'selectMultiRow' 
| 'selectGetRow';