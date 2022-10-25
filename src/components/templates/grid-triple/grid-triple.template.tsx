import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Col, Row, Space, Spin } from 'antd';
import {
  Button,
  Container,
  Datagrid,
  Div,
  GridPopup,
  Modal,
  Searchbox,
} from '~/components/UI';
import IButtonProps from '~/components/UI/button/button.ui.type';
import { InputGroupbox } from '~/components/UI/input-groupbox/input-groupbox.ui';
import { useRecoilValue } from 'recoil';
import { layoutStore } from '~/components/UI/layout';
import Props from './grid-triple.template.type';
import { getPermissions } from '~/functions';

export const TpTripleGrid: React.FC<Props> = props => {
  /** 🔶권한 */
  const permissions = getPermissions(props.title);

  //#region 🔶그리드 관련
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

  const headerPopup = {
    ...props.popupGridInfos[0],
    disabledAutoDateColumn:
      props.popupGridInfos[0]?.disabledAutoDateColumn == null
        ? true
        : props.popupGridInfos[0]?.disabledAutoDateColumn,
  };
  const headerPopupRef = props.popupGridRefs[0];
  const headerPopupVisible = props.popupVisibles[0];
  const setHeaderPopupVisible = props.setPopupVisibles[0];
  const headerPopupInputProps = props.popupInputProps
    ? props.popupInputProps[0]
    : null;
  const headerPopupSearchProps = props.popupSearchProps
    ? props.popupSearchProps[0]
    : null;

  const detailPopup = {
    ...props.popupGridInfos[1],
    disabledAutoDateColumn:
      props.popupGridInfos[1]?.disabledAutoDateColumn == null
        ? true
        : props.popupGridInfos[1]?.disabledAutoDateColumn,
  };
  const detailPopupRef = props.popupGridRefs[1];
  const detailPopupVisible = props.popupVisibles[1];
  const setDetailPopupVisible = props.setPopupVisibles[1];
  const detailPopupInputProps = props.popupInputProps
    ? props.popupInputProps[1]
    : null;
  const detailPopupSearchProps = props.popupSearchProps
    ? props.popupSearchProps[1]
    : null;

  const editPopup = {
    ...props.popupGridInfos[2],
    disabledAutoDateColumn:
      props.popupGridInfos[2]?.disabledAutoDateColumn == null
        ? true
        : props.popupGridInfos[2]?.disabledAutoDateColumn,
  };
  const editPopupRef = props.popupGridRefs[2];
  const editPopupVisible = props.popupVisibles[2];
  const setEditPopupVisible = props.setPopupVisibles[2];
  const editPopupInputProps = props.popupInputProps
    ? props.popupInputProps[2]
    : null;
  const editPopupSearchProps = props.popupSearchProps
    ? props.popupSearchProps[2]
    : null;

  const headerGridMode = useMemo(() => {
    if (permissions?.delete_fg !== true) {
      return 'view';
    } else return headerGrid?.gridMode;
  }, [headerGrid?.gridMode, permissions]);

  const detailGridMode = useMemo(() => {
    if (permissions?.delete_fg !== true) {
      return 'view';
    } else return detailGrid?.gridMode;
  }, [detailGrid?.gridMode, permissions]);

  const detailSubGridMode = useMemo(() => {
    if (permissions?.delete_fg !== true) {
      return 'view';
    } else return detailSubGrid?.gridMode;
  }, [detailSubGrid?.gridMode, permissions]);

  const templateOrientation = useMemo(() => {
    return props.templateOrientation ?? 'filledLayoutRight';
  }, [props.templateOrientation]);
  //#endregion

  //#region 🔶검색 상자 관련
  /** 검색상자가 전부 hidden이면 검색상자 컴포넌트 자체를 display하지 않습니다. */
  const headerSearchboxVisible = useMemo(() => {
    const searchItems = headerSearchProps?.searchItems;
    let visible: boolean = false;

    for (let i = 0; i < searchItems?.length; i++) {
      if ([false, null, undefined].includes(searchItems[i]?.hidden)) {
        visible = true;
        break;
      }
    }

    return visible;
  }, [headerSearchProps]);

  // 검색상자가 전부 hidden이면 검색상자 컴포넌트 자체를 display하지 않습니다.
  const detailSearchboxVisible = useMemo(() => {
    const searchItems = detailSearchProps?.searchItems;
    let visible: boolean = false;

    for (let i = 0; i < searchItems?.length; i++) {
      if ([false, null, undefined].includes(searchItems[i]?.hidden)) {
        visible = true;
        break;
      }
    }

    return visible;
  }, [detailSearchProps]);

  // 검색상자가 전부 hidden이면 검색상자 컴포넌트 자체를 display하지 않습니다.
  const detailSubSearchboxVisible = useMemo(() => {
    const searchItems = detailSubSearchProps?.searchItems;
    let visible: boolean = false;

    for (let i = 0; i < searchItems?.length; i++) {
      if ([false, null, undefined].includes(searchItems[i]?.hidden)) {
        visible = true;
        break;
      }
    }

    return visible;
  }, [detailSubSearchProps]);
  //#endregion

  //#region 🔶입력 상자 관련
  // 그룹입력상자가 전부 hidden이면 그룹입력상자 컴포넌트 자체를 display하지 않습니다.
  const headerInputboxVisible = useMemo(() => {
    const inputItems = headerInputProps?.inputItems;
    let visible: boolean = false;

    for (let i = 0; i < inputItems?.length; i++) {
      if ([false, null, undefined].includes(inputItems[i]?.hidden)) {
        visible = true;
        break;
      }
    }

    return visible;
  }, [headerInputProps]);

  // 그룹입력상자가 전부 hidden이면 그룹입력상자 컴포넌트 자체를 display하지 않습니다.
  const detailInputboxVisible = useMemo(() => {
    const inputItems = detailInputProps?.inputItems;
    let visible: boolean = false;

    for (let i = 0; i < inputItems?.length; i++) {
      if ([false, null, undefined].includes(inputItems[i]?.hidden)) {
        visible = true;
        break;
      }
    }

    return visible;
  }, [detailInputProps]);

  // 그룹입력상자가 전부 hidden이면 그룹입력상자 컴포넌트 자체를 display하지 않습니다.
  const detailSubInputboxVisible = useMemo(() => {
    const inputItems = detailSubInputProps?.inputItems;
    let visible: boolean = false;

    for (let i = 0; i < inputItems?.length; i++) {
      if ([false, null, undefined].includes(inputItems[i]?.hidden)) {
        visible = true;
        break;
      }
    }

    return visible;
  }, [detailSubInputProps]);
  //#endregion

  //#region 🔶조작 버튼 관련
  /** 기타 헤더 버튼 */
  const headerExtraButtons = useMemo(() => {
    return props.headerExtraButtons?.map((el, index) => (
      <Button
        key={'extraBtn_' + index}
        {...el}
        btnType={el.btnType || 'buttonFill'}
        heightSize={el.heightSize || 'small'}
        fontSize={el.fontSize || 'small'}
        colorType={el.colorType || 'primary'}
      >
        {el.text}
      </Button>
    ));
  }, [props.headerExtraButtons]);

  /** 기타 사용자 정의 팝업 */
  const extraModals = useMemo(() => {
    return props.extraModals?.map((el, index) => (
      <Modal key={'extraModal_' + index} {...el} />
    ));
  }, [props.extraModals]);

  /** 기타 사용자 정의 팝업 */
  const extraGridPopups = useMemo(() => {
    return props.extraGridPopups?.map((el, index) => (
      <GridPopup key={'extraGridPopup_' + index} {...el} />
    ));
  }, [props.extraGridPopups]);

  const { buttonActions } = props;

  const btnCreateProps: IButtonProps = props.btnProps?.create;
  const btnAddProps: IButtonProps = props.btnProps?.add;
  const btnEditProps: IButtonProps = props.btnProps?.edit;
  const btnDeleteProps: IButtonProps = props.btnProps?.delete;

  const btnCreateText: string = btnCreateProps?.text ?? '신규 항목 추가';
  const btnAddText: string = btnAddProps?.text ?? '세부 항목 추가';
  const btnEditText: string = btnEditProps?.text ?? '수정';
  const btnDeleteText: string = btnDeleteProps?.text ?? '삭제';

  const btnDelete = useMemo(() => {
    const disabled = !(permissions?.delete_fg === true && buttonActions.delete);
    return (
      <Button
        btnType="buttonFill"
        widthSize="medium"
        heightSize="small"
        fontSize="small"
        ImageType="delete"
        colorType="delete"
        onClick={buttonActions.delete}
        {...btnDeleteProps}
        disabled={disabled}
      >
        {btnDeleteText}
      </Button>
    );
  }, [btnDeleteProps, buttonActions, permissions]);

  const btnUpdate = useMemo(() => {
    const disabled = !(permissions?.update_fg === true && buttonActions.update);
    return (
      <Button
        btnType="buttonFill"
        widthSize="medium"
        heightSize="small"
        fontSize="small"
        ImageType="edit"
        colorType="blue"
        onClick={buttonActions.update}
        {...btnEditProps}
        disabled={disabled}
      >
        {btnEditText}
      </Button>
    );
  }, [btnEditText, buttonActions, permissions]);

  const btnAdd = useMemo(() => {
    const disabled = !(
      permissions?.update_fg === true && buttonActions.createDetail
    );
    return (
      <Button
        btnType="buttonFill"
        widthSize="large"
        heightSize="small"
        fontSize="small"
        ImageType="add"
        colorType="blue"
        onClick={buttonActions.createDetail}
        disabled={disabled}
        {...btnAddProps}
      >
        {btnAddText}
      </Button>
    );
  }, [btnAddText, buttonActions, permissions]);

  const btnCreate = useMemo(() => {
    const disabled = !(permissions?.create_fg === true && buttonActions.create);
    return (
      <Button
        btnType="buttonFill"
        widthSize="large"
        heightSize="small"
        fontSize="small"
        ImageType="add"
        colorType="blue"
        onClick={buttonActions.create}
        disabled={disabled}
        {...btnCreateProps}
      >
        {btnCreateText}
      </Button>
    );
  }, [buttonActions, permissions]);

  const btnSearch = useMemo(() => {
    const disabled = permissions?.read_fg !== true;
    return (
      <Button
        btnType="buttonFill"
        widthSize="medium"
        heightSize="small"
        fontSize="small"
        ImageType="search"
        colorType="blue"
        onClick={buttonActions.search}
        disabled={disabled}
      >
        조회
      </Button>
    );
  }, [buttonActions, permissions]);
  //#endregion

  //#region 🔶 그리드 자동 높이 맞춤
  const layoutState = useRecoilValue(layoutStore.state);
  const fixHeight = 220;

  const [headerGridHeight, setHeaderGridHeight] = useState<number>(
    headerGrid?.height ?? templateOrientation === 'filledLayoutRight'
      ? fixHeight
      : document.getElementById('main-body')?.clientHeight,
  );
  const [detailGridHeight, setDetailGridHeight] = useState<number>(
    detailGrid?.height ?? templateOrientation === 'filledLayoutLeft'
      ? fixHeight
      : document.getElementById('main-body')?.clientHeight,
  );
  const [detailSubGridHeight, setDetailSubGridHeight] = useState<number>(
    detailSubGrid?.height ?? document.getElementById('main-body')?.clientHeight,
  );

  const onResize = (ev?) => {
    const mainBody = Number(
      document.getElementById('main-body')?.clientHeight || 0,
    );
    const mainFooter = Number(
      document.getElementById('main-footer')?.clientHeight || 0,
    );
    const buttons = Number(
      document.getElementById('template-buttons')?.clientHeight || 0,
    );
    const headerSearch = Number(
      document.getElementById(headerSearchProps?.id)?.clientHeight || 0,
    );
    const headerInput = Number(
      document.getElementById(headerInputProps?.id)?.clientHeight || 0,
    );
    const detailSearch = Number(
      document.getElementById(detailSearchProps?.id)?.clientHeight || 0,
    );
    const detailInput = Number(
      document.getElementById(detailInputProps?.id)?.clientHeight || 0,
    );
    const detailSubSearch = Number(
      document.getElementById(detailSubSearchProps?.id)?.clientHeight || 0,
    );
    const detailSubInput = Number(
      document.getElementById(detailSubInputProps?.id)?.clientHeight || 0,
    );

    const datagridHeaderHeight = 30;
    const bodyVertialMargin = 32;

    let headerSubtracttHeight = 0;
    let detailSubtracttHeight = 0;
    let detailSubSubtractHeight = 0;
    let headerHeight = 0;
    let detailHeight = 0;
    let detailSubHeight = 0;

    if (templateOrientation === 'filledLayoutLeft') {
      headerSubtracttHeight =
        ((buttons > 0 ? 1 : 0) +
          (headerSearch > 0 ? 1 : 0) +
          (headerInput > 0 ? 1 : 0)) *
          8 + // marginCount
        buttons +
        headerSearch +
        headerInput +
        mainFooter +
        datagridHeaderHeight +
        bodyVertialMargin;
      detailSubSubtractHeight =
        ((buttons > 0 ? 1 : 0) +
          (detailSearch > 0 ? 1 : 0) +
          (detailInput > 0 ? 1 : 0) +
          (detailSubSearch > 0 ? 1 : 0) +
          (detailSubInput > 0 ? 1 : 0) +
          1) *
          8 + // marginCount
        buttons +
        detailSearch +
        detailInput +
        detailSubSearch +
        detailSubInput +
        mainFooter +
        datagridHeaderHeight +
        bodyVertialMargin +
        (fixHeight + datagridHeaderHeight);

      headerHeight = mainBody - headerSubtracttHeight;
      detailHeight = fixHeight;
      detailSubHeight = mainBody - detailSubSubtractHeight;
    } else if (templateOrientation === 'filledLayoutRight') {
      detailSubtracttHeight =
        ((buttons > 0 ? 1 : 0) +
          (headerSearch > 0 ? 1 : 0) +
          (headerInput > 0 ? 1 : 0) +
          (detailSearch > 0 ? 1 : 0) +
          (detailInput > 0 ? 1 : 0) +
          1) *
          8 + // marginCount
        buttons +
        headerSearch +
        headerInput +
        detailSearch +
        detailInput +
        mainFooter +
        datagridHeaderHeight +
        bodyVertialMargin +
        (fixHeight + datagridHeaderHeight);
      detailSubSubtractHeight =
        ((buttons > 0 ? 1 : 0) +
          (detailSubSearch > 0 ? 1 : 0) +
          (detailSubInput > 0 ? 1 : 0)) *
          8 + // marginCount
        buttons +
        detailSubSearch +
        detailSubInput +
        mainFooter +
        datagridHeaderHeight +
        bodyVertialMargin;

      headerHeight = fixHeight;
      detailHeight = mainBody - detailSubtracttHeight;
      detailSubHeight = mainBody - detailSubSubtractHeight;
    }

    setHeaderGridHeight(headerHeight);
    setDetailGridHeight(detailHeight);
    setDetailSubGridHeight(detailSubHeight);
  };

  /** 강제로 리사이징을 하기 위한 함수 입니다. */
  const forceReszing = () => {
    onResize();
    clearTimeout();
  };

  useLayoutEffect(() => {
    if (headerGrid.height) return;
    window.addEventListener('resize', onResize);
    setTimeout(forceReszing); // setTimeout을 이용해 최초 1번 강제로 onResize()를 실행합니다.

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useLayoutEffect(() => {
    onResize();
  }, [layoutState]);
  //#endregion

  //#region 🔶 렌더러에 작성될 엘리먼트 정의
  const headerGridElement = useMemo(() => {
    const _headerGridHeight =
      headerGrid?.height ?? templateOrientation === 'filledLayoutRight'
        ? fixHeight
        : headerGridHeight;
    return (
      <>
        {headerSearchProps != null ? (
          headerSearchboxVisible ? (
            <Searchbox {...headerSearchProps} />
          ) : null
        ) : null}
        {headerInputProps != null ? (
          headerInputboxVisible ? (
            <InputGroupbox {...headerInputProps} />
          ) : null
        ) : null}
        <Container>
          <Datagrid
            {...headerGrid}
            ref={headerGridRef}
            height={_headerGridHeight}
            gridMode={headerGridMode}
          />
        </Container>
      </>
    );
  }, [
    headerSearchProps,
    headerSearchboxVisible,
    headerSearchProps,
    headerGrid,
    headerGridRef,
    headerGridHeight,
    headerGridMode,
  ]);

  const detailGridElement = useMemo(() => {
    const _detailGridHeight =
      detailGrid?.height ?? templateOrientation !== 'filledLayoutRight'
        ? fixHeight
        : detailGridHeight;
    return (
      <>
        {detailSearchProps != null ? (
          detailSearchboxVisible ? (
            <Searchbox {...detailSearchProps} />
          ) : null
        ) : null}
        {detailInputProps != null ? (
          detailInputboxVisible ? (
            <InputGroupbox {...detailInputProps} />
          ) : null
        ) : null}
        <Container>
          <Datagrid
            {...detailGrid}
            ref={detailGridRef}
            height={_detailGridHeight}
            gridMode={detailGridMode}
          />
        </Container>
      </>
    );
  }, [
    detailSearchProps,
    detailSearchboxVisible,
    detailSearchProps,
    detailInputProps,
    detailGridRef,
    detailGridHeight,
    detailGridMode,
  ]);

  const detailSubGridElement = useMemo(() => {
    const _detailSubGridHeight = detailSubGridHeight;
    return (
      <>
        {detailSubSearchProps != null ? (
          detailSubSearchboxVisible ? (
            <Searchbox {...detailSubSearchProps} />
          ) : null
        ) : null}
        {detailSubInputProps != null ? (
          detailSubInputboxVisible ? (
            <InputGroupbox {...detailSubInputProps} />
          ) : null
        ) : null}
        <Container>
          <Datagrid
            {...detailSubGrid}
            ref={detailSubGridRef}
            height={_detailSubGridHeight}
            gridMode={detailSubGridMode}
          />
        </Container>
      </>
    );
  }, [
    detailSubSearchProps,
    detailSubSearchboxVisible,
    detailSubSearchProps,
    detailSubInputProps,
    detailSubGridRef,
    detailSubGridHeight,
    detailSubGridMode,
  ]);
  //#endregion

  return (
    <>
      {!permissions ? (
        <Spin spinning={true} tip="권한 정보를 가져오고 있습니다." />
      ) : (
        <>
          <Row gutter={[16, 0]}>
            {props.templateType !== 'report' ? (
              <Div
                id="template-buttons"
                divType="singleGridButtonsDiv"
                optionType={{ singleGridtype: 'view' }}
              >
                <Space size={[5, 0]}>
                  {btnDelete}
                  {btnUpdate}
                  {btnAdd}
                </Space>
                <Space size={[5, 0]}>
                  {headerSearchProps?.searchItems == null ||
                  !headerSearchboxVisible
                    ? btnSearch
                    : null}
                  {btnCreate}
                  {headerExtraButtons}
                </Space>
              </Div>
            ) : null}

            {templateOrientation === 'filledLayoutRight' ? (
              <>
                <Col span={8}>
                  {headerGridElement}
                  {detailGridElement}
                </Col>

                <Col span={16}>{detailSubGridElement}</Col>
              </>
            ) : (
              <>
                <Col span={8}>{headerGridElement}</Col>

                <Col span={16}>
                  {detailGridElement}
                  {detailSubGridElement}
                </Col>
              </>
            )}
            {headerPopup == null || !headerPopupVisible ? null : (
              <GridPopup
                {...headerPopup}
                popupId={headerPopup.gridId + '_POPUP'}
                defaultVisible={false}
                title={props.title + ' - ' + btnCreateText}
                visible={headerPopupVisible}
                okText="저장하기"
                cancelText="취소"
                onAfterOk={(isSuccess, savedData) => {
                  if (props?.onAfterOkNewDataPopup) {
                    props.onAfterOkNewDataPopup(isSuccess, savedData);
                  } else {
                    if (!isSuccess) return;
                    headerPopupRef?.current?.getInstance()?.uncheckAll();
                    headerPopupRef?.current?.getInstance()?.clearModifiedData();

                    headerSearchProps.onSearch();
                    setHeaderPopupVisible(false);
                  }
                }}
                onCancel={() => setHeaderPopupVisible(false)}
                ref={headerPopupRef}
                parentGridRef={headerGridRef}
                gridId={headerPopup.gridId}
                gridMode="create"
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
            )}

            {detailPopup == null || !detailPopupVisible ? null : (
              <GridPopup
                {...detailPopup}
                popupId={detailPopup.gridId + '_POPUP'}
                defaultVisible={false}
                title={props.title + ' - ' + btnAddText}
                visible={detailPopupVisible}
                okText="저장하기"
                cancelText="취소"
                onAfterOk={(isSuccess, savedData) => {
                  if (props?.onAfterOkAddDataPopup) {
                    props.onAfterOkAddDataPopup(isSuccess, savedData);
                  } else {
                    if (!isSuccess) return;
                    detailPopupRef?.current?.getInstance()?.uncheckAll();
                    detailPopupRef?.current?.getInstance()?.clearModifiedData();

                    detailSearchProps.onSearch();
                    setDetailPopupVisible(false);
                  }
                }}
                onCancel={() => setDetailPopupVisible(false)}
                ref={detailPopupRef}
                parentGridRef={detailGridRef}
                gridId={detailPopup.gridId}
                gridMode="create"
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
            )}

            {editPopup == null || !editPopupVisible ? null : (
              <GridPopup
                {...editPopup}
                popupId={editPopup.gridId + '_POPUP'}
                defaultVisible={false}
                title={props.title + ' - ' + btnEditText}
                visible={editPopupVisible}
                okText="수정하기"
                cancelText="취소"
                onAfterOk={(isSuccess, savedData) => {
                  if (props?.onAfterOkEditDataPopup) {
                    props.onAfterOkEditDataPopup(isSuccess, savedData);
                  } else {
                    if (!isSuccess) return;
                    editPopupRef?.current?.getInstance()?.uncheckAll();
                    editPopupRef?.current?.getInstance()?.clearModifiedData();

                    editPopupSearchProps.onSearch();
                    setEditPopupVisible(false);
                  }
                }}
                onCancel={() => setEditPopupVisible(false)}
                ref={editPopupRef}
                parentGridRef={detailGridRef}
                gridId={editPopup.gridId}
                gridMode="update"
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
            )}
            {props.modalContext}
            {extraModals}
            {extraGridPopups}
          </Row>
        </>
      )}
    </>
  );
};
