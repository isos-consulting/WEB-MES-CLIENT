import { createGlobalStyle, css } from 'styled-components';
import Colors from '~styles/color.style.scss';
import Sizes from '~styles/size.style.scss';
import Fonts from '~styles/font.style.scss';
import '../index.css';

//#region 🌵공통된 속성
// CHECKBOX
const checkboxSize = css`
  width: ${Sizes.width_checkbox_sm};
  height: ${Sizes.width_checkbox_sm};
`;

// FONT
const font = css`
  font-family: 'Noto Sans CJK KR', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
  font-size: ${Fonts.fontSize_default};
`;
//#endregion

export const GlobalStyles = createGlobalStyle`

  html, body {
    margin: 0;
    padding: 0;
    ${font};
  }

  // GRAPH (타이틀 스타일 - 스타일 확인X)
  h2{
    font-size: 15px;
    margin-top: 10px;
    padding-left: 0px !important; 
  }

  .grid-cell-centered {
    text-align: center;
  }

  * {
    box-sizing: border-box;
    //#region 🌵SCROLLBAR
    // 왼쪽 메뉴 스크롤
    /* ::-webkit-scrollbar {
      width: ${Sizes.width_scrollbar_nav};
      height: ${Sizes.height_scrollbar_nav};
    } */

    /* // 페이지, 그리드 스크롤
    ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-track {
      border-radius: ${Sizes.borderRadius_track};
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    } */
    //#endregion
  }

// MODAL (버튼)
.modalButton {
  margin-top:12px;
  /* margin-right: 10px; */
  margin-bottom: 12px; 
  /* text-align: end; */
  width: '100%';
}

// LABEL (검색조건 라벨 수직정렬)
.ant-col.ant-col-10{
  padding-top: 3px !important;
}

/* GRAPHGRID (그래프 옵션 이미지) */
.graphOption {
  width: ${Sizes.width_graph_default};
  text-align: right; 
  position: absolute; 
  display: table-cell; 
  margin-left: -20;
  z-index: 1; 
}

.ant-row{
  row-gap: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
  margin-top: 10px !important;
}

//#region 🌵CHECKBOX GROUP, RADIO GROUP 
.ant-checkbox-wrapper {
  font-size: ${Fonts.fontSize_label};
}
.ant-radio-wrapper {
  font-size: ${Fonts.fontSize_label};
}
//#endregion

//#region 🌵RADIO 
// 라디오 버튼 안쪽 (선택X)
.ant-radio-inner {
  width: ${Sizes.width_radio_sm};
  height: ${Sizes.height_radio_sm};
}
// 선택한 라디오 버튼 안쪽
.ant-radio-checked .ant-radio-inner {
  position: static;
}
//#endregion

//#region 🌵POPUP
// 팝업 취소, 추가하기 버튼
.ant-btn{
  height: ${Sizes.height_button_default};
  font-size: ${Fonts.fontSize_btn};
  letter-spacing: ${Sizes.letterSpacing_button_default};
}
// 팝업에서 행 추가 버튼 클릭했을 때 나오는 팝업
.ant-modal-confirm{
  // 팝업 전체 부분
  & .ant-modal-body{
      padding: 16px 32px 24px;
  }
  // 팝업 타이틀 부분
  &-body .ant-modal-confirm-title{
      padding-bottom: 8px;
  }
}
// POPUP (그리드)
.tui-grid-container.tui-grid-show-lside-area {
  margin-top: 10px;
}

.ant-modal {
  top: 50px;
}

// POPUP (바디 부분)
.ant-modal-body {
  padding: 12px;
}
//#endregion

//#region 🌵TAB
// 선택되지 않은 탭 
.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab, .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab {
  color: ${Colors.fg_tab_default}
}

// 클릭한 탭
.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active, .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab-active {
  border-top: 3px solid ${Colors.bg_tabClick_border};
}

// 탭과 하단 컨테이너 시작하는 부분 맞춤
.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap, .ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-wrap {
  margin-left: -3px;
}

// 탭 폰트 
.ant-tabs-tab{
  font-size: ${Fonts.fontSize_tab}
}

// 탭과 하단 컨테이너 사이 여백
.ant-tabs-tabpane.ant-tabs-tabpane-active{
  margin-top: -22px !important;
}

// 탭 영역 
.ant-tabs-top > .ant-tabs-nav, .ant-tabs-bottom > .ant-tabs-nav, .ant-tabs-top > div > .ant-tabs-nav, .ant-tabs-bottom > div > .ant-tabs-nav {
  margin: 0 0 12px 0;
}

// 탭 눌렀을 때 움직임
.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab, .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab {
  transition: none;
}
//#endregion

//#region 🌵GRID-DOUBLE(2분할)
// 2분할 searchbox, grid container 사이 간격
.ant-col.ant-col{
  &-8, &-16 {
    padding-right: 2px !important;
  }
}
// GRID-DOUBLE (조회버튼)
button[type=submit] {
  width: ${Sizes.width_submitButton_default};
  height: ${Sizes.height_submitButton_default};
  border-radius: ${Sizes.borderRadius_common};
  letter-spacing: ${Sizes.letterSpacing_common};
  background-color: ${Colors.bg_submitButton_default};
  border: 1px solid ${Colors.fg_submitButton_default};
  color: ${Colors.fg_button_default};
  font-size: ${Fonts.fontSize_btn};
  cursor: pointer;
}
// GRID DOUBLE (8-LEFT / 16-RIGHT)
.ant-col.ant-col {
  &-8 {
    padding-left: 0px !important;
    align-self: flex-start ;
  }
  &-16 {
    padding-right: 0px !important;
  }
}
//#endregion

//#region 🌵SEARCHBOX
// SEARCHBOX
.ant-space.ant-space-horizontal {
  margin-bottom: 0px !important;
}
// SEARCHBOX안 라벨, 컴포넌트, 버튼 묶음
.ant-space.ant-space-.ant-space-align-center{
  margin-bottom: 0px !important;
}  
//#endregion

//#region 🌵CHECKBOX
// CHECKBOX (그리드에서 사용)
.ant-checkbox-inner {
  ${checkboxSize}
}

// CHECKBOX (그리드 헤더에 사용)
.tui-grid-cell.tui-grid-cell-header.tui-grid-cell-row-header > span > input[type=checkbox] {
  ${checkboxSize}
  margin-top: ${Sizes.marginTop_checkbox_default};
  /* display: none; */
}

// CHECKBOX (No, 옆 체크박스에 적용 --> 헤더 제외)
.tui-grid-row-header-checkbox > input[type=checkbox] {
  ${checkboxSize}
  vertical-align: middle;
  /* display: none; */
}

// CHECKBOX (그리드 안에서 사용)
.tui-grid-cell-content > input[type=checkbox] {
  height: ${Sizes.width_checkbox_sm};  
  vertical-align: middle;
}
//#endregion

//#region 🌵GRID (수정모드)
//수정하려고 더블클릭 했을 때 콤보박스 뒤로 보여지는 배경색
.tui-grid-layer-editing.tui-grid-cell-content.tui-grid-cell-content-editor {
  width: ${Sizes.width_common};
  background-color: ${Colors.bg_comboBoxContent_editor};
  // CHECKBOX (수정모드-체크박스 가운데)
  text-align: center;
}

.tui-grid-layer-editing {
  /* position: fixed; */
  border: solid 2px ${Colors.bg_gridLayer_border};
}

tr.tui-grid-row {
  // 수정모드 (수정 안되는 부분 - 홀수줄)
  &-odd > td.tui-grid-cell.tui-grid-cell-has-input.update:not(.editor) {
    background-color: ${Colors.bg_gridRow_odd};
  }
  // 수정모드 (수정 안되는 부분 - 짝수줄)
  &-even > td.tui-grid-cell.tui-grid-cell-has-input.update:not(.editor) {
    background-color: ${Colors.bg_gridRow_even};
  }

  // 수정모드 (수정 안되는 부분 - 홀수줄)
  &-odd > td.tui-grid-cell.tui-grid-cell-has-input.create:not(.editor) {
    background-color: ${Colors.bg_gridRow_odd};
  }
  // 수정모드 (수정 안되는 부분 - 짝수줄)
  &-even > td.tui-grid-cell.tui-grid-cell-has-input.create:not(.editor) {
    background-color: ${Colors.bg_gridRow_even};
  }

  // 선택된 셀 (홀수줄)
  &-odd > td.tui-grid-cell.tui-grid-cell-has-input.selected-row {
    background-color: ${Colors.bg_gridSelectRow_odd};
  }
  // 선택된 셀 (짝수줄)
  &-even > td.tui-grid-cell.tui-grid-cell-has-input.selected-row {
    background-color: ${Colors.bg_gridSelectRow_even};
  }

  // 셀이 체크되었을때 로우 색상
  &-odd > td.tui-grid-cell.tui-grid-cell-has-input.popup {
    background-color: ${Colors.bg_gridRow_checkbox};
  }
  &-even > td.tui-grid-cell.tui-grid-cell-has-input.popup {
    background-color: ${Colors.bg_gridRow_checkbox}; 
  }
}
// GRID CHECKBOX (체크했을 때)
tr.tui-grid-row{
  // 홀수줄
  &-odd > td.tui-grid-cell.tui-grid-cell-has-input.row-checked {
    background-color: lighten(${Colors.bg_gridRow_checkbox}, 3%);
  }
  // 짝수줄
  &-even > td.tui-grid-cell.tui-grid-cell-has-input.row-checked {
    background-color: ${Colors.bg_gridRow_checkbox};
  }
}

// GRID FILTER
.tui-grid-filter-btn.tui-grid-filter-btn-clear {
  margin-top: 2px;
}
.tui-grid-datepicker-input-container {
  margin-bottom: 4px;
}
//#endregion

//#region 🌵MENU
// 3레벨 메뉴
.ant-menu-inline .ant-menu-item:not(:last-child){
  margin-bottom: 0;
}
// 3레벨 메뉴 선택했을 때 오른쪽 파란색으로 표시
.ant-menu-item::after{
  margin-right: 1px;
}
// 드롭다운 메뉴
.ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title{
  font-size: ${Fonts.fontSize_dropdownMenu};
}
//#endregion

//#region 🌵GRID HEADER
.tui-grid{
  &-header-area{ 
    background-color: ${Colors.bg_gridHeader_area};
  }
  // 그리드 헤더 선택했을 때
  &-layer-selection{
    background-color: ${Colors.bg_gridLayer_selection};
  }
}
// 그리드 헤더부분 수직정렬
.tui-grid-cell.tui-grid-cell-header{
  padding: 2px 2.5px
  /* padding-bottom: 6px; */
}
//#endregion

//#region 🌵CARD
/* 그리드에서 사용 */
.card-grid{
  & + .text-left {
    text-align: left;
  }
  &-two+ .text-left {
    text-align: left;
  }
}

.card-grid, .grid-card-two  + .text-right {
  text-align: right;
}

// RADIO GROUP
.ant-card-bordered .ant-card-body {
  padding: 2.625px 5px;
}
//#endregion

//#region 🌵NUMBER INPUT
/* 그리드에서 사용되는 숫자 인풋박스  */
.tui-grid-content-number{
  width: ${Sizes.width_common};
  height: ${Sizes.height_inputNumber_default};
  font-size: ${Fonts.fontSize_label_sm};
  border: 2px solid ${Colors.bg_numberInput_border};
  padding-left: 10px;

  &:focus{
    outline: none;
    border: 2px solid ${Colors.bg_numberInputFocus_border};
  }
}
//#endregion

//#region 🌵COMBOBOX
// 그리드에서 사용
.select{
  padding-top: 0.5px;
  // 콤보박스에 적용
  &-selector{
    width: ${Sizes.width_common};
    height: ${Sizes.height_combobox_default};
    border-radius: ${Sizes.borderRadius_common};
    color: ${Colors.fg_comboBoxSelector_default};
    border: 2px solid ${Colors.bg_comboboxFocus_border};
    font-size: ${Fonts.fontSize_cbo};
    font-family: ${Fonts.fontFamily_default};
    outline: none;
    &:focus{
      order: 2px solid ${Colors.bg_comboboxFocus_border};
    }
  }
}

// searchbox안에서 사용
.ant-select-single:not(.ant-select-customize-input) .ant-select-selector{
    height: ${Sizes.height_combobox_default};
    & .ant-select-selection-search-input{
      height: ${Sizes.height_combobox_default};
    }
}

// 로그인 공장 콤보박스
.ant-select-single .ant-select-selector .ant-select-selection-item{
  line-height: 24px;
}
//#endregion

//#region 🌵DATEPICKER
// 그리드에서 사용
.tui-grid{
  &-content-date{
    width: ${Sizes.width_common};
    height: ${Sizes.height_datepicker_default};
    outline: none;
  }
  &-content-date:focus{
    border: 2px solid ${Colors.bg_datepickerFocus_border};
  }
}
//#endregion

//#region 🌵GRID FONT(그리드 폰트)
.tui-grid-container {
  ${font};
}
//#endregion

//#region 🌵GRID FILTER(그리드 필터)
.tui-grid-filter{
  height:${Sizes.height_gridFilter_default};
  background-position: -13px -88px;
  // 그리드 필터 - 초기화, 적용버튼
  &-btn{
    width: ${Sizes.width_gridFilter_default};
    ${font};
  }
  // 그리드 필터 - 언어설정
  &-dropdown select{
    ${font};
  }
}
// 그리드 필터 콤보박스 
.tui-grid-filter-dropdown select{
  height: 80%;
}
//#endregion

//#region 🌵GRID SORTING(그리드 정렬)
.tui-grid-btn-sorting{
  background-position: -91px -9px;
  height: ${Sizes.height_gridSorting_default};
}
//#endregion

//#region 🌵PopUp 그리드에서 사용되는 PopUp 스타일 
.tui-grid-cell.tui-grid-cell-has-input > .popup {
  width: ${Sizes.width_common} auto;
  min-width: ${Sizes.width_popup_min};
  padding: 4px 5px;
  // GRID CELL (팝업 인풋박스)
  & > input.popup-input{
    width: 80%;
    height: ${Sizes.height_popupInput_default}; 
    background-color: ${Colors.palettes_white};
    border: 0;
    ${font};
  }
  // GRID CELL (팝업 이미지)
  & > img.popup-image {
    max-width: ${Sizes.width_popupImg_max};
    margin-bottom: 3px;
    margin-right: 3px;
    float: right;
  }
}
//#endregion

//#region 🌵GRID
// GRID TAG 컴포넌트
.ant-tag.ant-tag-custom {
  font-weight: 700;
  font-family: 'Noto Sans CJK KR'; 
  margin: 0;
  margin-top: 2px;
  &.hidden{
    display: none;
  }
}

// GRID CELL (클릭했을 때 border)
.tui-grid-layer-focus > .tui-grid-layer-focus-border {
  box-sizing: border-box;
  border: 1px solid ${Colors.bg_gridLayer_border};
}

// GRID SUMMARY
td.tui-grid-cell.tui-grid-cell-summary {
  background-color: rgba(88, 123, 210, 0.1); //#587BD2
  border-color: #CCC;
  border-left-width: 1px;
  border-right-width: 1px;
  padding: 4px 5px;
}

// GRID SUMMARY (SUMMARY가 활성화된 경우 메인 그리드의 X스크롤을 숨김)
div.tui-grid-content-area.tui-grid-has-summary-bottom {
  .tui-grid-rside-area {
    .tui-grid-body-area {
      overflow-x: hidden;
    }
  }
}
//#endregion

//#region 🌵INPUT
.ant-col.ant-col-14{
  // POPUP (신규항목추가 팝업 인풋박스)
  & .ant-input {
    letter-spacing: ${Sizes.letterSpacing_common};
    font-size: 10px !important;
  } 
  // POPUP (신규항목추가 팝업 인풋박스 비고)
  & #remark.ant-input[type=text] {
    letter-spacing: ${Sizes.letterSpacing_common};
    font-size: 10px !important;
  }
}
//#endregion

//#region 🌵ANTD - CARD
div.ant-card.container {
  font-size: ${Fonts.fontSize_label};

  & > .ant-card-head {
    padding-left: 5px;
    font-size: ${Fonts.fontSize_default_md};
    font-weight: bold;
    color: #1890FF; //#587BD2;
    min-height: 30px;      
    
    & > .ant-card-head-wrapper > .ant-card-head-title {
      padding: 4px 0 0 0 !important;
    }
  } 

  & > .ant-card-body {
    padding: 4px 4px 4px 4px !important;
    div{
      margin-top: 0px;
    }
  }

  &.ant-card-bordered{
    /* border: 1px solid ${Colors.bg_radio_border}; */
    /* padding-bottom: 10px; */
  }
}

//#endregion

// 그리드 total을 구분하기 위한 배경색
.tui-grid-cell.tui-grid-cell-has-input.total {
  background-color: #C2EEA0; // ❗색상 아무거나 한거라서 변경해야해요!
}
`;
