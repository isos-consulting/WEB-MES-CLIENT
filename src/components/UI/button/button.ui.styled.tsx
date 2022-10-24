import React from 'react';
import Colors from '~styles/color.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import Fonts from '~styles/font.style.module.scss';
import styled from 'styled-components';
import { Button } from 'antd';
import { IButtonStyles } from './button.ui.type';

console.log({ Colors });
// styled컴포넌트의 틀이되는 base컴포넌트
// (antd>button에는 커스텀한 property들이 들어가면 에러가 발생하기 때문에 base컴포넌트를 따로 빼줘야 합니다.)
const BaseButton: React.FC<IButtonStyles> = props => {
  // 커스텀으로 사용될 속성들을 제외한 기본 속성만 button 컴포넌트에 넣어야 합니다.
  const {
    btnType,
    ImageType,
    colorType,
    widthSize,
    heightSize,
    ...otherProps
  } = props;

  return <Button {...otherProps} />;
};

export const ScButton = styled(BaseButton)`
  .ant-btn > .anticon + span,
  .ant-btn > span + .anticon {
    margin-left: 5px;
  }

  // 버튼 타입별 스타일 적용
  ${(props: IButtonStyles) => {
    switch (props.btnType) {
      //테두리만 있는 버튼 마우스 오버하면 색 채워짐
      case 'buttonHover':
        return `
        //#region 🔵SIZE
        width: ${
          props.widthSize === 'small'
            ? '80px'
            : props.widthSize === 'medium'
            ? '100px'
            : props.widthSize === 'large'
            ? '150px'
            : '100%'
        };
        height: ${Sizes.height_button_default};
        //#endregion

        //#region 🟣COLOR
        // color: ${Colors.bg_buttonHover_default};
        color: ${props.colorType === 'delete' ? '#ED363B' : '#292929'}
        // border-color:${Colors.bg_buttonHover_default};
        border-color: ${props.colorType === 'delete' ? '#ED363B' : '#292929'}
        // background-color: ${Colors.fg_button_default};
        background-color: none;
        //#endregion

        border-radius: 3px;
        letter-spacing: 2px;
        margin-left: 5px;
        font-weight: 500;

        font-Size: ${Fonts.fontSize_btn};

        &:active, &:hover, &:focus{
          color: ${Colors.fg_button_default};
          background:${Colors.bg_buttonHover_default};
          border: none;  
        }

        ::selection {
          color: ${Colors.fg_button_default};
          background: ${Colors.primary};
        }

        ::after {
          color: ${Colors.fg_button_default};
          background: ${Colors.primary};
        }

        .ant-btn-primary{
          background: ${Colors.primary};
        }
      `;

      // 현재 사용중 (blue, excel만 사용)
      case 'buttonFill':
        return `
        //#region 🔵SIZE
        width: ${
          props.widthSize === 'small'
            ? Sizes.width_button_sm
            : props.widthSize === 'medium'
            ? Sizes.width_button_md
            : props.widthSize === 'large'
            ? Sizes.width_button_lg
            : props.widthSize === 'xlarge'
            ? Sizes.width_button_xlg
            : '100%'
        };
        height: ${
          props.heightSize === 'small'
            ? Sizes.height_button_default
            : Sizes.height_button_lg
        };
        border-radius: ${Sizes.borderRadius_button_default};
        letter-spacing: ${Sizes.letterSpacing_button_default};
        //#endregion
    
        //#region 🟣COLOR
        color: ${Colors.fg_button_default};
        background-color: ${
          props.colorType === 'basic'
            ? '#1890ff'
            : props.colorType === 'delete'
            ? Colors.bg_button_delete
            : props.colorType === 'add'
            ? Colors.bg_button_add
            : props.colorType === 'cancel'
            ? Colors.bg_button_cancel
            : props.colorType === 'excel'
            ? Colors.bg_button_excel
            : props.colorType === 'save'
            ? Colors.bg_button_save
            : Colors.bg_button_search
        }; 
        //#endregion

        font-Size: ${
          props.fontSize === 'small'
            ? Fonts.fontSize_btnFill
            : props.fontSize === 'large'
            ? Fonts.fontSize_btnFill_lg
            : Fonts.fontSize_btnFill_md
        };
        
        border-style: none;

        .anticon.anticon-retweet{
          margin-left: -5px;
        }

        // 클릭, 마우스오버, 포커스 했을 때 적용 
        &:active, &:hover, &:focus, ::selection, ::after{
          color: ${Colors.fg_button_default};

          background-color:${
            props.colorType === 'basic'
              ? '#1890ff'
              : props.colorType === 'delete'
              ? Colors.bg_button_delete
              : props.colorType === 'add'
              ? Colors.bg_button_add
              : props.colorType === 'cancel'
              ? Colors.bg_button_cancel
              : props.colorType === 'excel'
              ? Colors.bg_button_excel
              : props.colorType === 'save'
              ? Colors.bg_button_save
              : Colors.bg_button_search
          }; 

          border-color: transparent;
        }
      `;

      case 'image':
        return `
        width: 30px;
        height: 26px;
        // margin-right: 10px;
        // 그래프 설정 아이콘 위치
        .ant-row{
          justify-content: flex-end;
        }
        .ant-btn-icon-only.ant-btn-lg{
          padding: 10px 0;
        }
        // 그래프 설정 아이콘 클릭, 마우스오버, 클릭했을 때 적용
        ${
          props.hoverAnimation
            ? `&:active, &:hover, &:focus{
            transform: rotate(60deg);
            transition: all 0.2s linear;
        }`
            : null
        }
      `;
    }
  }}
`;
