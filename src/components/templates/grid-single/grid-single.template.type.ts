import Grid from '@toast-ui/react-grid';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import IModalProps from '~/components/UI/modal/modal.ui.type';
import ISearchboxProps from '~/components/UI/searchbox/searchbox.ui.type';
import IButtonProps from '~/components/UI/button/button.ui.type';
import { IInputGroupboxProps } from '~/components/UI/input-groupbox/input-groupbox.ui';
import React from 'react';

export default interface ITpSingleGridProps {
  /** 페이지 제목 */
  title: string;
  subTitle?: string;

  /** 페이지 유형 */
  templateType?: 'basic' | 'report';

  /** 그리드 레퍼런스 */
  gridRef: React.MutableRefObject<Grid>;
  subGridRef?: React.MutableRefObject<Grid>;
  popupGridRef: React.MutableRefObject<Grid>[];

  /** 그리드 */
  gridInfo: IDatagridProps;
  subGridInfo?: IDatagridProps;
  popupGridInfo: IDatagridProps[];

  /** 검색조건 */
  searchProps?: ISearchboxProps;
  popupSearchProps?: ISearchboxProps[];

  /** 그룹입력박스 */
  inputProps?: IInputGroupboxProps;
  popupInputProps?: IInputGroupboxProps[];

  /** 모달 콘텍스트 */
  modalContext: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;

  /** 모달 visible */
  popupVisible: boolean[];
  setPopupVisible: React.Dispatch<React.SetStateAction<boolean>>[];

  /** 기타 버튼 */
  extraButtons?: TExtraButtons;

  /** 기타 팝업 */
  extraModals?: TExtraModals;
  extraGridPopups?: TExtraGridPopups;

  dataSaveType?: 'basic' | 'headerInclude';

  /** 버튼 액션 */
  buttonActions: {
    search: () => void | null;
    update: () => void | null;
    delete: () => void | null;
    create: () => void | null;
    save: () => void | null;
    cancelEdit: () => void | null;
    printExcel: () => void | null;
  };

  onPopupAfterOk?: ((isSuccess: boolean, savedData?: any[]) => void)[];
}

export interface IExtraButton extends IButtonProps {}
export type TExtraButtons = IExtraButton[];
export type TExtraModals = IModalProps[];
export type TExtraGridPopups = IGridPopupProps[];
