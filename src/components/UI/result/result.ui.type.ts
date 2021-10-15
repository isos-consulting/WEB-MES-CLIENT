import { ResultStatusType } from 'antd/lib/result';


/** 결과 디스플레이 속성 인터페이스 */
export default interface IResultProps {
  /** 컴포넌트 유형 */
  type: 'custom' | 'loadFailed';

  /** 표시하고 싶은 상태 유형 */
  status?: ResultStatusType;

  /** 제목 */
  title?: string;

  /** 부제목(설명) */
  subTitle?: string;
}