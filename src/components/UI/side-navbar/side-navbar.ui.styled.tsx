import styled from 'styled-components';
import Colors from '~styles/color.style.module.scss';
import Fonts from '~styles/font.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import Props from './side-navbar.ui.type';
import { FlexBox } from '../flexbox';
import { Link } from 'react-router-dom';

export const ScContainer = styled.div<Props>`
  z-index: 1;
  position: fixed;
  left: 0;
  bottom: 0;
  top: ${({ top }) => top}px;
  width: ${({ width }) => width}px;
  font-size: ${Fonts.fontSize_level1Menu};
  .ant-menu-sub {
    .ant-menu-item.ant-menu-item-only-child {
      padding-left: 38px !important;
    }
  }
`;

// 메뉴 타이틀
export const ScMenuTitle = styled.span`
  position: absolute;
  top: 6px;
  font-weight: 600;
  font-size: ${Fonts.fontSize_levelTitle};
  left: 24px;
`;

// 1level 메뉴
export const ScLevel1Menu = styled(FlexBox)<{ paddingTop: number }>`
  background-color: ${Colors.bg_menuLevel1_default};
  width: ${Sizes.width_level1Menu_default};
  height: 100%;
  svg {
    color: ${Colors.fg_menu_default};
  }
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 6px;

  // 왼쪽 메뉴 스크롤
  ::-webkit-scrollbar {
    width: ${Sizes.width_scrollbar_nav};
    height: ${Sizes.height_scrollbar_nav};
  }
  // 페이지, 그리드 스크롤
  ::-webkit-scrollbar-thumb,
  ::-webkit-scrollbar-track {
    border-radius: ${Sizes.borderRadius_track};
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
`;

// 2level 메뉴
export const ScLevel2Menu = styled(FlexBox)<{ paddingTop: number }>`
  position: relative;
  padding-top: ${props => props.paddingTop}px;
  width: ${Sizes.width_level2Menu_default};
  background-color: ${Colors.bg_menuLevel2_default};
  height: 100%;
  border-right: 1px solid ${Colors.bg_menu_border};
  opacity: 1;
  &.level2-active {
    border-right: 0;
    transition: 0.2s;
    width: 0;
    opacity: 0;
    pointer-events: none;
    /* display: none; */
  }
  overflow-y: auto;
  overflow-x: hidden;

  // 2level 배경
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: ${Colors.bg_menu_level2_selected};
  }
  // 2level 글자색
  .ant-menu-item-selected a,
  .ant-menu-item-selected a:hover {
    color: ${Colors.fg_menuLevel2};
  }
  // 2level 오른쪽
  .ant-menu-vertical .ant-menu-item::after,
  .ant-menu-vertical-left .ant-menu-item::after,
  .ant-menu-vertical-right .ant-menu-item::after,
  .ant-menu-inline .ant-menu-item::after {
    border-right: 3px solid ${Colors.bg_menuLevel2_borderR};
  }

  // 왼쪽 메뉴 스크롤
  ::-webkit-scrollbar {
    width: ${Sizes.width_scrollbar_nav};
    /* height: ${Sizes.height_scrollbar_nav}; */
  }
  // 페이지, 그리드 스크롤
  ::-webkit-scrollbar-thumb,
  ::-webkit-scrollbar-track {
    border-radius: ${Sizes.borderRadius_track};
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
`;

export const ScMenuItem = styled.span`
  margin-top: 20px;
  cursor: pointer;
  &.level1 {
    transition: color 0.2s;
    margin-top: 18px;
    color: ${Colors.fg_menu_default};
    text-align: center;
    &:hover,
    &.active {
      border-radius: ${Sizes.borderRadius_common};
      transition: 0.2s;
      background-color: ${Colors.bg_level1Menu_default};
      width: ${Sizes.width_level1Menu_selected};
    }
  }
  &.level2 {
    font-size: ${Fonts.fontSize_level2Menu};
    &.active {
      color: ${Colors.fg_level2Menu_active};
    }
  }
`;

export const ScExtendedLink = styled(Link)`
  width: 100%;
  display: block;
  font-size: ${Colors.bg_menuLevel2_default};
`;

export const ScResizeButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%) rotate(180deg);
  right: 0;
  border-radius: ${Sizes.borderRadius_common};
  background-color: ${Colors.bg_menuButton_default};
  border: 1.5px solid ${Colors.bg_menuButton_border};
  color: ${Colors.bg_menuButton_border};
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    color: ${Colors.bg_menuButton_hover};
  }
  &.active {
    transform: translate(50%, -50%);
  }
`;
