import Grid from "@toast-ui/react-grid";
import TuiGrid from "tui-grid";
import React, { useRef, useState } from "react";
import { IDatagridProps, IGridColumn, TGridMode } from ".";
import { OptComplexColumnInfo } from 'tui-grid/types/options';


  
/** 데이터 그리드 속성 인터페이스 */
interface IAllowedDatagridProps extends Omit<IDatagridProps, 'gridId' | 'columns'> {
  /** 그리드 아이디 */
  gridId?: string;
  /** 그리드 컬럼 */
  columns?: IGridColumn[];
}

/** 데이터 그리드 관리용 모델 */
export const gridModel = (props:{
  /** 그리드의 레퍼런스, 그리드 DOM에 접근 가능 */
  gridRef
  : React.MutableRefObject<Grid>,

  /** 그리드 DOM에 접근 가능한 변수 */
  gridInstance
  : TuiGrid

  /** 그리드의 설정값을 가지고 있는 객체 변수 */
  gridInfo
  : IDatagridProps,

  /** 그리드 상태를 설정 */
  setGridMode
  : React.Dispatch<React.SetStateAction<TGridMode>>,

  /** 그리드 데이터를 설정 */
  setGridData
  : React.Dispatch<React.SetStateAction<any[]>>,

  /** 그리드 컬럼 재설정  */
  setGridColumns
  : React.Dispatch<React.SetStateAction<IGridColumn[]>>,

  /** 그리드 디스플레이 여부 재설정 */
  setGridHidden
  : React.Dispatch<React.SetStateAction<boolean>>,

  /** 헤더 컬럼 병합 세팅 값 */
  setComplexColumns
  : React.Dispatch<React.SetStateAction<OptComplexColumnInfo[]>>,
  // setGridHeader
  // : React.Dispatch<React.SetStateAction<OptHeader>>,
}) => {
  
  return props;
};

export const useGrid = (gridId, columns:IGridColumn[], options?:IAllowedDatagridProps) => {
  const [gridMode, setGridMode] = useState<TGridMode>(options?.gridMode ?? 'view');
  const [gridData, setGridData] = useState<any[]>([]);
  const [gridColumns, setGridColumns] = useState<IGridColumn[]>(columns);
  const [complexColumns, setComplexColumns] = useState<OptComplexColumnInfo[]>(options?.header?.complexColumns);
  // const [gridHeader, setGridHeader] = useState<OptHeader>(options?.header);
  const [gridHidden, setGridHidden] = useState<boolean>(false);
  const gridRef = useRef<Grid>();
  const gridInfo: IDatagridProps = {
    gridId,
    columns: gridColumns,
    data: gridData,
    gridMode,
    hidden: gridHidden,
    header: {
      ...options?.header,
      complexColumns,
    },
    ...options
  }


  const model = gridModel({
    gridRef,
    gridInstance: gridRef?.current?.getInstance(),
    gridInfo,
    setGridMode,
    setGridData,
    setGridColumns,
    setGridHidden,
    setComplexColumns,
    // setGridHeader,
  });

  return model;
}

