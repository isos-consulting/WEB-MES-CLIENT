import styled from 'styled-components';
import Colors from '~styles/color.style.scss';
import Fonts from '~styles/font.style.scss';
import Sizes from '~styles/size.style.scss';

import { Space } from 'antd';
import Props from './header.ui.type';

export const ScContainer = styled.div<Props>`
  display: flex;
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: ${({ height }) => height}px;
  background-color: ${Colors.bg_headerContainer_default};
  border-bottom: 1px solid ${Colors.bg_headerContainer_border};
`;

export const ScLogo = styled.div``;

export const ScRightWrapper = styled(Space)`
  margin-left: auto;
`;

export const ScUserLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.bg_headerContainer_border};
  border-radius: 50%;
  padding: 9px;
`;

export const ScExtendedSpace = styled(Space)`
  position: relative;
  cursor: pointer;
`;

export const ScMyPageText = styled.div`
  color: inherit;
  margin: 0 7px;
  &:hover {
    color: ${Colors.fg_headerText_hover};
  }
`;
// title ex) 발주관리
export const ScTitleBodyDescription = styled.div`
  width: auto;
  border-radius: ${Sizes.borderRadius};
  background-color: ${Sizes.borderRadius};
  font-size: ${Fonts.fontSize_header_md};
  margin: 0;
  color: ${Colors.fg_header_title};
  font-weight: 600;
  padding: 10px 0 0 20px;
  margin-bottom: 8px;
  user-select: none;

  // title ex) 자재관리 > 발주관리
  div {
    font-size: ${Fonts.fontSize_header};
    color: ${Colors.fg_headerDetail_title};
    font-weight: 500;
  }
`;
