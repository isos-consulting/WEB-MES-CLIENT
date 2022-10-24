import Colors from '~styles/color.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import styled from 'styled-components';
import { Modal } from 'antd';

/* Modal 스타일 */
export const ScModal = styled(Modal)`
  margin-top: -45px;

  min-width: 95vw;

  //모달 푸터에 적용
  .ant-modal-footer {
    padding: 10px 20px;
  }
  //모달 제목에 적용
  .ant-modal-title {
    color: ${Colors.fg_fontColor_default};
  }
  //모달 아이콘 이미지에 적용 (닫기 버튼)
  .anticon.anticon-close.ant-modal-close-icon > svg {
    width: ${Sizes.width_modalButton_close};
    height: ${Sizes.height_modalButton_close};
    color: ${Colors.fg_fontColor_default};
  }
  //모달 내용에 적용
  div.ant-modal-body {
    padding: 12px;
  }
  // 모달 버튼에 적용
  .modalButton {
    text-align: end;
    margin: 0 10px 12px 0;
  }
`;
