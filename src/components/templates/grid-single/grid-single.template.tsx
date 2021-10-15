import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Row, Space } from "antd";
import { Button, Container, Datagrid, Div, GridPopup, Modal, Searchbox } from "~/components/UI";
import { InputGroupbox} from "~/components/UI/input-groupbox/input-groupbox.ui";
import { useRecoilValue } from 'recoil';
import { layoutStore } from '~/components/UI/layout';
import Props from './grid-single.template.type';


export const TpSingleGrid:React.FC<Props> = (props) => {
  const grid = props.gridInfo;
  const gridRef = props.gridRef;
  const searchProps = props.searchProps;
  const inputProps = props.inputProps;
  
  const gridPopup = props.popupGridInfo[0];
  const gridPopupRef = props.popupGridRef[0];
  const gridPopupVisible = props.popupVisible[0];
  const setGridPopupVisible = props.setPopupVisible[0];
  const popupSearchProps = props.popupSearchProps ? props.popupSearchProps[0] : null;
  const popupInputProps = props.popupInputProps ? props.popupInputProps[0] : null;
  const onNewDataPopupAfterOk = props.onPopupAfterOk ? props.onPopupAfterOk[0] : null;
  
  const gridUpdatePopup = props.popupGridInfo[1];
  const gridUpdatePopupRef = props.popupGridRef[1];
  const gridUpdatePopupVisible = props.popupVisible[1];
  const setGridUpdatePopupVisible = props.setPopupVisible[1];
  const updatePopupSearchProps = props.popupSearchProps ? props.popupSearchProps[1] : null;
  const updatePopupInputProps = props.popupInputProps ? props.popupInputProps[1] : null;
  const onUpdateDataPopupAfterOk = props.onPopupAfterOk ? props.onPopupAfterOk[1] : null;

  const subTotalGrid = props.subGridInfo;
  const subTotalGridRef = props.subGridRef;
  
  // 검색상자가 전부 hidden이면 검색상자 컴포넌트 자체를 display하지 않습니다.
  const searchboxVisible = useMemo(
    () => {
      const searchItems = searchProps?.searchItems;
      let visible:boolean = false;

      for (let i = 0; i < searchItems?.length; i++) {
        if ([false, null, undefined].includes(searchItems[i]?.hidden)) {
          visible = true;
          break;
        }
      }

      return visible;
    },
    [searchProps],
  );

  const inputboxVisible = useMemo(
    () => {
      const inputItems = inputProps?.inputItems;
      let visible:boolean = false;

      for (let i = 0; i < inputItems?.length; i++) {
        if ([false, null, undefined].includes(inputItems[i]?.hidden)) {
          visible = true;
          break;
        }
      }

      return visible;
    },
    [inputProps],
  );

  
  /** 기타 헤더 버튼 */
  const extraButtons = useMemo(() => {
    return props.extraButtons?.map((el, index) =>
      <Button 
        key={'extraBtn_' + index}
        {...el}
        btnType={el.btnType || 'buttonFill'}
        heightSize={el.heightSize || 'small'}
        fontSize={el.fontSize || 'small'}
        colorType={el.colorType || 'primary'}
      >{el.text}</Button>
    );
  }, [props.extraButtons]);
  
  /** 기타 사용자 정의 팝업 */
  const extraModals = useMemo(() => {
    return props.extraModals?.map((el, index) =>
      <Modal
        key={'extraModal_' + index}
        {...el}/>
    );
  }, [props.extraModals]);

  /** 기타 사용자 정의 팝업 */
  const extraGridPopups = useMemo(() => {
    return props.extraGridPopups?.map((el, index) =>
      <GridPopup
        key={'extraGridPopup_' + index}
        {...el}/>
    );
  }, [props.extraGridPopups]);

  const {buttonActions} = props;


  //#region 🔶 그리드 자동 높이 맞춤
  const layoutState = useRecoilValue(layoutStore.state);
  const [gridHeight, setGridHeight] = useState(grid.height || 0);
  const [eventTrigger, setEventTrigger] = useState<boolean>(false); // 강제로 window resize 이벤트를 실행시키기 위한 트리거 상태 값입니다.

  const onResize = (ev) => {
    const screenHeight = ev.target.innerHeight;
    const actionButtonsHeight = document.getElementById('TEMPLATE_BUTTONS')?.clientHeight || 0;
    const subGridContainerHeight = document.getElementById('SUB_GRID_CONTAINER')?.clientHeight || 0;
    const searchboxHeight = document.getElementById(searchProps?.id)?.clientHeight || 0;
    const inputboxHeight = document.getElementById(inputProps?.id)?.clientHeight || 0;
    const gridHeaderHeight = grid?.header?.height || 30;

    const height = screenHeight - (actionButtonsHeight + subGridContainerHeight + searchboxHeight + inputboxHeight + gridHeaderHeight) - (layoutState.bottomSpacing + layoutState.contentSpacing);
    setGridHeight(height);
  }

  useLayoutEffect(() => {
    if (grid.height) return;
    window.addEventListener('resize', onResize, true);
    setEventTrigger(true);

    return () => {
      window.removeEventListener('resize', onResize, true);
    };
  }, []);

  useLayoutEffect(() => {
    if (!eventTrigger) return;
    // 강제로 resize 이벤트를 실행
    window.dispatchEvent(new Event('resize'));
    setEventTrigger(false);
  }, [eventTrigger]);

  useLayoutEffect(() => {
    onResize({target:{innerHeight: window.innerHeight}});
  }, [layoutState]);

  useLayoutEffect(() => {
    setEventTrigger(true);
  }, [subTotalGrid?.data]);
  //#endregion


  return (
    <>
    <Row gutter={[16,0]}>
      {props.templateType !== 'report' ?
        <Div id='TEMPLATE_BUTTONS' divType='singleGridButtonsDiv' optionType={{singleGridtype:'view'}}> 
          <Space size={[5,0]}>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='delete' onClick={buttonActions.delete} disabled={buttonActions.delete ? false : true}>삭제</Button>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={buttonActions.update}  disabled={buttonActions.update ? false : true}>수정</Button>
            <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={buttonActions.create} disabled={buttonActions.create == null}>신규 항목 추가</Button>
          </Space>
          <Space size={[5,0]}>
            {searchProps?.searchItems == null || !searchboxVisible ? <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='search' colorType='blue' onClick={buttonActions.search}>조회</Button> : null}
            {extraButtons}
          </Space>
        </Div>
      : null}

      <div style={props.templateType === 'report' ? {marginTop:-8, width:'100%'} : {width:'100%'}}>{searchProps != null ? searchboxVisible ? <Searchbox {...searchProps}/> : null : null}</div>
      {inputProps != null ? inputboxVisible ? <InputGroupbox {...inputProps} /> : null : null}
      {subTotalGrid && !subTotalGrid?.hidden ?
        <Container id='SUB_GRID_CONTAINER' title={'소계' + (props.subTitle ? (' - ' + props.subTitle) : '')}>
          <Datagrid {...subTotalGrid} ref={subTotalGridRef} height={230}/>
        </Container>
      : null}
      <Container>
        <Datagrid {...grid} height={gridHeight} ref={gridRef}/>
      </Container>

      {gridPopup == null ? null : 
        <GridPopup
          {...gridPopup}
          popupId={gridPopup.gridId+'_POPUP'}
          defaultVisible={false}

          title={props.title + ' - 신규 항목 추가'}
          visible={gridPopupVisible}
          
          okText='추가하기'
          cancelText='취소'
          onAfterOk={(isSuccess, savedData) => { 
            if (!isSuccess) return;

            if (onNewDataPopupAfterOk) {
              onNewDataPopupAfterOk(isSuccess, savedData);

            } else {
              buttonActions.search();
              setGridPopupVisible(false);
            }
          }}
          onCancel={() => setGridPopupVisible(false)}

          ref={gridPopupRef}
          parentGridRef={gridRef}

          gridId={gridPopup.gridId}
          gridMode='create'
          defaultData={[]}
          columns={gridPopup.columns}
          saveType={props.dataSaveType || 'basic'}
          searchUriPath={gridPopup.searchUriPath}
          searchParams={gridPopup.searchParams}
          saveUriPath={gridPopup.saveUriPath}
          saveParams={gridPopup.saveParams}

          searchProps={popupSearchProps}
          inputProps={popupInputProps}

          gridComboInfo={gridPopup.gridComboInfo}
          gridPopupInfo={gridPopup.gridPopupInfo}
          rowAddPopupInfo={gridPopup.rowAddPopupInfo}
        />
      }
      
      {gridUpdatePopup == null ? null : 
        <GridPopup
          {...gridUpdatePopup}
          popupId={gridUpdatePopup.gridId+'_POPUP'}
          defaultVisible={false}

          title={props.title + ' - 항목 수정'}
          visible={gridUpdatePopupVisible}
          
          okText='수정하기'
          cancelText='취소'
          onAfterOk={(isSuccess, savedData) => { 
            if (!isSuccess) return;

            if (onUpdateDataPopupAfterOk) {
              onUpdateDataPopupAfterOk(isSuccess, savedData);

            } else {
              buttonActions.search();
              setGridUpdatePopupVisible(false);
            }
          }}
          onCancel={() => setGridUpdatePopupVisible(false)}

          ref={gridUpdatePopupRef}
          parentGridRef={gridRef}

          gridId={gridUpdatePopup.gridId}
          gridMode='update'
          defaultData={grid.data}
          columns={gridUpdatePopup.columns}
          saveType={props.dataSaveType || 'basic'}
          searchUriPath={gridUpdatePopup.searchUriPath}
          searchParams={gridUpdatePopup.searchParams}
          saveUriPath={gridUpdatePopup.saveUriPath}
          saveParams={gridUpdatePopup.saveParams}

          searchProps={updatePopupSearchProps}
          inputProps={updatePopupInputProps}

          gridComboInfo={gridUpdatePopup.gridComboInfo}
          gridPopupInfo={gridUpdatePopup.gridPopupInfo}
          rowAddPopupInfo={gridUpdatePopup.rowAddPopupInfo}
        />
      }
      {props.modalContext}
      {extraModals}
      {extraGridPopups}
    </Row>
    </>
  );
}