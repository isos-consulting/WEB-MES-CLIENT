import styled from 'styled-components';
import Colors from '~styles/color.style.module.scss';
import Fonts from '~styles/font.style.module.scss';
import Sizes from '~styles/size.style.module.scss';

export const ScContainer = styled.div`
  //로그인 비밀번호 label 밑
  .ant-col.ant-form-item-label {
    padding: 0;
    padding-bottom: 8px;
  }

  .ant-typography {
    font-size: ${Fonts.fontSize_loginLabel} !important;
  }

  //체크박스
  .ant-checkbox-inner,
  .ant-checkbox-checked .ant-checkbox-inner {
    border-radius: ${Sizes.borderRadius_common};
    margin-left: 5px;
    border-color: ${Colors.bg_chkeckBox_border};
  }

  //체크박스
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${Colors.bg_chkeckBox_selectedInner};
  }
  .ant-checkbox-input {
    border: none;
  }
  a:hover {
    color: ${Colors.bg_chkeckBox_selectedInner};
  }

  .ant-checkbox-checked::after {
    border: none;
  }

  //아이디 비밀번호 label
  .ant-form-vertical .ant-form-item-label > label {
    font-size: ${Fonts.fontSize_loginLabel};
    color: ${Colors.fg_loginLabel_default};
    margin-left: 5px;
  }

  & {
    .ant-input-affix-wrapper {
      background-color: ${Colors.bg_loginInput_wrapper};
      & > .ant-input {
        background-color: inherit;
      }
    }
  }
`;

export const ScImg = styled.img`
  width: 100%;
`;

export const ScFooter = styled.p`
  position: absolute;
  font-size: ${Fonts.fontSize_loginFooter};
  color: ${Colors.fg_loginFooter_default};
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
`;

export const ScFindAccountText = styled.a`
  margin-left: 120px;
  text-align: right;
  display: block;
  color: inherit;
  font-size: ${Fonts.fontSize_loginLabel};
`;
