import { message } from 'antd';

export const showWorkPerformanceErrorMessage = type => {
  switch (type) {
    case '하위이력작업시도':
      return message.warn('작업이력을 선택한 후 다시 시도해주세요.');
    case '공정순서이력작업시도':
      return message.warn('공정순서를 선택한 후 다시 시도해주세요.');
    case '완료된작업시도':
      return message.warn('이미 완료된 작업은 수정할 수 없습니다.');
    default:
      break;
  }
};
