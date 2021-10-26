import Grid from '@toast-ui/react-grid';
import { Space, Col, Row, message, Spin } from 'antd';
import { FormikProps, FormikValues } from 'formik';
import React, { MutableRefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Container, Datagrid, GridPopup, IGridColumn, TGridMode } from '~/components/UI';
import { IInputGroupboxItem, InputGroupbox } from '~/components/UI/input-groupbox/input-groupbox.ui';
import { cloneObject, executeData, getData, getInspCheckResultInfo, getInspCheckResultTotal, getInspCheckResultValue, getPageName, getPermissions, getUserFactoryUuid, isNumber } from '~/functions';
import { onErrorMessage, TAB_CODE } from './work.page.util';

//#region 🔶🚫공정검사
export const INSP = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region ✅설정값
  const gridRef = useRef<Grid>();
  const detailGridRef = useRef<Grid>();
  const inputRef = useRef<FormikProps<FormikValues>>();

  const [headerGridMode, setHeaderGridMode] = useState<TGridMode>('select');
  const [detailGridMode, setDetailGridMode] = useState<TGridMode>('view');

  const [headerData, setHeaderData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [newDetailData, setNewDetailData] = useState([]);

  const [headerSaveOptionParams, setHeaderSaveOptionParams] = useState({});
  const [detailSaveOptionParams, setDetailSaveOptionParams] = useState({});

  const [maxSampleCnt, setMaxSampleCnt] = useState(0); // max 시료수

  const HEADER_SEARCH_URI_PATH      = '/qms/proc/insp-results';
  const DETAIL_STD_SEARCH_URI_PATH  = '/qms/proc/insp/include-details';
  const DETAIL_SEARCH_URI_PATH      = '/qms/proc/insp-result/$/include-details';

  const SAVE_URI_PATH = '/qms/proc/insp-results';

  // 팝업 관련 설정
  const popupGridRef = useRef<Grid>();
  const popupInputRef = useRef<FormikProps<FormikValues>>();
  const [popupVisible, setPopupVisible] = useState<boolean>(false);

  //#endregion

  useLayoutEffect(() => {
    if(!popupVisible){
      popupInputRef.current?.resetForm();
      onSearch(headerSaveOptionParams);
    }
  }, [popupVisible])

  //#region 🚫컬럼정보
  const INSP_COLUMNS:IGridColumn[] = [
    {header:'검사성적서UUID', name:'insp_result_uuid', alias:'uuid', width:200, hidden:true},
    {header:'검사유형코드', name:'insp_type_cd', width:200, hidden:true},
    {header:'검사유형명', name:'insp_type_nm', width:120, hidden:true},
    {header:'검사유형', name:'insp_detail_type_nm', width:120, hidden:false},
    {header:'생산실적UUID', name:'work_uuid', width:200, hidden:true},
    {header:'차수', name:'seq', width:80, hidden:false},
    {header:'검사기준서UUID', name:'insp_uuid', width:200, hidden:true},
    {header:'검사기준서 번호', name:'insp_no', width:200, hidden:true},
    {header:'검사일시', name:'reg_date', width:100, hidden:false},
    {header:'검사자UUID', name:'emp_uuid', width:100, hidden:true},
    {header:'검사자', name:'emp_nm', width:100, hidden:false},
    {header:'판정여부', name:'insp_result_fg', width:100, hidden:true},
    {header:'판정', name:'insp_result_state', width:100, hidden:false},
    {header:'비고', name:'remark', width:150, hidden:false},
  ];

  const INSP_DETAIL_BASIC_COLUMNS:IGridColumn[] = [
    {header:'검사성적서 상세정보UUID', name:'insp_result_detail_info_uuid', alias:'uuid', width:200, hidden:true},
    {header:'검사성적서UUID', name:'insp_result_uuid', width:200, hidden:true},
    {header:'검사기준서 상세UUID', name:'insp_detail_uuid', width:200, hidden:true},
    {header:'검사항목 유형UUID', name:'insp_item_type_uuid', width:200, hidden:true},
    {header:'검사항목 유형명', name:'insp_item_type_nm', width:120, hidden:false},
    {header:'검사항목UUID', name:'insp_item_uuid', width:200, hidden:true},
    {header:'검사항목명', name:'insp_item_nm', width:120, hidden:false},
    {header:'검사 기준', name:'spec_std', width:120, hidden:false},
    {header:'최소 값', name:'spec_min', width:100, hidden:false, format:'number'},
    {header:'최대 값', name:'spec_max', width:100, hidden:false, format:'number'},
    {header:'검사방법UUID', name:'insp_method_uuid', width:120, hidden:true},
    {header:'검사방법명', name:'insp_method_nm', width:120, hidden:false},
    {header:'검사구UUID', name:'insp_tool_uuid', width:120, hidden:true},
    {header:'검사구명', name:'insp_tool_nm', width:120, hidden:false},
    {header:'정렬', name:'sortby', width:120, hidden:true},
    {header:'시료 수량', name:'sample_cnt', width:100, hidden:false},
    {header:'검사 주기', name:'insp_cycle', width:100, hidden:false},
  ];

  const INSP_DETAIL_COLUMNS = useMemo(
    () => {
      let items:IGridColumn[] = INSP_DETAIL_BASIC_COLUMNS;

      if (maxSampleCnt > 0) {
        //시료수 최대값에 따라 컬럼 생성
        for (let i = 1; i <= maxSampleCnt; i++) {
          items.push({header:'x'+ i +'_insp_result_detail_value_uuid', name:'x'+ i +'_insp_result_detail_value_uuid', width:80, hidden:true});
          items.push({header:'x'+ i +'_sample_no', name:'x'+ i +'_sample_no', width:80, hidden:true});
          items.push({header:'x'+ i, name:'x'+ i +'_insp_value', width:80, hidden:false, editable:true, align:'center'});
          items.push({header:'x'+ i +'_insp_result_fg', name:'x'+ i +'_insp_result_fg', width:80, format:'text', hidden:true});
          items.push({header:'x'+ i +'_insp_result_state', name:'x'+ i +'_insp_result_state', width:80,  format:'text', hidden:true});
        }
      }
      
      items.push({header:'합격여부', name:'insp_result_fg', width:120, hidden:true})
      items.push({header:'판정', name:'insp_result_state', width:100, hidden:false})
      items.push({header:'비고', name:'remark', width:150, hidden:false})

      return items;

    }, [INSP_DETAIL_BASIC_COLUMNS, maxSampleCnt]
  );

  const onAfterChange = (ev:any) => {
    const {origin, changes, instance} = ev;
    if (changes.length===0) return;
    
    const {columnName, rowKey, value} = changes[0];
    
    if ((origin !== 'cell' && origin !== 'delete' )  || !columnName?.includes('_insp_value')) return;
    
    const {rawData} = instance?.store?.data;
    const rowData = rawData[rowKey];

    const specMin = rowData?.spec_min;
    const specMax = rowData?.spec_max;

    let sampleCnt:any = rowData?.sample_cnt; //입력 가능한 시료수
    let nullFg:boolean = true;
    let resultFg:boolean = true;
    let emptyFg:boolean;

    const popupGridInstance = popupGridRef.current?.getInstance();
    const popupInputboxInstance = popupInputRef.current;

    //#region ✅CELL단위 합/불 판정
    [nullFg, resultFg] = getInspCheckResultValue(value, {specMin, specMax});
    
    const cellFlagColumnName = String(columnName)?.replace('_insp_value', '_insp_result_fg');
    const cellStateColumnName = String(columnName)?.replace('_insp_value', '_insp_result_state');
    const cellFlagResultValue = nullFg ? null : resultFg;
    const cellStateResultValue = nullFg ? '' : resultFg ? '합격' : '불합격';

    if (!isNumber(specMin) && !isNumber(specMax)) {
      if (resultFg === true ) {
        popupGridInstance?.setValue(rowKey, columnName, 'OK');  
      } else {
        popupGridInstance?.setValue(rowKey, columnName, 'NG');  
      }
    }

    popupGridInstance?.setValue(rowKey, cellFlagColumnName, cellFlagResultValue);
    popupGridInstance?.setValue(rowKey, cellStateColumnName, cellStateResultValue); 
    //#endregion

    //#region ✅ROW단위 합/불 판정
    if (resultFg === true) { // 현재 값이 합격일 경우만 다른 cell의 판정값 체크
      [nullFg, resultFg] = getInspCheckResultInfo(rowData, rowKey, {maxCnt: sampleCnt});
    }

    const rowFlagColumnName = 'insp_result_fg';
    const rowStateColumnName = 'insp_result_state';
    const rowFlagResultValue = nullFg ? null : resultFg;
    const rowStateResultValue = nullFg ? '' : resultFg ? '합격' : '불합격';

    popupGridInstance?.setValue(rowKey, rowFlagColumnName, rowFlagResultValue);
    popupGridInstance?.setValue(rowKey, rowStateColumnName, rowStateResultValue); 
    //#endregion

    //#region ✅최종 합/불 판정
    const maxRowCnt = popupGridInstance?.getRowCount() - 1;
    if (resultFg === true){
      [nullFg, resultFg, emptyFg] = getInspCheckResultTotal(rawData, maxRowCnt);
    } else {
      [nullFg, resultFg] = [false, false]
    }
    
    const flagInputboxName = rowFlagColumnName;
    const stateInputboxName = rowStateColumnName;
    const flagInputboxValue = 
      emptyFg ? null
      : !resultFg ? false
      : nullFg ? null
      : resultFg ;
    const stateInputboxValue = 
      emptyFg ? ''
      : !resultFg ? '불합격'
      : nullFg ? '진행중'
      : '합격' ;

    popupInputboxInstance?.setFieldValue(flagInputboxName, flagInputboxValue);
    popupInputboxInstance?.setFieldValue(stateInputboxName, stateInputboxValue);
    //#endregion
  }
  
  const INSP_DETAIL_HEADER = {
    height:60,
    complexColumns: [
      {
        header: '작업자',
        name: '_worker',
        childNames:['worker_sample_cnt', 'worker_insp_cycle']
      },
      {
        header: '검사원',
        name: '_inspector',
        childNames:['inspector_sample_cnt', 'inspector_insp_cycle']
      },
    ]
  }
  //#endregion


  //#region 🚫입력상자
  const INSP_INPUT_ITEMS:IInputGroupboxItem[] = [
    {id:'insp_uuid', label:'검사기준서uuid', type:'text', hidden:true},
    {id:'insp_result_fg', label:'최종판정', type:'text', hidden:true},
    {id:'insp_result_state', label:'최종판정', type:'text', disabled:true, },
    {id:'seq', label:'검사차수', type:'text', disabled:true,},
    {id:'emp_uuid', label:'검사자UUID', type:'text', hidden:true},
    {id:'emp_nm', label:'검사자', type:'text', disabled:true, usePopup:true, popupKey:'사원관리', popupKeys:['emp_nm', 'emp_uuid'], params:{emp_status:'incumbent'}}, 
    // {id:'insp_type_cd', label:'검사유형', type:'text'},
    {id:'insp_type_nm', label:'검사유형', type:'text', disabled:true, hidden:true},
    {id:'insp_detail_type_cd', label:'검사유형', type:'combo', disabled:true, 
      dataSettingOptions:{
        codeName:'insp_detail_type_cd',
        textName:'insp_detail_type_nm',
        uriPath:'/adm/insp-detail-types',
        params: {
          insp_type_cd: 'PROC_INSP'
        }
      },
      onAfterChange: (ev) => {
        if (popupVisible && (ev != '-')) {
          getData(
            {
              insp_detail_type: 
              ev === 'PATROL_PROC' ? 'patrolProc' :
              ev === 'SELF_PROC' ? 'selfProc' : null,
              work_uuid: (headerSaveOptionParams as any)?.work_uuid
            },
            DETAIL_STD_SEARCH_URI_PATH, 
            'header-details'

          ).then((res) => {
            setMaxSampleCnt(res?.header?.max_sample_cnt);
            setNewDetailData(res?.details);
            popupInputRef.current.setFieldValue('insp_uuid',res?.header?.insp_uuid)
          });
          
        } else {
          setNewDetailData([]);
        };
      }
    },
    {id:'reg_date', label:'검사일자', type:'date', disabled:true,},
    {id:'reg_date_time', label:'검사시간', type:'time', disabled:true,},
    {id:'remark', label:'비고', type:'text', disabled:true,},
  ];
  //#endregion

  //#region 🚫함수
  const onSearch = (headerSaveOptionParams:{work_uuid?:string,prod_uuid?:string,lot_no?:string}) => {
    const {work_uuid, prod_uuid, lot_no} = headerSaveOptionParams;
    if(work_uuid){
      getData({
        work_uuid: String(work_uuid),
        insp_detail_type: 'all'
      }, HEADER_SEARCH_URI_PATH).then((res) => {
        setHeaderData(res);
        setHeaderSaveOptionParams({
          work_uuid, 
          prod_uuid, 
          lot_no
        });
        setHeaderGridMode('select');
        setDetailGridMode('view');
      });
    }
  }


  const onReset = (ev) => {
    setHeaderSaveOptionParams({});
    setDetailSaveOptionParams({});
    setHeaderData([]);
    setDetailData([]);
    setHeaderGridMode('select');
    setDetailGridMode('view');
  }


  const onDelete = (ev) => {
    if ((headerSaveOptionParams as any)?.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

  }


  const onEdit = (ev) => {
    if ((headerSaveOptionParams as any)?.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

  }


  const onAppend = (ev) => {
    if ((headerSaveOptionParams as any)?.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setPopupVisible(true);
  }


  const onCancel = (ev) => {

  }

  
  const onSave = async (ref?, popupGridMode=false) => {
    const popupMode:boolean = popupGridMode ? popupGridMode : true;
    const saveGridRef:MutableRefObject<Grid> = popupGridMode?detailGridRef:popupGridRef;
    const saveInputRef:MutableRefObject<FormikProps<FormikValues>> = popupGridMode ? inputRef : popupInputRef;
    
    let methodType:'delete' | 'post' | 'put' | 'patch' = popupGridMode?'post':'put';
    let headerData:object;
    let detailDatas:object[] = [];

    const saveGridInstance = saveGridRef?.current?.getInstance();
    const popupGridInstance = popupGridRef?.current?.getInstance();

    methodType = 'post';

    headerData = {
      work_uuid: (headerSaveOptionParams as any)?.work_uuid,
      insp_detail_type_cd: saveInputRef?.current?.values?.insp_detail_type_cd,
      insp_uuid: saveInputRef?.current?.values?.insp_uuid,
      prod_uuid: (headerSaveOptionParams as any)?.prod_uuid,
      lot_no: (headerSaveOptionParams as any)?.lot_no,
      emp_uuid:  saveInputRef?.current?.values?.emp_uuid,
      reg_date: saveInputRef?.current?.values?.reg_date + ' ' + saveInputRef?.current?.values?.reg_date_time + ':00',
      insp_result_fg: saveInputRef?.current?.values?.insp_result_fg,
      insp_qty: 0,
      pass_qty: 0,
      reject_qty: 0,
      remark: saveInputRef?.current?.values?.remark,
      factory_uuid: getUserFactoryUuid(),
    };
    for (let i = 0; i <= saveGridInstance.getRowCount() - 1 ; i++) {
      const values:object[] = [];
      const row = popupGridInstance?.getRow(i);

      for (let k = 1; k <= row.sample_cnt; k++) {
        const value:any = row?.['x'+k+'_insp_value'];
        if(value){
          values.push({
            sample_no: k,
            insp_result_fg: row?.['x'+k+'_insp_result_fg'],
            insp_value: value === 'OK' ? 1 : value === 'NG' ? 0 : value
          })
        }
      };

      detailDatas.push({
        values,
        factory_uuid: getUserFactoryUuid(),
        insp_detail_uuid: row?.insp_detail_uuid,
        insp_result_fg: row?.insp_result_fg,
        remark: row?.remark
      })
    }

    const saveData:object = ({
      header:headerData,
      details:detailDatas
    });
    await executeData(saveData, SAVE_URI_PATH, methodType, 'success').then((value) => {
      if (!value) return;
      message.info('저장되었습니다.')
      setPopupVisible(false);
    }).catch(e => {console.log(e)});
  }
  //#endregion


  //#region ✅사이드 이펙트
  // 헤더 데이터가 없으면 우측 데이터들 초기화
  useEffect(() => {
    if (headerData?.length === 0) {
      inputRef?.current?.resetForm();
      setDetailData([]);
    }
  }, [headerData]);
  //#endregion


  //#region 🚫렌더부
  const component = (
    !permissions ?
      <Spin spinning={true} tip='권한 정보를 가져오고 있습니다.' />
    :
    <>
      <Container>
        {detailGridMode === 'view' ?
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={onDelete} hidden={true} disabled={!permissions?.delete_fg}>삭제</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={onEdit} hidden={true} disabled={!permissions?.update_fg}>수정</Button>
              <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onAppend} disabled={!permissions?.create_fg}>신규 추가</Button>
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
        <Row gutter={[16,0]} style={{minHeight:440, maxHeight:440}}>
          <Col span={8}>
            <Datagrid
              gridId={TAB_CODE.공정검사+'_GRID'}
              ref={gridRef}
              gridMode={headerGridMode}
              columns={INSP_COLUMNS}
              data={headerData}
              height={400}
              onAfterChange={onAfterChange}
              onAfterClick={(ev) => {
                const {rowKey, targetType} = ev;
                if (targetType === 'cell' && headerGridMode === 'select') {
                  try {
                    const row = ev?.instance?.store?.data?.rawData[rowKey];
                    const insp_result_uuid = row?.insp_result_uuid;
                    const work_uuid = row?.work_uuid;
                    const URI_PATH = DETAIL_SEARCH_URI_PATH.replace('$', insp_result_uuid);
                    // 공정검사 상세 데이터 조회
                    getData({}, URI_PATH, 'header-details').then((res) => {
                      const {header, details} = res;
                      inputRef?.current?.setValues({...header, reg_date_time: header?.reg_date});
                      setDetailData(details);
                      setDetailSaveOptionParams({work_uuid});
                      setMaxSampleCnt(header?.max_sample_cnt);
                      
                      // 시료수 MAX값 가져오기
                      // getData(
                      //   {
                      //     insp_detail_type:
                      //       header?.insp_detail_type_cd === 'PATROL_PROC' ? 'patrolProc' :
                      //       header?.insp_detail_type_cd === 'SELF_PROC' ? 'selfProc' : null,
                      //     work_uuid
                      //   },
                      //   MAX_SEQ_SEARCH_URI_PATH,
                      //   'string'
                      // ).then((res) => {
                      //   const {seq} = res;
                      //   setMaxSeq(seq);
                      // });
                    });
                  } catch(e) {
                    console.log(e);
                  } finally {
                    // setLoading(false);
                  }
                }
              }}
            />
          </Col>
          <Col span={16} style={{minHeight:440, maxHeight:440, overflow:'auto'}}>
            <InputGroupbox
              id={TAB_CODE.공정검사+'_INPUT_GROUP_BOX'}
              inputItems={INSP_INPUT_ITEMS}
              innerRef={inputRef}
            />
            <Datagrid
              gridId={TAB_CODE.공정검사+'_DETAIL_GRID'}
              ref={detailGridRef}
              gridMode={detailGridMode}
              columns={INSP_DETAIL_COLUMNS}
              header={INSP_DETAIL_HEADER}
              data={detailData}
            />
          </Col>
        </Row>
      </Container>
      
      <GridPopup
        title='데이터 추가하기'
        onOk={onSave}
        okText='추가하기'
        cancelText='취소'
        onCancel={() => {
          // TUIP_PROD_onSearch();
          setPopupVisible(false);
        }}
        gridMode='create'
        popupId={'INSP_GRID_POPUP_POPUP'}
        gridId={'INSP_GRID_POPUP'}
        ref={popupGridRef}
        parentGridRef={gridRef}
        header={INSP_DETAIL_HEADER}
        columns={INSP_DETAIL_COLUMNS}
        inputProps={{
          id: 'INSP_DETAIL_GRID_POPUP_INPUT',
          inputItems:cloneObject(INSP_INPUT_ITEMS)?.map((el) => {
            if (['emp_nm', 'insp_detail_type_cd', 'reg_date', 'reg_date_time', 'remark'].includes(el.id)) {
              el['disabled'] = false;
            }
            return el;
          }),
          innerRef: popupInputRef,
        }}

        onAfterChange={onAfterChange}

        saveUriPath={SAVE_URI_PATH}
        searchUriPath={DETAIL_SEARCH_URI_PATH}
        // saveOptionParams={tuipWorkerSaveOptionParams}
        // setParentData={TUIP_WORKER_setData}
        data={newDetailData}
        // defaultData={newDetailData}
        saveType='basic'
        defaultVisible={false}
        visible={popupVisible}
        
      />
    </>
  );
  //#endregion


  return {
    component,

    onReset,
    onSearch,

    headerGridMode,
    setHeaderGridMode,

    detailGridMode,
    setDetailGridMode,

    headerData,
    setHeaderData,

    detailData,
    setDetailData,

    headerSaveOptionParams,
    setHeaderSaveOptionParams,

    detailSaveOptionParams,
    setDetailSaveOptionParams,

    HEADER_SEARCH_URI_PATH,
    DETAIL_STD_SEARCH_URI_PATH,
    DETAIL_SEARCH_URI_PATH,
  }
}
//#endregion