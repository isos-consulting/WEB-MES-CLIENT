import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getPopupForm } from '~components/UI/popup/popup.ui.model';
import { cleanupKeyOfObject, getData } from '~/functions';
import { IPopupItemsRetrunProps } from '~components/UI/popup/popup.ui.type';
import { Button } from'~components/UI/button';
import Props from './popup-button.ui.type';
import { afPopupReponseRow } from './popup-button.recoil';
import {v4 as uuidv4} from 'uuid';
import Modal from 'antd/lib/modal/Modal';
import { Datagrid } from '../datagrid-new';
// import { useLoadingState } from '~/hooks';
import { useRef } from 'react';
import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import { Result } from '../result';


/** 팝업키를 사용하지 않고 수기로 작성된 정보로 팝업을 설정합니다. */
const setPopupButtonData = (props:Props) => {
  if (props?.dataApiSettings == null
      || props.datagridSettings == null) return;

  const {dataApiSettings, datagridSettings} = props;
  const modalSettings = props?.modalSettings;

  let dataApiInfo = {};
  if (typeof dataApiSettings === 'function') {
    dataApiInfo = dataApiSettings();

  } else {
    dataApiInfo = dataApiSettings;
  }
  
  return {
    modalProps: modalSettings,
    datagridProps: datagridSettings,
    ...dataApiInfo
  }
}


/** 팝업 호출용 버튼 */
const PopupButton: React.FC<Props> = (props) => {
  // const popupState = usePopupState();
  const childGridRef = useRef<Grid>();

  const [,setSelectedRow] = useRecoilState(afPopupReponseRow(props.id));
  const [popupItem, setPopupItem] = useState<IPopupItemsRetrunProps>(null);
  // const [,setLoading] = useLoadingState();

  const [modal, contextHolder] = Modal.useModal();



  useEffect(() => {
    setSelectedRow(null);
  }, []);

  useEffect(() => {
    setPopupItem(getPopupForm(props.popupKey));
  }, [props.popupKey]);
  
  return (
    <div>
    <Button
      btnType='image'
      ImageType='popup'
      disabled={props.disabled}
      onClick={()=>{
        // 팝업 부르기
        let popupContent:IPopupItemsRetrunProps = {
          datagridProps: {
            gridId: null,
            columns: null,
          },
          uriPath: null,
          params: null
        };
        
        if (props.popupKey == null) {
          popupContent = setPopupButtonData(props);

        } else {
          popupContent = getPopupForm(props.popupKey);
          popupContent['params'] = props.params;
        }

        if (popupContent == null) return;
        
        const childGridId = uuidv4();

        // setLoading(true);
        getData<any[]>(popupContent.params, popupContent.uriPath).then((res) => { // 데이터를 불러온 후 모달을 호출합니다.
          if (typeof res === 'undefined') {
            throw new Error('에러가 발생되었습니다.');
          }

          const gridMode = popupContent?.datagridProps?.gridMode;
          let title = popupContent?.modalProps?.title;
          const word = gridMode === 'select' ? '단일선택' : gridMode === 'multi-select' ? '다중선택' : '';

          if (title != null && String(title).length > 0) {
            title = title + ' - ' + word;

          } else {
            title = word;
          }

          // 맨 앞줄에 빈 값 추가
          if (props?.firstItemEmpty && res?.length > 0) {
            const keys = Object.keys(res[0]);
            let emptyValue = {};
            keys?.forEach(key => {
              emptyValue[key] = null;
            });

            res?.unshift(emptyValue);
          }
          
          modal.confirm({
            title,
            width: '80%',
            content:
              <Datagrid
                ref={childGridRef}
                gridId={childGridId}
                {...popupContent.datagridProps}
                gridMode='select'
                data={res}
              />,
            icon:null,
            okText: '선택',
            onOk: () => {
              const child = childGridRef.current;
              let row:object = child.getInstance().getCheckedRows()[0];

              if (typeof row === 'object') {
                row = cleanupKeyOfObject(row, props?.popupKeys);
                setSelectedRow(row);
                
                // 부모 grid? 선택한 Row 데이터를 준다.
                if (props?.handleChange) {
                  props.handleChange(row);
                }
                  
                if (props?.setValues) {
                  //props.setValues(crr => {return {...crr, ...row}});
                  props.setValues(row);

                } else if (props?.setFieldValue) {
                  for (const [key, value] of Object.entries(row)) {
                    props.setFieldValue(key, value);
                  }
                }
              } else {
                message.warn('항목을 선택해주세요.');
              }
            },
            cancelText:'취소',
            maskClosable:false,
            visible:true,
          });

        }).catch((e) => { // 에러 발생시
          modal.error({
            icon:null,
            content: <Result type='loadFailed'/>
          });
        })//.finally(() => setLoading(false));
      }
    }/>
    {contextHolder}
    </div>
  );
};

export default PopupButton;