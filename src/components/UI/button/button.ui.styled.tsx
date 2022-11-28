import React from 'react';
import Colors from '~styles/color.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import Fonts from '~styles/font.style.module.scss';
import styled from 'styled-components';
import { Button } from 'antd';
import { IButtonStyles } from './button.ui.type';

const fillStyles = ({
  widthSize,
  heightSize,
  colorType,
  fontSize,
}: {
  widthSize?: string;
  heightSize?: string;
  colorType?: string;
  fontSize?: string;
}) => {
  const style = {
    width: '100%',
    height: Sizes.height_button_lg,
    'border-radius': Sizes.borderRadius_button_default,
    'letter-spacing': Sizes.letterSpacing_button_default,
    color: Colors.fg_button_default,
    'background-color': Colors.bg_button_search,
    'font-Size': Fonts.fontSize_btnFill_md,
    'border-style': 'none',
  };

  const width = {
    small: Sizes.width_button_sm,
    medium: Sizes.width_button_md,
    large: Sizes.width_button_lg,
    xlarge: Sizes.width_button_xlg,
  };

  const height = {
    small: Sizes.height_button_default,
  };

  const color = {
    basic: '#1890ff',
    delete: Colors.bg_button_delete,
    add: Colors.bg_button_add,
    cancel: Colors.bg_button_cancel,
    excel: Colors.bg_button_excel,
    save: Colors.bg_button_save,
  };

  const font = {
    small: Fonts.fontSize_btnFill,
    large: Fonts.fontSize_btnFill_lg,
  };

  if (width.hasOwnProperty(widthSize) === true) {
    style.width = width[widthSize];
  }

  if (height.hasOwnProperty(heightSize) === true) {
    style.height = height[heightSize];
  }

  if (color.hasOwnProperty(colorType) === true) {
    style['background-color'] = color[colorType];
  }

  if (font.hasOwnProperty(fontSize) === true) {
    style['font-Size'] = font[fontSize];
  }

  return `${Object.entries(style).reduce(
    (acc, [key, value]) => acc + `${key}: ${value};`,
    '',
  )}

  .anticon.anticon-retweet{
    margin-left: -5px;
  }

  &:active, &:hover, &:focus, ::selection, ::after{
    color: ${Colors.fg_button_default};
    background-color:${style['background-color']}; 
    border-color: transparent;
  }`;
};

const imageStyles = ({ hoverAnimation }: { hoverAnimation?: boolean }) => {
  return `
    width: 30px;
    height: 26px;
    .ant-row{
      justify-content: flex-end;
    }
    .ant-btn-icon-only.ant-btn-lg{
      padding: 10px 0;
    }
  `.concat(
    hoverAnimation === true
      ? `
      &:active, &:hover, &:focus{
        transform: rotate(60deg);
        transition: all 0.2s linear;
      }`
      : '',
  );
};

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

  // @ts-ignore
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
      case 'buttonFill':
        return fillStyles(props);
      case 'image':
        return imageStyles(props);
    }
  }}
`;
