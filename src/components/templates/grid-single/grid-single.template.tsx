import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Row, Space, Spin } from 'antd';
import {
  Button,
  Container,
  Datagrid,
  Div,
  GridPopup,
  Modal,
  Searchbox,
} from '~/components/UI';
import { InputGroupbox } from '~/components/UI/input-groupbox/input-groupbox.ui';
import { useRecoilValue } from 'recoil';
import { layoutStore } from '~/components/UI/layout';
import Props from './grid-single.template.type';
import { getPermissions } from '~/functions';
import { isNil } from '~/helper/common';

export const TpSingleGrid: React.FC<Props> = props => {
  /** 🔶권한 */
  const permissions = getPermissions(props.title);

  //#region 🔶그리드 관련
  const grid = props.gridInfo;
  const gridRef = props.gridRef;
  const searchProps = props.searchProps;
  const inputProps = props.inputProps;

  const gridPopup = {
    ...props.popupGridInfo[0],
    disabledAutoDateColumn: isNil(
      props.popupGridInfo[0]?.disabledAutoDateColumn,
    )
      ? true
      : props.popupGridInfo[0]?.disabledAutoDateColumn,
  };
  const gridPopupRef = props.popupGridRef[0];
  const gridPopupVisible = props.popupVisible[0];
  const setGridPopupVisible = props.setPopupVisible[0];
  const popupSearchProps = props.popupSearchProps
    ? props.popupSearchProps[0]
    : null;
  const popupInputProps = props.popupInputProps
    ? props.popupInputProps[0]
    : null;
  const onNewDataPopupAfterOk = props.onPopupAfterOk
    ? props.onPopupAfterOk[0]
    : null;

  const gridUpdatePopup = {
    ...props.popupGridInfo[1],
    disabledAutoDateColumn: isNil(
      props.popupGridInfo[1]?.disabledAutoDateColumn,
    )
      ? true
      : props.popupGridInfo[1]?.disabledAutoDateColumn,
  };
  const gridUpdatePopupRef = props.popupGridRef[1];
  const gridUpdatePopupVisible = props.popupVisible[1];
  const setGridUpdatePopupVisible = props.setPopupVisible[1];
  const updatePopupSearchProps = props.popupSearchProps
    ? props.popupSearchProps[1]
    : null;
  const updatePopupInputProps = props.popupInputProps
    ? props.popupInputProps[1]
    : null;
  const onUpdateDataPopupAfterOk = props.onPopupAfterOk
    ? props.onPopupAfterOk[1]
    : null;

  const subTotalGrid = props.subGridInfo;
  const subTotalGridRef = props.subGridRef;

  const gridMode = useMemo(() => {
    if (permissions?.delete_fg !== true) {
      return 'view';
    } else return grid?.gridMode;
  }, [grid?.gridMode, permissions]);
  //#endregion

  //#region 🔶검색상자 관련
  // 검색상자가 전부 hidden이면 검색상자 컴포넌트 자체를 display하지 않습니다.
  const searchboxVisible = useMemo(() => {
    const searchItems = searchProps?.searchItems;
    let visible: boolean = false;

    for (let i = 0; i < searchItems?.length; i++) {
      if ([false, null, undefined].includes(searchItems[i]?.hidden)) {
        visible = true;
        break;
      }
    }

    return visible;
  }, [searchProps]);

  const inputboxVisible = useMemo(() => {
    const inputItems = inputProps?.inputItems;
    let visible: boolean = false;

    for (let i = 0; i < inputItems?.length; i++) {
      if ([false, null, undefined].includes(inputItems[i]?.hidden)) {
        visible = true;
        break;
      }
    }

    return visible;
  }, [inputProps]);
  //#endregion

  //#region 🔶 그리드 자동 높이 맞춤
  const layoutState = useRecoilValue(layoutStore.state);

  const [gridHeight, setGridHeight] = useState<number | 'fitToParent'>(
    grid?.height ?? document.getElementById('main-body')?.clientHeight,
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
    const search = Number(
      document.getElementById(searchProps?.id)?.clientHeight || 0,
    );
    const Input = Number(
      document.getElementById(inputProps?.id)?.clientHeight || 0,
    );
    const subTotalHeight =
      subTotalGrid && !subTotalGrid?.hidden ? 230 + 30 + 35 + 16 : 0;

    const datagridHeight = 30;
    const bodyVertialMargin = 32;
    const subtracttHeight =
      ((buttons > 0 ? 1 : 0) +
        (search > 0 ? 1 : 0) +
        (Input > 0 ? 1 : 0) +
        (subTotalHeight > 0 ? 1 : 0)) *
        8 +
      buttons +
      search +
      Input +
      mainFooter +
      datagridHeight +
      bodyVertialMargin +
      subTotalHeight;

    const height = mainBody - subtracttHeight;

    setGridHeight(height);
  };

  /** 강제로 리사이징을 하기 위한 함수 입니다. */
  const forceReszing = () => {
    onResize();
    clearTimeout(1000);
  };

  useLayoutEffect(() => {
    if (grid.height) return;
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

  //#region 🔶조작 버튼 관련
  /** 기타 헤더 버튼 */
  const extraButtons = useMemo(() => {
    return props.extraButtons?.map((el, index) => (
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
  }, [props.extraButtons]);

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
        disabled={disabled}
      >
        삭제
      </Button>
    );
  }, [buttonActions, permissions]);

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
        disabled={disabled}
      >
        수정
      </Button>
    );
  }, [buttonActions, permissions]);

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
      >
        신규 항목 추가
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

  const gridElement = useMemo(() => {
    return (
      <>
        {!isNil(inputProps) ? (
          inputboxVisible ? (
            <InputGroupbox {...inputProps} />
          ) : null
        ) : null}
        {subTotalGrid && !subTotalGrid?.hidden ? (
          <Container
            id="SUB_GRID_CONTAINER"
            title={'소계' + (props.subTitle ? ' - ' + props.subTitle : '')}
          >
            <Datagrid {...subTotalGrid} ref={subTotalGridRef} height={230} />
          </Container>
        ) : null}
        <Container>
          <Datagrid
            {...grid}
            height={gridHeight}
            ref={gridRef}
            gridMode={gridMode}
          />
        </Container>
      </>
    );
  }, [
    inputProps,
    inputboxVisible,
    subTotalGrid,
    props.subTitle,
    subTotalGridRef,
    grid,
    gridHeight,
    gridRef,
    gridMode,
  ]);

  return !permissions ? (
    <Spin spinning={true} tip="권한 정보를 가져오고 있습니다." />
  ) : (
    <>
      <Row gutter={[16, 0]}>
        {props.templateType !== 'report' ? (
          <Div
            id="template_buttons"
            divType="singleGridButtonsDiv"
            optionType={{ singleGridtype: 'view' }}
          >
            <Space size={[5, 0]}>
              {btnDelete}
              {btnUpdate}
              {btnCreate}
            </Space>
            <Space size={[5, 0]}>
              {isNil(searchProps?.searchItems) || !searchboxVisible
                ? btnSearch
                : null}
              {extraButtons}
            </Space>
          </Div>
        ) : null}

        <div
          style={
            props.templateType === 'report'
              ? { marginTop: -8, width: '100%' }
              : { width: '100%' }
          }
        >
          {!isNil(searchProps) ? (
            searchboxVisible ? (
              <Searchbox {...searchProps} />
            ) : null
          ) : null}
        </div>
        {gridElement}

        {isNil(gridPopup) || !gridPopupVisible ? null : (
          <GridPopup
            {...gridPopup}
            popupId={gridPopup.gridId + '_POPUP'}
            defaultVisible={false}
            title={props.title + ' - 신규 항목 추가'}
            visible={gridPopupVisible}
            okText="저장하기"
            cancelText="취소"
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
            gridMode="create"
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
        )}

        {isNil(gridUpdatePopup) || !gridUpdatePopupVisible ? null : (
          <GridPopup
            {...gridUpdatePopup}
            popupId={gridUpdatePopup.gridId + '_POPUP'}
            defaultVisible={false}
            title={props.title + ' - 항목 수정'}
            visible={gridUpdatePopupVisible}
            okText="저장하기"
            cancelText="취소"
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
            gridMode="update"
            data={grid.data}
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
        )}
        {props.modalContext}
        {extraModals}
        {extraGridPopups}
      </Row>
    </>
  );
};
