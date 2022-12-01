import React, { useEffect, useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { getPopupForm } from '~components/UI/popup/popup.ui.model';
import { cleanupKeyOfObject, addKeyOfObject, getData } from '~/functions';
import { IPopupItemsRetrunProps } from '~components/UI/popup/popup.ui.type';
import { Button } from '~components/UI/button';
import Props from './popup-button.ui.type';
import { afPopupReponseRow } from './popup-button.recoil';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'antd/lib/modal/Modal';
import { Datagrid } from '../datagrid-new';
import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import { Result } from '../result';
import { nullify } from '~/functions/object';

/** 팝업키를 사용하지 않고 수기로 작성된 정보로 팝업을 설정합니다. */
const setPopupButtonData = (props: Props) => {
  if (props?.dataApiSettings == null || props.datagridSettings == null) return;

  const { dataApiSettings, datagridSettings } = props;
  const modalSettings = props?.modalSettings;

  let dataApiInfo = {};
  if (typeof dataApiSettings === 'function') {
    dataApiInfo = dataApiSettings(props);
  } else {
    dataApiInfo = dataApiSettings;
  }

  return {
    modalProps: modalSettings,
    datagridProps: datagridSettings,
    ...dataApiInfo,
  };
};

/** 팝업 호출용 버튼 */
const PopupButton: React.FC<Props> = props => {
  const childGridRef = useRef<Grid>();
  const [, setSelectedRow] = useRecoilState(afPopupReponseRow(props.id));
  const [, setPopupItem] = useState<IPopupItemsRetrunProps>(null);
  const [modal, contextHolder] = Modal.useModal();

  const allocateFromSelection = close => {
    const child = childGridRef.current;
    let row: object = child.getInstance().getCheckedRows()[0];

    if (typeof row !== 'object') return message.warn('항목을 선택해주세요.');

    row = addKeyOfObject(
      row,
      props?.datagridSettings?.rowAddPopupInfo?.columnNames,
    );
    row = cleanupKeyOfObject(row, props?.popupKeys);
    setSelectedRow(row);

    // 부모 grid? 선택한 Row 데이터를 준다.
    if (props?.handleChange) {
      props.handleChange(row);
    }

    if (props?.setValues) {
      props.setValues(row);
    } else if (props?.setFieldValue) {
      for (const [key, value] of Object.entries(row)) {
        props.setFieldValue(key, value);
      }
    }
    close();
  };

  useEffect(() => {
    setSelectedRow(null);
  }, []);

  useEffect(() => {
    setPopupItem(getPopupForm(props.popupKey));
  }, [props.popupKey]);

  return (
    <div>
      <Button
        btnType="image"
        ImageType="popup"
        disabled={props.disabled}
        onClick={async () => {
          const confirmDialogContext = {
            title: '',
            width: '80%',
            icon: null,
            okText: '선택',
            cancelText: '취소',
            maskClosable: false,
            visible: true,
          };
          const words = {
            select: '단일선택',
            'multi-select': '다중선택',
          };

          let popupContent = getPopupForm(props.popupKey);
          popupContent['params'] = props.params;

          if (props.popupKey == null) popupContent = setPopupButtonData(props);

          if (popupContent == null) return;

          const childGridId = uuidv4();

          if (
            (
              popupContent?.onInterlock ??
              function () {
                return true;
              }
            )() === false
          )
            return;

          const { gridMode } = popupContent?.datagridProps;
          const { title } = popupContent?.modalProps;
          const word =
            words.hasOwnProperty(gridMode) === true ? words[gridMode] : '';

          if (title != null && title !== '')
            confirmDialogContext.title = `${title} - ${word}`;
          else confirmDialogContext.title = word;

          try {
            const res = await getData<any[]>(
              popupContent.params,
              popupContent.uriPath,
            );

            if (res === undefined) throw new Error('에러가 발생되었습니다.');

            if (props?.firstItemEmpty && res?.length > 0)
              res?.unshift(nullify(res[0]));

            modal.confirm({
              ...confirmDialogContext,
              content: (
                <Datagrid
                  ref={childGridRef}
                  gridId={childGridId}
                  {...popupContent.datagridProps}
                  gridMode="select"
                  data={res}
                />
              ),
              onOk: allocateFromSelection,
            });
          } catch {
            modal.error({
              icon: null,
              content: <Result type="loadFailed" />,
            });
          }
        }}
      />
      {contextHolder}
    </div>
  );
};

export default PopupButton;
