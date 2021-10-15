import Grid from '@toast-ui/react-grid';
import { message, Space, Modal } from 'antd';
import React, {useRef, useState } from 'react';
import { Button, Container, Datagrid, IGridColumn, IGridModifiedRows, TGridMode } from '~/components/UI';
import { checkGridData, getData, getModifiedRows, isModified, saveGridData } from '~/functions';
import { onDefaultGridCancel, onErrorMessage, TAB_CODE } from './work.page.util';
import dayjs from 'dayjs';



//#region 🔶✅공정순서
/** 공정순서 */
export const ROUTING = () => {
  //#region ✅설정값
  const [modal, contextHolder] = Modal.useModal();
  const gridRef = useRef<Grid>();

  const [gridMode, setGridMode] = useState<TGridMode>('view');

  const [data, setData] = useState([]);

  const [searchParams, setSearchParams] = useState({});
  const [saveOptionParams, setSaveOptionParams] = useState({});

  const SEARCH_URI_PATH = '/prd/work-routings';
  const SAVE_URI_PATH = '/prd/work-routings';


  //팝업 설정
  const popupGridRef = useRef<Grid>();
  const [popupVisible, setPopupVisible] = useState(false);
  //#endregion


  //#region ✅컬럼
  const ROUTING_COLUMNS:IGridColumn[] = [
    {header:'공정순서UUID', name:'work_routing_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
    {header:'생산실적UUID', name:'work_uuid', width:200, hidden:true, format:'text'},
    {header:'공정UUID', name:'proc_uuid', width:200, hidden:true, format:'text'},
    {header:'공정순서', name:'proc_no', width:100, hidden:false, format:'text'},
    {header:'공정', name:'proc_nm', width:120, hidden:false, format:'text'},
    {header:'작업장UUID', name:'workings_uuid', width:200, hidden:true, format:'text'},
    {header:'작업장', name:'workings_nm', width:120, hidden:false, format:'text'},
    {header:'설비UUID', name:'equip_uuid', width:200, hidden:true, format:'text'},
    {header:'설비', name:'equip_nm', width:120, hidden:false, format:'text'},
    {header:'수량', name:'qty', width:100, hidden:false, format:'number', editable:true},
    {header:'시작일자', name:'start_date', width:100, hidden:false, format:'date', editable:true},
    {header:'시작시간', name:'start_time', width:100, hidden:false, format:'time', editable:true},
    {header:'종료일자', name:'end_date', width:100, hidden:false, format:'date', editable:true},
    {header:'종료시간', name:'end_time', width:100, hidden:false, format:'time', editable:true},
    {header:'작업시간', name:'work_time', width:100, hidden:true, format:'number'},
    {header:'비고', name:'remark', width:150, hidden:false, format:'text', editable:true},
  ];
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

    if ((searchParams as any)?.complete_fg == 'true') {
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

    if ((searchParams as any)?.complete_fg == 'true') {
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

    if ((searchParams as any)?.complete_fg == 'true') {
      onErrorMessage('완료된작업시도');
      return;
    }

    setPopupVisible(true);
  }


  const onCancel = (ev) => {
    onDefaultGridCancel(gridRef, ROUTING_COLUMNS, modal,
      () => {
        setGridMode('view');
        onSearch();
      }
    );
  }

  const popupOnSave = () => {
    onSave(popupGridRef, 'create');
  }

  const onCheckedSave = () => {
    if (isModified(gridRef, ROUTING_COLUMNS)) { // 편집 이력이 있는 경우
      modal.confirm({
        icon: null,
        title: '저장',
        // icon: <ExclamationCircleOutlined />,
        content: '편집된 내용을 저장하시겠습니까?',
        onOk: async () => {
          onSave();
        },
      });

    } else {
      message.warn('저장할 데이터가 없습니다.');
    }
  }


  const onSave = async (ref?, popupGridMode?) => {
    // onDefaultGridSave('basic', gridRef, WORKER_COLUMNS, SAVE_URI_PATH, {}, modal,
    //   () => {
    //     setGridMode('view');
    //     onSearch();
    //   }
    // );

    const modifedRows = getModifiedRows(ref ?? gridRef, ROUTING_COLUMNS);
    const _gridMode = popupGridMode ?? gridMode; 
    
    // date + time 작업을 해줘야함 (❗datetime picker 스타일 깨지는 문제 복구하거나 아예 editor를 만들고 나면 고쳐야함)

    const saveData:IGridModifiedRows =
      _gridMode === 'create' ?
        {
          createdRows: modifedRows.createdRows,
          updatedRows: [],
          deletedRows: []
        }
      : _gridMode === 'update' ?
        {
          createdRows: [],
          updatedRows: modifedRows.updatedRows,
          deletedRows: []
        }
      : _gridMode === 'delete' ?
        {
          createdRows: [],
          updatedRows: [],
          deletedRows: modifedRows.deletedRows,
        }
      : {
          createdRows: modifedRows.createdRows,
          updatedRows: [],
          deletedRows: []
        };


    await saveData[_gridMode+'dRows']?.forEach((el) => {
      if (el['start_date'] != null && el['start_time'] != null) {
        let time = el['start_time'];

        if (String(time)?.length !== 5) {
          time = dayjs(time).format('HH:mm');
        }

        const start_date = dayjs(el['start_date']).format('YYYY-MM-DD') + ' ' + time;
        el['start_date'] = dayjs(start_date).locale('ko').format('YYYY-MM-DD HH:mm:ss');
      }
      

      if (el['end_date'] != null && el['end_time'] != null) {
        let time = el['end_time'];

        if (String(time)?.length !== 5) {
          time = dayjs(time).format('HH:mm');
        }

        const end_date = dayjs(el['end_date']).format('YYYY-MM-DD') + ' ' + time;
        el['end_date'] = dayjs(end_date).locale('ko').format('YYYY-MM-DD HH:mm:ss');
      }

      delete el['start_time'];
      delete el['end_time'];
    });


    // 저장 가능한지 체크
    const chk:boolean = await checkGridData(ROUTING_COLUMNS, saveData);

    if (chk === false) return;

    saveGridData(saveData, ROUTING_COLUMNS, SAVE_URI_PATH, saveOptionParams).then(() => {
      onSearch();
      setGridMode('view');
      setPopupVisible(false);
    });
  }
  //#endregion


  //#region ✅렌더부
  const component = (
    <>
      <Container>
        {gridMode === 'view' ?
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={onDelete} disabled={true}>삭제</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={onEdit}>수정</Button>
              <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onAppend} disabled={true}>신규 추가</Button>
            </Space>
          </div>
          :
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='cancel' colorType='blue' onClick={onCancel}>취소</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='ok' colorType='blue' onClick={onCheckedSave}>저장</Button>
            </Space>
          </div>
        }
        <p/>
        <Datagrid
          gridId={TAB_CODE.공정순서+'_GRID'}
          ref={gridRef}
          gridMode={gridMode}
          columns={ROUTING_COLUMNS}
          data={data}
          height={400}
        />
      </Container>

      {contextHolder}
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