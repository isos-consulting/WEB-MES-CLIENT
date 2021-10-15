import React, { useCallback } from 'react';
import '~styles/grid.style.scss';
import {Container} from '~/components/UI/container';
import {Datagrid} from '~/components/UI/datagrid-new';
import {singleGridEvents} from './grid-single.template.reducer';
import { useRecoilState } from 'recoil';
import { useLoadingState } from '~/hooks';
import {afPopupVisible, GridPopup} from '~components/UI/popup-datagrid';
import { Modal, Row, Space } from 'antd';
import { Button } from '~components/UI/button';
import {Div} from '~/components/UI/div';
import Props from './grid-single.template.type';
import { Searchbox } from '~/components/UI';
import { InputGroupbox } from '~/components/UI/input-groupbox/input-groupbox.ui';


const {onCancel, onDeleteMode, onSave, onSearch, onShowCreatePopup, onUpdateMode} = singleGridEvents;


export const TpSingleGrid:React.FC<Props> = (props) => {
  //#region 🔶액션
  const [,setLoading] = useLoadingState();
  const [,setCreatePopupVisible] = useRecoilState(afPopupVisible(props.createPopupGridItems.gridId));
  const [modal, contextHolder] = Modal.useModal();


  const _onSearch = useCallback(
    () => {
      onSearch(props.gridRef, props.gridDispatch, props.searchUriPath, props.searchParams, props.gridItems.columns, setLoading);
    },
    [props.gridRef, props.gridDispatch, props.searchUriPath, props.searchParams, props.gridItems.columns, setLoading],
  );

  
  const _onDeleteMode = useCallback(
    () => {
      onDeleteMode(props.gridDispatch);
    },
    [props.gridDispatch],
  );
  

  const _onUpdateMode = useCallback(
    () => {
      onUpdateMode(props.gridDispatch);
    },
    [props.gridDispatch],
  );


  const _onShowCreatePopup = useCallback(
    () => {
      onShowCreatePopup(setCreatePopupVisible);
    },
    [setCreatePopupVisible],
  );


  const _onCancel = useCallback(
    () => {
      onCancel(props.gridRef, props.gridDispatch, props.gridItems.columns, modal);
    },
    [props.gridRef, props.gridDispatch, props.gridItems.columns, modal],
  );


  const _onSave = useCallback(
    () => {
      onSave(props.saveType, props.gridRef, props.gridDispatch, props.gridItems.columns, props.saveUriPath, props.saveOptionParams, modal);
    },
    [props.saveType, props.gridRef, props.gridDispatch, props.gridItems.columns, props.saveUriPath, props.saveOptionParams, modal],
  );
  //#endregion


  return (
    <Row gutter={[16,0]}>
        {props.pageType !== 'report' ?
          props.gridItems.gridMode === 'view' ?
            <Div divType='singleGridButtonsDiv' optionType={{singleGridtype:'view'}}> 
              <Space size={[5, null]}>
                <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='delete' onClick={props.onDeleteMode || _onDeleteMode}>삭제</Button>
                <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={props.onUpdateMode || _onUpdateMode}>수정</Button>
                <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={props.onShowCreatePopup || _onShowCreatePopup}>신규 항목 추가</Button>
              </Space>
              <Space size={[5, null]}>
                {props.searchProps ? null :<Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='search' colorType='blue' onClick={props.onSearch || _onSearch}>조회</Button>}
              </Space>
            </Div>
            :
            <Div divType='singleGridButtonsDiv' optionType={{singleGridtype:'update'}}>
              <Space size={[5, null]}>
                <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='cancel' colorType='blue' onClick={props.onCancel ||_onCancel}>취소</Button>
                <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='ok' colorType='blue' onClick={props.onSave ||_onSave}>저장</Button>
              </Space>
            </Div>
        :null}

      {props.searchProps ? <Searchbox {...props.searchProps} /> : null}
      {props.inputProps ? <InputGroupbox {...props.inputProps} /> : null}
      <Container>
        <Datagrid  {...props.gridItems} ref={props.gridRef}/>
      </Container>
      
      <GridPopup
        {...props.createPopupGridItems}
        popupId={props.createPopupGridItems.gridId}
        ref={props.createPopupGridRef}
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
      />

      {contextHolder}
    </Row>
  )
}