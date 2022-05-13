import styled from 'styled-components';
import { IContentProps, ILayoutSpacing } from './layout.ui.type';
import Colors from '~styles/color.style.scss';
import Sizes from '~styles/size.style.scss';

/** 페이지 Container 영역의 스타일 */
export const ScContainer = styled.div<ILayoutSpacing>`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  /* .ant-card.ant-card-bordered{ */
  /* margin-bottom: 8px; */
  /* } */
  // searchbox 높이 지정하려고 했었음 (대시보드까지 적용돼서 일단 주석)
  /* .ant-card-body{
    height: 57px;
  } */
`;

/** 페이지 메인 바디 영역의 스타일 */
export const ScMainBody = styled.div<ILayoutSpacing>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  bottom: 0;
  padding: 0 ${({ contentSpacing }) => contentSpacing}px;
  overflow-y: auto;
  overflow-x: hidden;
  right: -1px;
  background-color: ${Colors.bg_background};

  /* 페이지 스크롤바 스타일 */
  //스크롤바 막대기
  /* ::-webkit-scrollbar-thumb {
    background: ${Colors.bg_scrollbar_bar};
    transition: all 0.3s ease 0s;
    cursor: pointer;
    scroll-snap-align: center;

  } */
  //스크롤바 막대기 사이즈
  /* ::-webkit-scrollbar { 
    width: ${Sizes.width_scrollbar_page};
  } */
  //스크롤바 영역
  /* ::-webkit-scrollbar-track {
    background: ${Colors.bg_scrollbar_area};
    scroll-snap-type: y mandatory;
  } */
`;

/** Content 영역의 스타일 */
export const ScContent = styled.div<IContentProps>`
  min-height: 88%;
  min-height: ${({ topSpacing, bottomSpacing, wrapperSpacing }) =>
    `calc(100vh - ${topSpacing + wrapperSpacing + bottomSpacing * 0.68}px)`};
  background-color: ${Colors.bg_background};
  border-radius: ${Sizes.borderRadius};
  /* overflow: hidden; */
  margin: ${({ wrapperSpacing }) => wrapperSpacing}px 0;
`;
