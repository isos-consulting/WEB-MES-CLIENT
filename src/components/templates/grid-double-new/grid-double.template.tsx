import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import '~styles/grid.style.scss';
import {Container} from '~/components/UI/container';
import {Datagrid} from '~/components/UI/datagrid-new';
import { doubleGridEvents } from './grid-double.template.reducer';
import { useRecoilState } from 'recoil';
import { useLoadingState } from '~/hooks';
import {afPopupVisible, GridPopup} from '~components/UI/popup-datagrid';
import { Modal, Space, Row, Col, message } from 'antd';
import { Button } from '~components/UI/button';
import {Div} from '~/components/UI/div';
import Props from './grid-double.template.type';
import { Searchbox } from '~/components/UI';
import { InputGroupbox } from '~/components/UI/input-groupbox/input-groupbox.ui';
import { FormikProps, FormikValues } from 'formik';
import { useEffect } from 'react';


const {onCancel, onDeleteMode, onSave, onSearch, onUpdateMode, onShowNewCreatePopup, onShowDetailCreatePopup} = doubleGridEvents;


export const TpDoubleGrid:React.FC<Props> = (props) => {
  //#region 🔶액션
  const [,setLoading] = useLoadingState();
  const [,setNewCreatePopupVisible] = useRecoilState(afPopupVisible(props.createNewPopupGridItems.gridId));
  const [,setDetailCreatePopupVisible] = useRecoilState(afPopupVisible(props.createDetailPopupGridItems.gridId));
  const [modal, contextHolder] = Modal.useModal();

  const {header, detail} = props;

  const [cPopupVisible, setCPopupVisible] = useRecoilState(afPopupVisible(props.createNewPopupGridItems.gridId));
  const [dcPopupVisible, setDCPopupVisible] = useRecoilState(afPopupVisible(props.createDetailPopupGridItems.gridId));


  
  const newInputRef = useRef<FormikProps<FormikValues>>();
  const newInputProps = useMemo(() => {
    return {
      id:props.inputProps.id + '/new',
      inputItems: props.inputProps.inputItems,
      innerRef: newInputRef
    }
  }, [props.inputProps, newInputRef]);
  
  const newDetailInputRef = useRef<FormikProps<FormikValues>>();
  const newDetailInputProps = useMemo(() => {
    return {
      id:props.inputProps.id + '/new-detail',
      inputItems: props.inputProps.inputItems,
      innerRef: newDetailInputRef
    }
  }, [props.inputProps, newDetailInputRef]);

  // useEffect(() => {
  //   if (cPopupVisible === true) {
  //     setNewInit();
  //   }
  // }, [cPopupVisible, props.inputProps, newInputRef]);

  useEffect(() => {
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
    const values = props.inputProps.innerRef?.current.values;
    newInputRef.current?.setValues(values);
  }


  const _onShowNewCreatePopup = useCallback(
    () => {
      onShowNewCreatePopup(setNewCreatePopupVisible);
    },
    [setNewCreatePopupVisible],
  );


  const setNewDetailInit = async () => {
    const values = props.inputProps.innerRef?.current.values;
    newDetailInputRef.current?.setValues(values);
  }


  const _onShowDetailCreatePopup = useCallback(
    () => {
      onShowDetailCreatePopup(setDetailCreatePopupVisible);
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
      onSave(props.saveType, detail.gridRef, detail.gridDispatch, detail.gridItems.columns, detail.saveUriPath, detail.saveOptionParams, modal);
    },
    [props.saveType, detail.gridRef, detail.gridDispatch, detail.gridItems.columns, detail.saveUriPath, detail.saveOptionParams, modal],
  );
  //#endregion



  return (
    <>
    <Row gutter={[16,0]}>
      {props.pageType !== 'report' ?
        props.gridMode === 'view' ?
          <Div divType='singleGridButtonsDiv' optionType={{singleGridtype:'view'}}> 
            <Space size={[5,0]}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={props.onDeleteMode || _onDeleteMode}>삭제</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={props.onUpdateMode || _onUpdateMode}>수정</Button>
              <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={props.onShowDetailCreatePopup || _onShowDetailCreatePopup}>세부 항목 추가</Button>
            </Space>
            <Space size={[5,0]}>
              {props.searchProps == null ? <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='search' colorType='blue' onClick={props.onSearch || _onSearch}>조회</Button> : null}
              <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={props.onShowNewCreatePopup || _onShowNewCreatePopup} disabled={props.newCreateBtnDisabled}>신규 항목 추가</Button>
            </Space>
          </Div>
        :
          <Div divType='singleGridButtonsDiv' optionType={{singleGridtype:'view'}}>
            <Space size={[5,0]}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='cancel' colorType='blue' onClick={props.onCancel ||_onCancel}>취소</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small'ImageType='ok' colorType='blue' onClick={props.onSave ||_onSave}>저장</Button>
            </Space>
          </Div>
      : null}
      <Col span={8}>
        <Searchbox {...props.searchProps}/>
        <Container >
          <Datagrid {...header.gridItems} ref={header.gridRef}/>
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
        saveOptionParams={props.saveOptionParams}
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
        saveOptionParams={props.saveOptionParams}
        searchUriPath={props.searchUriPath}
        setParentData={props.setParentData}
        parentGridRef={props.parentGridRef}
        saveType={props.saveType || 'basic'}
        inputProps={newDetailInputProps}
        data={[]}
      />
      {contextHolder}
    </Row>
    </>
  )
}