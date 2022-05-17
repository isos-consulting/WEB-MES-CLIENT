import React from 'react';
import { Modal } from '../modal';
import { Form } from '../form';
import { FormItem } from '../form-item';
import { Textbox } from '../textbox';
import { Form as AntForm } from 'antd';
import { useEffect, useRef } from 'react';
import { FormInstance } from 'antd/lib/form';
import Props from './input-popup.ui.type';

const InputPopup: React.FC<Props> = (props, visible) => {
  const [form] = AntForm.useForm();

  /** 마운트 */
  useEffect(() => {
    useResetFormOnCloseModal({
      form,
      visible,
    });
  }, []);

  /** 모달 상태를 초기화 */
  const useResetFormOnCloseModal = ({
    form,
    visible,
  }: {
    form: FormInstance;
    visible: boolean;
  }) => {
    const prevVisibleRef = useRef<boolean>();
    useEffect(() => {
      prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;

    useEffect(() => {
      if (!visible && prevVisible) {
        form.resetFields();
      }
    }, [visible]);
  };

  /** 팝업 OK버튼 이벤트 */
  const onOk = () => {
    form.submit();
  };

  return (
    <AntForm.Provider
      onFormFinish={(name, { values, forms }) => {
        props.modalProps.onOk(values as any);
      }}
    >
      <Modal {...props.modalProps} onOk={onOk}>
        <Form
          {...props.formProps}
          form={form}
          formItem={props.formItemList.map(value => {
            return (
              <FormItem {...value.formItemProps}>
                <Textbox
                  id={value.id}
                  name={value.name}
                  inputType={value.inputItemType}
                />
              </FormItem>
            );
          })}
        />
      </Modal>
    </AntForm.Provider>
  );
};

export default InputPopup;
