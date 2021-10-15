import React, { useCallback, useMemo, useRef, useState } from 'react';
import '~styles/grid.style.scss';
import {Container} from '~/components/UI/container';
import {Datagrid} from '~/components/UI/datagrid-new';
import { trippleGridEvents } from './qms-insp.template.reducer';
import { useRecoilState } from 'recoil';
import { useLoadingState } from '~/hooks';
import {afPopupVisible, GridPopup} from '~components/UI/popup-datagrid';
import { Modal, Space, Row, Col, message } from 'antd';
import { Button } from '~components/UI/button';
import {Div} from '~/components/UI/div';
import Props from './qms-insp.template.type';
import { Searchbox } from '~/components/UI';
import { InputGroupbox } from '~/components/UI/input-groupbox/input-groupbox.ui';
import { FormikProps, FormikValues } from 'formik';
import { useLayoutEffect } from 'react';
import dayjs from 'dayjs';


const {onCancel, onDeleteMode, onSave, onSearch, onUpdateMode, onShowNewCreatePopup, onShowDetailCreatePopup} = trippleGridEvents;


export const TpTrippleGrid:React.FC<Props> = (props) => {
  //#region 🔶액션
  const [,setLoading] = useLoadingState();
  const [CPOPUP_FLAG, SET_CPOPUP_FLAG] = useState(false);
  const [DCPOPUP_FLAG, SET_DCPOPUP_FLAG] = useState(false);
  const [cPopupVisible, setNewCreatePopupVisible] = useRecoilState(afPopupVisible(props.createNewPopupGridItems.gridId));
  const [dcPopupVisible ,setDetailCreatePopupVisible] = useRecoilState(afPopupVisible(props.createDetailPopupGridItems.gridId));
  const [modal, contextHolder] = Modal.useModal();

  const {header, headerContent, detail} = props;

  
  // const newInputRef = useRef<FormikProps<FormikValues>>();
  const newInputProps = useMemo(() => {
    return {
      id: props.newCreateInputProps.id,
      inputItems: props.newCreateInputProps.inputItems,
      innerRef: props.newCreateInputProps.innerRef
    }
  }, [props.newCreateInputProps]);
  
  const newDetailInputRef = useRef<FormikProps<FormikValues>>();
  const newDetailInputProps = useMemo(() => {
    return {
      id:props.inputProps.id + '/new-detail',
      inputItems: props.inputProps.inputItems,
      innerRef: newDetailInputRef
    }
  }, [props.inputProps, newDetailInputRef]);


  useLayoutEffect(() => {
    if (cPopupVisible === true) {
      setNewInit();
    }
  }, [cPopupVisible, props.searchParams, props.newCreateInputProps]);

  useLayoutEffect(() => {
    if (dcPopupVisible === true) {
      setNewDetailInit();
    }
  }, [dcPopupVisible, props.inputProps, newDetailInputRef]);

  


  const _onSearch = useCallback(
    () => {
      onSearch(header.gridRef, header.gridDispatch, header.searchUriPath, header.searchParams, header.gridItems.columns, setLoading);
    },
    [header.gridRef, header.gridDispatch, header.searchUriPath, header.searchParams, header.gridItems.columns, setLoading],
  );

  
  const _onDeleteMode = useCallback(
    () => {
      onDeleteMode(detail.gridDispatch);
    },
    [detail.gridDispatch],
  );
  

  const _onUpdateMode = useCallback(
    () => {
      onUpdateMode(detail.gridDispatch);
    },
    [detail.gridDispatch],
  );


  
  const setNewInit = async () => {
    const input = props.inputProps.innerRef?.current.values;
    const search = props.searchProps.innerRef?.current.values;
    if (input?.prod_uuid == null) {
      message.info('품번을 선택한후 다시 시도해주세요.');
      return false;
    } else {
      newInputProps?.innerRef?.current?.setFieldValue('insp_type_cd', search?.insp_type_cd);
      newInputProps?.innerRef?.current?.setFieldValue('prod_uuid', input?.prod_uuid);
      newInputProps?.innerRef?.current?.setFieldValue('prod_no', input?.prod_no);
      newInputProps?.innerRef?.current?.setFieldValue('prod_nm', input?.prod_nm);
      newInputProps?.innerRef?.current?.setFieldValue('reg_date', dayjs().format('YYYY-MM-DD'));
      return true;
    }
  }


  const _onShowNewCreatePopup = useCallback(
    () => {
      // setNewInit().then(() => {
        onShowNewCreatePopup(setNewCreatePopupVisible);
      // });
    },
    [setNewCreatePopupVisible],
  );

  
  const setNewDetailInit = async () => {
    const values = props.inputProps.innerRef?.current.values;
    newDetailInputRef.current?.setValues(values);

    return true;
  }


  const _onShowDetailCreatePopup = useCallback(
    () => {
      // setNewDetailInit().then(() => {
        onShowDetailCreatePopup(setDetailCreatePopupVisible);
      // });
    },
    [setDetailCreatePopupVisible],
  );


  const _onCancel = useCallback(
    () => {
      onCancel(detail.gridRef, detail.gridDispatch, detail.gridItems.columns, modal);
    },
    [detail.gridRef, detail.gridDispatch, detail.gridItems.columns, modal],
  );


  const _onSave = useCallback(
    () => {
      onSave(props.saveType, detail.gridRef, detail.gridDispatch, detail.gridItems.columns, detail.saveUriPath, props.saveOptionParams, modal);
    },
    [props.saveType, detail.gridRef, detail.gridDispatch, detail.gridItems.columns, detail.saveUriPath, props.saveOptionParams, modal],
  );
  //#endregion

  const onCPopup = () => {
    setNewInit().then(res => {
      if (res) {
        _onShowNewCreatePopup();
      }
    });
  }

  const onDCPopup = () => {
    setNewDetailInit().then(res => {
      if (res) {
        _onShowDetailCreatePopup();
      }
    });
  }

 const onAmend = () => {

 }

  return (
    <Row gutter={[16,0]}>
      {props.gridMode === 'view' ?
        <Div divType='singleGridButtonsDiv' optionType={{singleGridtype:'view'}}> 
          <Space size={[5,0]}>
            <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={props.onShowDetailCreatePopup || onAmend}>기준서 개정</Button>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={props.onDeleteMode || _onDeleteMode}>삭제</Button>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={props.onUpdateMode || _onUpdateMode}>수정</Button>
            <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={props.onShowDetailCreatePopup || onDCPopup}>세부 항목 추가</Button>
          </Space>
          <Space size={[5,0]}>
            {props.searchProps == null ? <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='search' colorType='blue' onClick={props.onSearch || _onSearch}>조회</Button> : null}
            <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={props.onShowNewCreatePopup || onCPopup}>신규 항목 추가</Button>
          </Space>
        </Div>
        :
        <Div divType='singleGridButtonsDiv' optionType={{singleGridtype:'view'}}>
          <Space size={[5,0]}>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='cancel' colorType='blue' onClick={props.onCancel ||_onCancel}>취소</Button>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='ok' colorType='blue' onClick={props.onSave ||_onSave}>저장</Button>
          </Space>
        </Div>
      }

      <Col span={8}>
        <Searchbox {...props.searchProps} />
        <Container>
          <Datagrid {...header.gridItems} ref={header.gridRef}/>
        </Container>
        <Container>
          <Datagrid {...headerContent.gridItems} ref={headerContent.gridRef}/>
        </Container>
      </Col>

      <Col span={16}>
        <InputGroupbox {...props.inputProps} />
        <Container>
          <Datagrid {...detail.gridItems} ref={detail.gridRef}/>
        </Container>
      </Col>

      <GridPopup
        {...props.createNewPopupGridItems}
        popupId={props.createNewPopupGridItems.gridId}
        gridId={props.createNewPopupGridItems.gridId}
        ref={props.createNewPopupGridRef}
        defaultVisible={false}
        title='신규 항목 추가하기'
        okText='추가하기'
        cancelText='취소'
        saveUriPath={props.saveUriPath}
        saveOptionParams={props.createNewPopupSaveOptionParams}
        searchUriPath={props.searchUriPath}
        setParentData={props.setParentData}
        parentGridRef={props.parentGridRef}
        saveType={props.saveType || 'basic'}
        inputProps={newInputProps}
        data={[]}
      />

      <GridPopup
        {...props.createDetailPopupGridItems}
        popupId={props.createDetailPopupGridItems.gridId}
        gridId={props.createNewPopupGridItems.gridId}
        ref={props.createDetailPopupGridRef}
        defaultVisible={false}
        title='세부 항목 추가하기'
        okText='추가하기'
        cancelText='취소'
        saveUriPath={props.saveUriPath}
        saveOptionParams={props.createDetailPopupSaveOptionParams}
        searchUriPath={props.searchUriPath}
        setParentData={props.setParentData}
        parentGridRef={props.parentGridRef}
        saveType={props.saveType || 'basic'}
        inputProps={newDetailInputProps}
        data={[]}
      />
      
      {contextHolder}
    </Row>
  )
}