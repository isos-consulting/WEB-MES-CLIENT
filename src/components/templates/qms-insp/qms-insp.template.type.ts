import { Dispatch, MutableRefObject } from 'react';
import Grid from '@toast-ui/react-grid';
import {IDatagridProps, TGridMode} from '~/components/UI/datagrid-new';
import { ISearchboxProps, ISearchItem } from '~/components/UI/searchbox';
import { IInputGroupboxProps } from '~/components/UI/input-groupbox/input-groupbox.ui';


export interface ITpTrippleGridHeader {
  gridRef: MutableRefObject<Grid>;
  gridItems: IDatagridProps;
  gridDispatch: Dispatch<any>;
  searchUriPath: string;
  searchParams?: object;
  saveUriPath: string;
  saveOptionParams?: object;
}

export interface ITpTrippleGridHeaderContent extends ITpTrippleGridHeader {}
export interface ITpTrippleGridDetail extends ITpTrippleGridHeader {}

export default interface ITpTrippleGridProps {
  gridMode: TGridMode;

  searchUriPath: string;
  searchParams?: object;
  saveUriPath: string;
  saveOptionParams?: object;

  // searchItems?: ISearchItem[];
  searchProps?: ISearchboxProps;
  // inputItems?: IInputUiGroupItem[];
  inputProps?: IInputGroupboxProps;
  newCreateInputProps?: IInputGroupboxProps;

  header: ITpTrippleGridHeader;
  headerContent: ITpTrippleGridHeaderContent;
  detail: ITpTrippleGridDetail;
  
  // 신규 데이터 추가 관련 세팅
  createNewPopupGridRef: MutableRefObject<Grid>;
  createNewPopupGridItems: IDatagridProps;
  createNewPopupSaveOptionParams?: object;


  //  세부 데이터 추가 관련 세팅
  createDetailPopupGridRef: MutableRefObject<Grid>;
  createDetailPopupGridItems: IDatagridProps;
  createDetailPopupSaveOptionParams?: object;

  newCreateBtnDisabled:boolean;

  setParentData:(data: any) => void;
  parentGridRef: MutableRefObject<Grid>;

  /** basic은 단순 이력 저장, headerInclude는 {header, detail} 방식으로 저장합니다. */
  saveType?: 'basic' | 'headerInclude';

  onSearch?:() => void;
  onDeleteMode?:() => void;
  onUpdateMode?:() => void;
  onShowNewCreatePopup?:(visibleFunc) => void;
  onShowDetailCreatePopup?:(visibleFunc) => void;
  onCancel?:() => void;
  onSave?:() => void;
}
