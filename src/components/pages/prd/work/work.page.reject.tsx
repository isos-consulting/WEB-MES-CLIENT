import Grid from '@toast-ui/react-grid';
import { Space, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { Button, Container, Datagrid, GridPopup, IGridColumn, IGridComboInfo, IGridPopupInfo, TGridMode } from '~/components/UI';
import { getData } from '~/functions';
import { onDefaultGridCancel, onDefaultGridSave, onErrorMessage, TAB_CODE } from './work.page.util';


//#region 🔶✅부적합관리
/** 부적합관리 */
export const REJECT = () => {
  //#region ✅설정값
  const [modal, contextHolder] = Modal.useModal();
  const gridRef = useRef<Grid>();

  const [gridMode, setGridMode] = useState<TGridMode>('view');

  const [data, setData] = useState([]);

  const [searchParams, setSearchParams] = useState({});
  const [saveOptionParams, setSaveOptionParams] = useState({});

  const SEARCH_URI_PATH = '/prd/work-rejects';
  const SAVE_URI_PATH = '/prd/work-rejects';

  //팝업 설정
  const popupGridRef = useRef<Grid>();
  const [popupVisible, setPopupVisible] = useState(false);
  //#endregion


  //#region ✅컬럼
  const REJECT_COLUMNS:IGridColumn[] = [
    {header:'생산부적합UUID', name:'work_reject_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
    {header:'생산실적UUID', name:'work_uuid', width:200, hidden:true, format:'text'},
    {header:'공정UUID', name:'proc_uuid', width:200, hidden:true, format:'text'},
    {header:'공정', name:'proc_nm', width:120, hidden:true, format:'text'},
    {header:'부적합 유형UUID', name:'reject_type_uuid', width:200, hidden:true, format:'text'},
    {header:'부적합 유형', name:'reject_type_nm', width:120, hidden:false, format:'text'},
    {header:'부적합UUID', name:'reject_uuid', width:200, hidden:true, format:'text', requiredField:true},
    {header:'부적합명', name:'reject_nm', width:120, hidden:false, format:'text', requiredField:true},
    {header:'수량', name:'qty', width:100, hidden:false, format:'number', editable:true, requiredField:true},
    {header:'입고 창고UUID', name:'to_store_uuid', width:200, hidden:true, format:'text', requiredField:true},
    {header:'입고 창고', name:'to_store_nm', width:120, hidden:false, format:'combo', editable:true, requiredField:true},
    {header:'입고 위치UUID', name:'to_location_uuid', width:200, hidden:true, format:'text', requiredField:true},
    {header:'입고 위치', name:'to_location_nm', width:120, hidden:false, format:'combo', editable:true, requiredField:true},
    {header:'비고', name:'remark', width:150, hidden:false, format:'text', editable:true},
  ];

  const REJECT_COMBO_INFO:IGridComboInfo[] = [
    { //입고창고 콤보박스
      columnNames: [
        {codeColName:{original:'to_store_uuid', popup:'store_uuid'}, textColName:{original:'to_store_nm', popup:'store_nm'}},
      ],
      dataApiSettings: {
        uriPath: '/std/stores',
        params: {
          store_type: 'reject'
        }
      }
    },
    { //입고위치 콤보박스
      columnNames: [
        {codeColName:{original:'to_location_uuid', popup:'location_uuid'}, textColName:{original:'to_location_nm', popup:'location_nm'}},
      ],
      dataApiSettings: {
        uriPath: '/std/locations',
        params: {
          //store_uuid
        }
      }
    },
  ];

  const ROW_ADD_POPUP_INFO:IGridPopupInfo = {
    columnNames: [
      {original:'reject_uuid', popup:'reject_uuid'},
      {original:'reject_nm', popup:'reject_nm'},
      {original:'reject_type_uuid', popup:'reject_type_uuid'},
      {original:'reject_type_nm', popup:'reject_type_nm'},
    ],
    columns: [
      {header:'부적합UUID', name:'reject_uuid', width:200, hidden:true, format:'text'},
      {header:'부적합 유형UUID', name:'reject_type_uuid', width:200, hidden:true, format:'text'},
      {header:'부적합 유형', name:'reject_type_nm', width:150, hidden:false, format:'text'},
      {header:'부적합명', name:'reject_nm', width:150, hidden:false, format:'text'},
    ],
    dataApiSettings: {
      uriPath: '/std/rejects',
      params: {}
    },
    gridMode:'multi-select'
  }
  //#endregion


  //#region ✅함수
  const onSearch = () => {
    const work_uuid = (searchParams as any)?.work_uuid;
    getData({work_uuid}, SEARCH_URI_PATH).then((res) => {
      setData(res);
    });
  }


  const onDelete = (ev) => {
    if ((searchParams as any)?.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if ((searchParams as any)?.complete_fg === 'true') {
      onErrorMessage('완료된작업시도');
      return;
    }

    setGridMode('delete');
  }


  const onEdit = (ev) => {
    if ((searchParams as any)?.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if ((searchParams as any)?.complete_fg === 'true') {
      onErrorMessage('완료된작업시도');
      return;
    }

    setGridMode('update');
  }


  const onAppend = (ev) => {
    if ((searchParams as any)?.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if ((searchParams as any)?.complete_fg === 'true') {
      onErrorMessage('완료된작업시도');
      return;
    }

    setPopupVisible(true);
  }


  const onCancel = (ev) => {
    onDefaultGridCancel(gridRef, REJECT_COLUMNS, modal,
      () => {
        onSearch();
        setGridMode('view');
      }
    );
  }


  const onSave = (ev) => {
    onDefaultGridSave('basic', gridRef, REJECT_COLUMNS, SAVE_URI_PATH, saveOptionParams, modal,
      () => {
        onSearch();
        setGridMode('view');
        setPopupVisible(false);
      }
    );
  }
  //#endregion


  //#region ✅렌더부
  const component = (
    <>
      <Container>
        {gridMode === 'view' ?
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={onDelete}>삭제</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={onEdit} disabled={true}>수정</Button>
              <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onAppend}>신규 추가</Button>
            </Space>
          </div>
          :
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='cancel' colorType='blue' onClick={onCancel}>취소</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='ok' colorType='blue' onClick={onSave}>저장</Button>
            </Space>
          </div>
        }
        <p/>
        <Datagrid
          gridId={TAB_CODE.부적합관리+'_GRID'}
          ref={gridRef}
          gridMode={gridMode}
          columns={REJECT_COLUMNS}
          gridComboInfo={REJECT_COMBO_INFO}
          data={data}
          height={400}
        />
      </Container>

      {contextHolder}

      <GridPopup
        title='부적합 항목 추가'
        okText='추가하기'
        cancelText='취소'
        onCancel={() => {
          setPopupVisible(false);
        }}
        gridMode='create'
        popupId={TAB_CODE.부적합관리+'_GRID'+'_POPUP'}
        gridId={TAB_CODE.부적합관리+'_GRID'+'_POPUP_GRID'}
        ref={popupGridRef}
        parentGridRef={gridRef}
        columns={REJECT_COLUMNS}
        gridComboInfo={REJECT_COMBO_INFO}
        rowAddPopupInfo={ROW_ADD_POPUP_INFO}
        saveUriPath={SAVE_URI_PATH}
        searchUriPath={SEARCH_URI_PATH}
        saveOptionParams={saveOptionParams}
        data={[]}
        saveType='basic'
        defaultVisible={false}
        visible={popupVisible}
      />
    </>
  );
  //#endregion


  return {
    component,

    gridMode,
    setGridMode,

    data,
    setData,

    searchParams,
    setSearchParams,

    saveOptionParams,
    setSaveOptionParams,

    onSearch,

    SEARCH_URI_PATH,
  }
}
//#endregion
