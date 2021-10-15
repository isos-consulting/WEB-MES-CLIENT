import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Col, Divider, Row, Space } from "antd";
import { Button, Container, Datagrid, Div, GridPopup, IButtonProps, Modal, Searchbox } from "~/components/UI";
import { InputGroupbox} from "~/components/UI/input-groupbox/input-groupbox.ui";
import { useRecoilValue } from 'recoil';
import { layoutStore } from '~/components/UI/layout';
import Props from './grid-triple.template.type';


export const TpTripleGrid:React.FC<Props> = (props) => {
  const headerGrid = props.gridInfos[0];
  const headerGridRef = props.gridRefs[0];
  const headerSearchProps = props.searchProps[0];
  const headerInputProps = props.inputProps[0];

  const detailGrid = props.gridInfos[1];
  const detailGridRef = props.gridRefs[1];
  const detailSearchProps = props.searchProps[1];
  const detailInputProps = props.inputProps[1];

  const detailSubGrid = props.gridInfos[2];
  const detailSubGridRef = props.gridRefs[2];
  const detailSubSearchProps = props.searchProps[2];
  const detailSubInputProps = props.inputProps[2];

  const headerPopup = props.popupGridInfos[0];
  const headerPopupRef = props.popupGridRefs[0];
  const headerPopupVisible = props.popupVisibles[0];
  const setHeaderPopupVisible = props.setPopupVisibles[0];
  const headerPopupInputProps = props.popupInputProps ? props.popupInputProps[0] : null;
  const headerPopupSearchProps = props.popupSearchProps ? props.popupSearchProps[0] : null;

  const detailPopup = props.popupGridInfos[1];
  const detailPopupRef = props.popupGridRefs[1];
  const detailPopupVisible = props.popupVisibles[1];
  const setDetailPopupVisible = props.setPopupVisibles[1];
  const detailPopupInputProps = props.popupInputProps ? props.popupInputProps[1] : null;
  const detailPopupSearchProps = props.popupSearchProps ? props.popupSearchProps[1] : null;

  const editPopup = props.popupGridInfos[2];
  const editPopupRef = props.popupGridRefs[2];
  const editPopupVisible = props.popupVisibles[2];
  const setEditPopupVisible = props.setPopupVisibles[2];
  const editPopupInputProps = props.popupInputProps ? props.popupInputProps[2] : null;
  const editPopupSearchProps = props.popupSearchProps ? props.popupSearchProps[2] : null;

  const detailSubPopup = props.popupGridInfos[3];
  const detailSubPopupRef = props.popupGridRefs[3];
  const detailSubPopupVisible = props.popupVisibles[3];
  const setDetailSubPopupVisible = props.setPopupVisibles[3];
  const detailSubPopupInputProps = props.popupInputProps ? props.popupInputProps[3] : null;
  const detailSubPopupSearchProps = props.popupSearchProps ? props.popupSearchProps[3] : null;

  // 검색상자가 전부 hidden이면 검색상자 컴포넌트 자체를 display하지 않습니다.
  const headerSearchboxVisible = useMemo(
    () => {
      const searchItems = headerSearchProps?.searchItems;
      let visible:boolean = false;

      for (let i = 0; i < searchItems?.length; i++) {
        if ([false, null, undefined].includes(searchItems[i]?.hidden)) {
          visible = true;
          break;
        }
      }

      return visible;
    },
    [headerSearchProps],
  );

  // 검색상자가 전부 hidden이면 검색상자 컴포넌트 자체를 display하지 않습니다.
  const detailSearchboxVisible = useMemo(
    () => {
      const searchItems = detailSearchProps?.searchItems;
      let visible:boolean = false;

      for (let i = 0; i < searchItems?.length; i++) {
        if ([false, null, undefined].includes(searchItems[i]?.hidden)) {
          visible = true;
          break;
        }
      }

      return visible;
    },
    [detailSearchProps],
  );

  // 검색상자가 전부 hidden이면 검색상자 컴포넌트 자체를 display하지 않습니다.
  const detailSubSearchboxVisible = useMemo(
    () => {
      const searchItems = detailSubSearchProps?.searchItems;
      let visible:boolean = false;

      for (let i = 0; i < searchItems?.length; i++) {
        if ([false, null, undefined].includes(searchItems[i]?.hidden)) {
          visible = true;
          break;
        }
      }

      return visible;
    },
    [detailSubSearchProps],
  );

  // 그룹입력상자가 전부 hidden이면 그룹입력상자 컴포넌트 자체를 display하지 않습니다.
  const headerInputboxVisible = useMemo(
    () => {
      const inputItems = headerInputProps?.inputItems;
      let visible:boolean = false;

      for (let i = 0; i < inputItems?.length; i++) {
        if ([false, null, undefined].includes(inputItems[i]?.hidden)) {
          visible = true;
          break;
        }
      }

      return visible;
    },
    [headerInputProps],
  );

  // 그룹입력상자가 전부 hidden이면 그룹입력상자 컴포넌트 자체를 display하지 않습니다.
  const detailInputboxVisible = useMemo(
    () => {
      const inputItems = detailInputProps?.inputItems;
      let visible:boolean = false;

      for (let i = 0; i < inputItems?.length; i++) {
        if ([false, null, undefined].includes(inputItems[i]?.hidden)) {
          visible = true;
          break;
        }
      }

      return visible;
    },
    [detailInputProps],
  );

  // 그룹입력상자가 전부 hidden이면 그룹입력상자 컴포넌트 자체를 display하지 않습니다.
  const detailSubInputboxVisible = useMemo(
    () => {
      const inputItems = detailSubInputProps?.inputItems;
      let visible:boolean = false;

      for (let i = 0; i < inputItems?.length; i++) {
        if ([false, null, undefined].includes(inputItems[i]?.hidden)) {
          visible = true;
          break;
        }
      }

      return visible;
    },
    [detailSubInputProps],
  );

  /** 기타 헤더 버튼 */
  const headerExtraButtons = useMemo(() => {
    return props.headerExtraButtons?.map((el, index) =>
      <Button 
        key={'extraBtn_' + index}
        {...el}
        btnType={el.btnType || 'buttonFill'}
        heightSize={el.heightSize || 'small'}
        fontSize={el.fontSize || 'small'}
        colorType={el.colorType || 'primary'}
      >{el.text}</Button>
    );
  }, [props.headerExtraButtons]);
  
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
  const [headerGridHeight, setHeaderGridHeight] = useState(headerGrid.height || 0);
  const [detailGridHeight, setDetailGridHeight] = useState(detailGrid.height || 0);
  const [detailSubGridHeight, setDetailSubGridHeight] = useState(detailSubGrid.height || 0);
  const [eventTrigger, setEventTrigger] = useState<boolean>(false); // 강제로 window resize 이벤트를 실행시키기 위한 트리거 상태 값입니다.

  const onResize = (ev) => {
    onHeaderResize(ev);
    onDetailResize(ev);
    onDetailSubResize(ev);
  }

  const onHeaderResize = (ev) => {
    if (props.templateOrientation === 'filledLayoutRight') {
      setHeaderGridHeight(300);
      return;
    }
    const screenHeight = ev.target.innerHeight;
    const actionButtonsHeight = document.getElementById('TEMPLATE_BUTTONS')?.clientHeight || 0;
    const subGridContainerHeight = document.getElementById('SUB_GRID_CONTAINER')?.clientHeight || 0;

    const searchboxHeight = document.getElementById(headerSearchProps?.id)?.clientHeight || 0;
    const inputboxHeight = document.getElementById(headerInputProps?.id)?.clientHeight || 0;
    const gridHeaderHeight = headerGrid?.header?.height || 30;

    const height = screenHeight - (actionButtonsHeight + subGridContainerHeight + searchboxHeight + inputboxHeight + gridHeaderHeight) - (layoutState.bottomSpacing + layoutState.contentSpacing);

    setHeaderGridHeight(height);
  }

  const onDetailResize = (ev) => {
    const screenHeight = ev.target.innerHeight;
    const actionButtonsHeight = document.getElementById('TEMPLATE_BUTTONS')?.clientHeight || 0;
    const subGridContainerHeight = document.getElementById('SUB_GRID_CONTAINER')?.clientHeight || 0;

    const searchboxHeight = document.getElementById(detailSearchProps?.id)?.clientHeight || 0;
    const inputboxHeight = document.getElementById(detailInputProps?.id)?.clientHeight || 0;
    const gridHeaderHeight = detailGrid?.header?.height || 30;
    
    if (props.templateOrientation === 'filledLayoutRight') {
      const height = screenHeight - (actionButtonsHeight + subGridContainerHeight + searchboxHeight + inputboxHeight + gridHeaderHeight) - (layoutState.bottomSpacing + layoutState.contentSpacing) - headerGridHeight;
      setDetailGridHeight(height);

    } else {
      const height = screenHeight - (actionButtonsHeight + subGridContainerHeight + searchboxHeight + inputboxHeight + gridHeaderHeight) - (layoutState.bottomSpacing + layoutState.contentSpacing);
      setDetailGridHeight(height);
    }
  }

  const onDetailSubResize = (ev) => {
    const screenHeight = ev.target.innerHeight;
    const actionButtonsHeight = document.getElementById('TEMPLATE_BUTTONS')?.clientHeight || 0;
    const subGridContainerHeight = document.getElementById('SUB_GRID_CONTAINER')?.clientHeight || 0;

    const searchboxHeight = document.getElementById(detailSubSearchProps?.id)?.clientHeight || 0;
    const inputboxHeight = document.getElementById(detailSubInputProps?.id)?.clientHeight || 0;
    const gridHeaderHeight = detailGrid?.header?.height || 30;

    const height = screenHeight - (actionButtonsHeight + subGridContainerHeight + searchboxHeight + inputboxHeight + gridHeaderHeight) - (layoutState.bottomSpacing + layoutState.contentSpacing);

    setDetailSubGridHeight(height);
  }

  useLayoutEffect(() => {
    if (headerGrid.height) return;
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
  }, [eventTrigger]);

  useLayoutEffect(() => {
    onResize({target:{innerHeight: window.innerHeight}});
  }, [layoutState]);
  //#endregion

  
  //#region 🔶 렌더러에 작성될 엘리먼트 정의
  const headerGridElement = useMemo(() => {
    const _headerGridHeight = props?.templateOrientation === 'filledLayoutRight' ? 300 : headerGridHeight;
    return (
      <>
        {headerSearchProps != null ? headerSearchboxVisible ? <Searchbox {...headerSearchProps}/> : null : null}
        {headerInputProps != null ? headerInputboxVisible ? <InputGroupbox {...headerInputProps} /> : null : null}
        <Container>
          <Datagrid {...headerGrid} ref={headerGridRef} height={_headerGridHeight}/>
        </Container>
      </>
    );
  }, [headerSearchProps, headerSearchboxVisible, headerSearchProps, headerGrid, headerGridRef, headerGridHeight]);

  const detailGridElement = useMemo(() => {
    return (
      <>
        {detailSearchProps != null ? detailSearchboxVisible ? <Searchbox {...detailSearchProps}/> : null : null}
        {detailInputProps != null ? detailInputboxVisible ? <InputGroupbox {...detailInputProps} /> : null : null}
        <Container>
          <Datagrid {...detailGrid} ref={detailGridRef} height={detailGridHeight}/>
        </Container>
      </>
    );
  }, [detailSearchProps, detailSearchboxVisible, detailSearchProps, detailInputProps, detailGridRef, detailGridHeight]);

  const detailSubGridElement = useMemo(() => {
    return (
      <>
        {detailSubSearchProps != null ? detailSubSearchboxVisible ? <Searchbox {...detailSubSearchProps}/> : null : null}
        {detailSubInputProps != null ? detailSubInputboxVisible ? <InputGroupbox {...detailSubInputProps} /> : null : null}
        <Container>
          <Datagrid {...detailSubGrid} ref={detailSubGridRef} height={detailSubGridHeight}/>
        </Container>
      </>
    );
  }, [detailSubSearchProps, detailSubSearchboxVisible, detailSubSearchProps, detailSubInputProps, detailSubGridRef, detailSubGridHeight]);
  //#endregion


  const btnCreateProps:IButtonProps = props.btnProps?.create;
  const btnAddProps:IButtonProps = props.btnProps?.add;
  const btnEditProps:IButtonProps = props.btnProps?.edit;
  const btnDeleteProps:IButtonProps = props.btnProps?.delete;

  const btnCreateText:string = btnCreateProps?.text ?? '신규 항목 추가';
  const btnAddText:string = btnAddProps?.text ?? '세부 항목 추가';
  const btnEditText:string = btnEditProps?.text ?? '수정';
  const btnDeleteText:string = btnDeleteProps?.text ?? '삭제';

  return (
    <>
    <Row gutter={[16,0]}>
      {props.templateType !== 'report' ?
        <Div id='TEMPLATE_BUTTONS' divType='singleGridButtonsDiv' optionType={{singleGridtype:'view'}}> 
          <Space size={[5,0]}>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={buttonActions.delete} {...btnDeleteProps}>{btnDeleteText}</Button>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={buttonActions.update} {...btnEditProps}>{btnEditText}</Button>
            <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={buttonActions.createDetail} disabled={buttonActions.createDetail == null} {...btnAddProps}>{btnAddText}</Button>
          </Space>
          <Space size={[5,0]}>
            {headerSearchProps?.searchItems == null || !headerSearchboxVisible ? <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='search' colorType='blue' onClick={buttonActions.search}>조회</Button> : null}
            <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={buttonActions.create} disabled={buttonActions.create == null} {...btnCreateProps}>{btnCreateText}</Button>
            {headerExtraButtons}
          </Space>
        </Div>
      : null}

      {props.templateOrientation === 'filledLayoutRight' ?
        <>
          <Col span={8}>
            {headerGridElement}
            {detailGridElement}
          </Col>

          <Col span={16}>
            {detailSubGridElement}
          </Col>
        </>
      :
        <>
          <Col span={8}>
            {headerGridElement}
          </Col>

          <Col span={16}>
            {detailGridElement}
            {detailSubGridElement}
          </Col>
        </>
      }
      {headerPopup == null ? null :
        <GridPopup
          {...headerPopup}
          popupId={headerPopup.gridId+'_POPUP'}
          defaultVisible={false}

          title={props.title + ' - ' + btnCreateText}
          visible={headerPopupVisible}
          
          okText='추가하기'
          cancelText='취소'
          onAfterOk={(isSuccess, savedData) => { 
            if (props?.onAfterOkNewDataPopup) {
              props.onAfterOkNewDataPopup(isSuccess, savedData);

            } else {
              if (!isSuccess) return;

              headerSearchProps.onSearch();
              setHeaderPopupVisible(false);
            }
          }}
          onCancel={() => setHeaderPopupVisible(false)}

          ref={headerPopupRef}
          parentGridRef={headerGridRef}

          gridId={headerPopup.gridId}
          gridMode='create'
          defaultData={[]}
          columns={headerPopup.columns}
          saveType={props.dataSaveType || 'basic'}
          searchUriPath={headerPopup.searchUriPath}
          searchParams={headerPopup.searchParams}
          saveUriPath={headerPopup.saveUriPath}
          saveParams={headerPopup.saveParams}

          searchProps={headerPopupSearchProps}
          inputProps={headerPopupInputProps}
          gridComboInfo={headerPopup.gridComboInfo}
          gridPopupInfo={headerPopup.gridPopupInfo}
          rowAddPopupInfo={headerPopup.rowAddPopupInfo}
        />
      }

      {detailPopup == null ? null :
        <GridPopup
        {...detailPopup}
          popupId={detailPopup.gridId+'_POPUP'}
          defaultVisible={false}

          title={props.title + ' - ' + btnAddText}
          visible={detailPopupVisible}

          okText='추가하기'
          cancelText='취소'
          onAfterOk={(isSuccess, savedData) => { 
            if (props?.onAfterOkAddDataPopup) {
              props.onAfterOkAddDataPopup(isSuccess, savedData);

            } else {
              if (!isSuccess) return;

              detailSearchProps.onSearch();
              setDetailPopupVisible(false);
            }
          }}
          onCancel={() => setDetailPopupVisible(false)}

          ref={detailPopupRef}
          parentGridRef={detailGridRef}

          gridId={detailPopup.gridId}
          gridMode='create'
          defaultData={[]}
          columns={detailPopup.columns}
          saveType={props.dataSaveType || 'basic'}
          searchUriPath={detailPopup.searchUriPath}
          searchParams={detailPopup.searchParams}
          saveUriPath={detailPopup.saveUriPath}
          saveParams={detailPopup.saveParams}

          searchProps={detailPopupSearchProps}
          inputProps={detailPopupInputProps}
          gridComboInfo={detailPopup.gridComboInfo}
          gridPopupInfo={detailPopup.gridPopupInfo}
          rowAddPopupInfo={detailPopup.rowAddPopupInfo}
        />
      }

      {editPopup == null ? null :
        <GridPopup
        {...editPopup}
          popupId={editPopup.gridId+'_POPUP'}
          defaultVisible={false}

          title={props.title + ' - ' + btnEditText}
          visible={editPopupVisible}

          okText='수정하기'
          cancelText='취소'
          onAfterOk={(isSuccess, savedData) => { 
            if (props?.onAfterOkEditDataPopup) {
              props.onAfterOkEditDataPopup(isSuccess, savedData);

            } else {
              if (!isSuccess) return;

              editPopupSearchProps.onSearch();
              setEditPopupVisible(false);
            }
          }}
          onCancel={() => setEditPopupVisible(false)}

          ref={editPopupRef}
          parentGridRef={detailGridRef}

          gridId={editPopup.gridId}
          gridMode='update'
          defaultData={detailGrid.data}
          columns={editPopup.columns}
          saveType={props.dataSaveType || 'basic'}
          searchUriPath={editPopup.searchUriPath}
          searchParams={editPopup.searchParams}
          saveUriPath={editPopup.saveUriPath}
          saveParams={editPopup.saveParams}

          searchProps={editPopupSearchProps}
          inputProps={editPopupInputProps}
          gridComboInfo={editPopup.gridComboInfo}
          gridPopupInfo={editPopup.gridPopupInfo}
          rowAddPopupInfo={editPopup.rowAddPopupInfo}
        />
      }
      {props.modalContext}
      {extraModals}
      {extraGridPopups}
    </Row>
    </>
  );
}