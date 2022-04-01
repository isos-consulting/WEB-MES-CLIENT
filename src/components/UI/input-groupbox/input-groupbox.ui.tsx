import React, { useLayoutEffect, useMemo, useState } from 'react';
import {Form, Formik, isNaN} from 'formik';
import {FormikErrors, FormikValues, FormikHelpers, FormikProps} from 'formik/dist/types';
import { atomFamily,  useRecoilState, useResetRecoilState } from 'recoil';
import { Textbox } from '../textbox';
import { DatePicker } from '../date-picker';
import { CheckboxGroup, ICheckboxItem } from '../checkbox-group';
import { IRadioItem, RadioGroup } from '../radio-group';
import { PopupButton } from '../popup-button';
import { TPopupKey } from '../popup';
import { Container } from '../container';
import dayjs from 'dayjs';
import { Col, Row, Space } from 'antd';
import { Combobox, IComboboxItem } from '../combobox';
import { TComboFirstItemType } from '../combobox/combobox.ui.type';
import { Label } from '../label';
import { Checkbox } from '../checkbox';
import { DateRangePicker } from '../date-range-picker';
import { ENUM_DECIMAL } from '~/enums';
import { IDatagridProps } from '../datagrid-new';
import { IModalProps } from '../modal';


export interface IInputGroupboxItem {
  /** UI의 아이디 */
  id: string;
  /** initailState의 key값과 동일하게 작성해야 합니다. */
  name?: string;
  alias?: string;
  label?: string;
  type: 'text' | 'number' | 'date' | 'time' | 'datetime' | 'daterange' | 'check' | 'radio' | 'combo';
  widthSize?: 'auto' | 'flex' | number | string;
  options?: IRadioItem[] | ICheckboxItem[] | IComboboxItem[];
  placeholder?: string;
  suffix?: string;
  decimal?: number;
  firstItemType?: TComboFirstItemType;
  
  dataApiSettings?: {
    uriPath: string,
    params: object,
    onInterlock?: () => boolean;
  };

  dataSettingOptions?: TDataSettingOpionsReturn | ((ev?) => TDataSettingOpionsReturn) | ((ev?) => Promise<TDataSettingOpionsReturn>);

  /** 팝업 버튼에 세팅될 옵션 */
  popupButtonSettings?: {
    /** 팝업키가 없는 경우 직접 요청옵션을 세팅 */
    dataApiSettings?: TDataApiSettings | ((ev?) => TDataApiSettings);

    /** 팝업내에 데이터그리드 정보를 세팅합니다. (popupKey보다 높은 우선순위로 작동합니다.) */
    datagridSettings?: IDatagridProps;

    /** 팝업 정보를 세팅합니다. (popupKey보다 높은 우선순위로 작동합니다.) */
    modalSettings?: IModalProps;
  };

  popupKey?: TPopupKey;
  popupKeys?: string[];
  itemRef?: any;
  params?: object;

  hidden?:boolean;
  disabled?: boolean;
  readOnly?: boolean;
  important?: boolean;
  required?: boolean;

  useCheckbox?: boolean;
  defaultChecked?: boolean;

  usePopup?: boolean;
  useCheckType?: boolean;

  default?: any;

  onAfterChange?:(e) => void;
  handleChange?: (values) => void;

  //----

  ids?: string[];
  names?: string[];
  placeholders?: string[];
  defaults?: any[];
}


type TDataApiSettings = {
  uriPath:string,
  params?:object,
}


type TDataSettingOpionsReturn = {
  uriPath:string,
  params?:object,
  codeName?: string,
  textName?: string
}


export interface IInputGroupboxProps extends IInputUiGroupboxStyles{
  id: string;
  title?: string;

  inputItems: IInputGroupboxItem[];
  initialValues?: FormikValues
  // children: JSX.Element;

  isNotCheckRequired?: boolean;
  isNotCheckType?: boolean;

  innerRef?: React.Ref<FormikProps<FormikValues>>;
  buttonText?: string;

  type?: 'input' | 'search'

  /** input이 발생될때 호출될 함수 */
  validate?: (values?: any) => Promise<FormikErrors<FormikValues>>;

  /** SUBMIT 액션이 취해졌을 때 호출될 함수 */
  onSubmit?: (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => void | Promise<any>;


}

/** 컴포넌트 그룹박스 인터페이스 */
export interface IInputUiGroupboxStyles {
  boxShadow?: boolean;
}

export const afInputGroupValues = atomFamily<FormikValues, string>({
  key: 'afInputGroupValues',
  default: {}
});

export const afInputResult = atomFamily<string, string>({
  key: 'afInputResult',
  default: null
});

export const afInputGroupDefaultValues = atomFamily<FormikValues, string>({
  key: 'afInputGroupDefaultValues',
  default: {}
});



/** 인풋박스 */
const BaseInputGroupbox:React.FC<IInputGroupboxProps> = (props) => {
  const [defaultValues, setDefaultValues] = useState({});
  const {initialValues, validate, inputItems, isNotCheckRequired, isNotCheckType, innerRef} = props;  

  const _initialValues = useMemo(() => {
    if (!initialValues) {
      let result = {};

      inputItems?.forEach((item) => {
        if (item.ids != null) {
          item?.ids?.forEach((subItem, index) => {
            if (item?.names)
              result[item?.names[index]] = item?.defaults[index];
            else
              result[item?.ids[index]] = item?.defaults[index];
          });
          
        } else {
          result[item.name || item.id] = item?.default;
        }
      });

      inputItems?.filter((item) => {
        return item?.useCheckbox === true;
      }).map((item) => {
        result[(item.name || item.id) + '_chk'] = item?.defaultChecked;
      });

      return result;

    } else {
      return initialValues;
    }
  },[inputItems, initialValues]);


  useLayoutEffect(() => {
    setDefaultValues(_initialValues);
  }, []);


  // const preValidate = async (values?:any):Promise<FormikErrors<FormikValues>> => {
  //   const errors = {};

  //   // setValues(crr => crr !== values ? values : crr);
    
  //   if (inputItems?.length > 0) {
  //     let typeErrorList:string[] = [];
  //     let requireErrorList:string[] = [];

  //     inputItems.forEach((item) => {
  //       const itemName = item.name || item.id;
  //       const value = values[itemName];

  //       // 타입 체크
  //       if (isNotCheckType !== true && item?.useCheckType === true) {
  //         let pattern = null;
  //         switch (item.type) {
  //           case 'number':
  //             if (!isNaN(value)) {
  //               typeErrorList.push(itemName);
  //             }
  //             break;


  //           case 'date':
  //             pattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;

  //             if (typeof value === 'string' && !pattern.test(value)) {
  //               typeErrorList.push(itemName);
  //             }
  //             break;


  //           // case 'datetime':
  //           //   pattern = /([0-2][0-9]{3})-([0-1][0-9])-([0-3][0-9]) ([0-5][0-9]):([0-5][0-9]):([0-5][0-9])(([\-\+]([0-1][0-9])\:00))?/;

  //           //   if (typeof value === 'string' && !pattern.test(value)) {
  //           //     typeErrorList.push(itemName);
  //           //   }
  //           //   break;


  //           case 'time':
  //             pattern = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;

  //             if (typeof value === 'string' && !pattern.test(value)) {
  //               typeErrorList.push(itemName);
  //             }
  //             break;
          
  //           default:
  //             break;
  //         }

  //       }

  //       // 필수 값 체크
  //       if (isNotCheckRequired !== true && item?.required === true) {
  //         if (!value) {
  //           requireErrorList.push(itemName);
  //         }
  //       }
  //     });

      
  //     // 에러 정리
  //     typeErrorList.forEach(errorItem => {
  //       errors[errorItem] = '형식이 일치하지 않습니다.';
  //     });

  //     requireErrorList.forEach(errorItem => {
  //       errors[errorItem] = '필수 값 입니다.';
  //     });


  //     // if(typeErrorList.length > 0 || requireErrorList.length > 0)  {
  //     //   setResult('ERROR');
  //     // } else {
  //     //   setResult('');
  //     // }

  //   }

  //   return errors;
  // }


  const onSubmit = useMemo(() => {
    if (props.onSubmit) {
      return (values, {setSubmitting}) => props.onSubmit(values, setSubmitting);

    } else {
      return (values, {setSubmitting}) => {
        // setValues(crr => crr !== values ? values : crr);
        setSubmitting(false);
      }
    }
  }, [props.onSubmit]);

  const onReset = (values, header) => {
    // resetForm이 외부에서 실행되면 해당 함수로 callback됩니다.
    // 초기화되는 내용을 recoil상태값에 반영해야 값이 원활히 동기화 됩니다.
    setDefaultValues(values);
  }

  return (
    <Container
      id={props.id}
      boxShadow={props.boxShadow}
      title={props?.title}
    >
      <div style={props?.title ? {marginTop:10} : null}>
      <Formik
        innerRef={innerRef}
        initialValues={_initialValues}
        validate={(values) => { // input이 발생될때 마다 호출됩니다.

          // 기본 역할 수행
          // setValues(crr => crr !== values ? values : crr);
          // preValidate(values);

          // 사용자 액션 정의
          if (validate)
            validate(values);
        }}
        onSubmit={onSubmit}
        onReset={onReset}

        render={({
          values,
          setFieldValue,
          setValues,
          handleSubmit,
        }) => {

          const setFieldValued = async (fieldName:string, value:any) => {
            setFieldValue(fieldName, value);
          }

          return (
            <Form>
              <Space size={[10,0]} align='center' style={{marginTop:'-8px', paddingTop:'0px', paddingBottom:'2px'}} wrap>
                {inputItems?.map((item) => {
                  if (!item.hidden)
                    return (
                      <div key={item.id+'key'}>
                        {props?.type ? 
                            item.type === 'text' ?
                              <div style={{display:'flex'}}>
                              <Textbox
                                id={item.id}
                                name={item.name || item.id}
                                important={item.important}
                                label={item.label}
                                inputType='text'
                                disabled={item.usePopup || item.disabled}
                                readOnly={item.usePopup || item.readOnly}
                                placeholder={item.placeholder}
                                value={values[item.name || item.id]}
                                defaultValue={defaultValues[item.name || item.id]}
                                onChange={async (e) => {
                                  await setFieldValued(item.name || item.id, e.target.value);
  
                                  if (item?.onAfterChange)
                                    item?.onAfterChange(e);
                                }}
                                suffix={item.suffix}
                              />
                              {item.usePopup ?
                                <PopupButton
                                  {...item.popupButtonSettings}
                                  id={item.id}
                                  setValues={(values) => {
                                    setValues(crr => ({...crr, ...values}));
                                    handleSubmit();
                                  }}
                                  firstItemEmpty={item?.required !== true}
                                  popupKey={item.popupKey}
                                  params={item.params}
                                  popupKeys={item.popupKeys}
                                  disabled={item.disabled}
                                  handleChange={item.handleChange}
                                  values={values}
                                />
                              : null}
                              </div>
                            
  
                            :item.type === 'number' ?
                              <Textbox
                                id={item.id}
                                name={item.name || item.id}
                                important={item.important}
                                label={item.label}
                                inputType='number'
                                widthSize={item.widthSize || 'flex'}
                                disabled={item.disabled}
                                readOnly={item.readOnly}
                                placeholder={item.placeholder}
                                value={Number(values[item.name || item.id]).toFixed(item?.decimal ?? ENUM_DECIMAL.DEC_NOMAL)}
                                defaultValue={defaultValues[item.name || item.id]}
                                onChange={async (e) => {
                                  await setFieldValued(item.name || item.id, e.target.value);

                                  if (item?.onAfterChange)
                                    item?.onAfterChange(e);
                                }}
                                suffix={item.suffix}
                              />
  
  
                            :item.type === 'date' ?
                              <div>
                                {item?.useCheckbox ?
                                  <Checkbox
                                    id={item.id + '_chk'} code={item.id + '_chk'} name={(item.name || item.id) + '_chk'} text={item.label}
                                    checked={values[(item.name || item.id) + '_chk']}
                                    onChange={async (e) => {
                                      await setFieldValued((item.name || item.id) + '_chk', e.target.checked);
                                      if (item?.onAfterChange)
                                        item?.onAfterChange(e);
                                    }}
                                  />
                                : null}
                                <DatePicker
                                  id={item.id}
                                  name={item.name || item.id}
                                  picker='date'
                                  widthSize={item.widthSize || 'flex'}
                                  format='YYYY-MM-DD'
                                  important={item.important}
                                  label={item?.useCheckbox ? null : item.label}
                                  disabled={
                                    item?.useCheckbox ? 
                                      !(values[(item.name || item.id) + '_chk'] === true)
                                    : item.disabled
                                  }
                                  placeholder={item.placeholder}
                                  value={values[item.name || item.id]}
                                  defaultValue={_initialValues[item.name || item.id] ? dayjs(_initialValues[item.name || item.id]) : null}
                                  // defaultValue={item.default ? dayjs(item.default) : null}
                                  onChange={async (e) => {
                                    await setFieldValued(item.name || item.id, dayjs(e).format('YYYY-MM-DD'));
    
                                    if (item?.onAfterChange)
                                      item?.onAfterChange(e);
                                  }}
                                />
                              </div>

                            
                            :item.type === 'daterange' ?
                            <div>
                              {item?.useCheckbox ?
                                <Checkbox
                                  id={item.id + '_chk'} code={item.id + '_chk'} name={(item.name || item.id) + '_chk'} text={item.label}
                                  checked={values[(item.name || item.id) + '_chk']}
                                  onChange={async (e) => {
                                    await setFieldValued((item.name || item.id) + '_chk', e.target.checked);
                                    if (item?.onAfterChange)
                                      item?.onAfterChange(e);
                                  }}
                                />
                              : null}
                              <DateRangePicker
                                ids={item.ids}
                                names={item.names || item.ids}
                                picker='date'
                                widthSize={item.widthSize || 'flex'}
                                format='YYYY-MM-DD'
                                important={item.important}
                                label={item?.useCheckbox ? null : item.label}
                                disabled={
                                  item?.useCheckbox ? 
                                    !(values[(item.name || item.id) + '_chk'] === true)
                                  : item.disabled
                                }
                                placeholders={item.placeholders}
                                values={[
                                  values[
                                    item.names && item.names?.length > 2 ?
                                      item.names[0]
                                    : item.ids[0]
                                  ], 
                                  values[
                                    item.names && item.names?.length > 2 ?
                                      item.names[1]
                                    : item.ids[1]
                                  ], 
                                ]}
                                defaultValues={
                                  _initialValues ? 
                                    item.names ?
                                      [dayjs(_initialValues[item.names[0]]) || null, dayjs(_initialValues[item.names[1]]) || null]
                                    :
                                      [dayjs(_initialValues[item.ids[0]]) || null, dayjs(_initialValues[item.ids[1]]) || null]
                                  :
                                    null}
                                // defaultValues={item.defaults ? [dayjs(item.defaults[0]) || null, dayjs(item.defaults[1]) || null] : null}
                                setFieldValue={setFieldValue}
                                onChanges={[
                                  async (e) => {
                                    await setFieldValued(item.names && item.names?.length > 2 ? item.names[0] : item.ids[0], dayjs(e).format('YYYY-MM-DD'));

                                    if (item?.onAfterChange)
                                      item?.onAfterChange(e);
                                  },
                                  async (e) => {
                                    await setFieldValued(item.names && item.names?.length > 2 ? item.names[1] : item.ids[1], dayjs(e).format('YYYY-MM-DD'));

                                    if (item?.onAfterChange)
                                      item?.onAfterChange(e);
                                  },
                                ]}
                              />
                            </div>
  
                            :item.type === 'time' ?
                              <DatePicker
                                id={item.id}
                                name={item.name || item.id}
                                picker='time'
                                widthSize={item.widthSize || 'flex'}
                                format='HH:mm'
                                important={item.important}
                                label={item.label}
                                disabled={item.disabled}
                                placeholder={item.placeholder}
                                value={values[item.name || item.id]}
                                defaultValue={_initialValues[item.name || item.id] ? dayjs(_initialValues[item.name || item.id]) : null}
                                // defaultValue={item.default ? dayjs(item.default) : null}
                                onChange={async (e) => {
                                  await setFieldValued(item.name || item.id, dayjs(e).format('HH:mm'));
                                  
                                  if (item?.onAfterChange)
                                    item?.onAfterChange(e);
                                }}
                              />
                            
                            :item.type === 'datetime' ?
                            <div>
                              {item?.useCheckbox ?
                                <Checkbox
                                  id={item.id + '_chk'} code={item.id + '_chk'} name={(item.name || item.id) + '_chk'} text={item.label}
                                  checked={values[(item.name || item.id) + '_chk']}
                                  onChange={async (e) => {
                                    await setFieldValued((item.name || item.id) + '_chk', e.target.checked);
                                    if (item?.onAfterChange)
                                      item?.onAfterChange(e);
                                  }}
                                />
                              : null}
                              <DatePicker
                                id={item.id}
                                name={item.name || item.id}
                                picker='datetime'
                                widthSize={item.widthSize || 'flex'}
                                format='YYYY-MM-DD HH:mm:ss'
                                important={item.important}
                                label={item?.useCheckbox ? null : item.label}
                                disabled={
                                  item?.useCheckbox ? 
                                    !(values[(item.name || item.id) + '_chk'] === true)
                                  : item.disabled
                                }
                                placeholder={item.placeholder}
                                value={values[item.name || item.id]}
                                defaultValue={_initialValues[item.name || item.id] ? dayjs(_initialValues[item.name || item.id]) : null}
                                // defaultValue={item.default ? dayjs(item.default) : null}
                                onChange={async (e) => {
                                  await setFieldValued(item.name || item.id, dayjs(e).format('YYYY-MM-DD HH:mm:ss'));
  
                                  if (item?.onAfterChange)
                                    item?.onAfterChange(e);
                                }}
                              />
                            </div>
  
                            :item.type === 'check' ?
                              <CheckboxGroup
                                id={item.id}
                                name={item.name || item.id}
                                options={item.options as ICheckboxItem[]}
                                important={item.important}
                                label={item.label}
                                disabled={item.disabled}
                                defaultValue={defaultValues[item.name || item.id]}
                                // defaultValue={item.default}
                                onChange={async (e) =>  {
                                  await setFieldValued(item.name || item.id, e);
  
                                  if (item?.onAfterChange)
                                    item?.onAfterChange(e);
                                }}
                              />
                  
  
                            :item.type === 'radio' ?
                              <RadioGroup
                                id={item.id}
                                name={item.name || item.id}
                                options={item.options as IRadioItem[]}
                                important={item.important}
                                label={item.label}
                                disabled={item.disabled}
                                defaultValue={defaultValues[item.name || item.id]}
                                // defaultValue={item.default}
                                value={values[item.name || item.id]}
                                useOutline={true}
                                onChange={async (e) => {
                                  await setFieldValued(item.name || item.id, e.target.value);
                                  
                                  if (item?.onAfterChange)
                                    item?.onAfterChange(e);
                                }}
                              />
                            :item.type === 'combo' ?
                              <Combobox
                                id={item.id}
                                name={item.name || item.id}
                                options={item.options as IComboboxItem[]}
                                important={item.important}
                                label={item.label}
                                disabled={item.disabled}
                                defaultValue={defaultValues[item.name || item.id]}
                                // defaultValue={item.default}
                                value={values[item.name || item.id]}
                                onChange={async (e) => {
                                  await setFieldValued(item.name || item.id, e)
  
                                  if (item?.onAfterChange)
                                    item?.onAfterChange(e);
                                }}
                                dataSettingOptions={
                                  typeof item?.dataSettingOptions === 'function' ?
                                    item.dataSettingOptions({item, props}) as any
                                  :
                                    item.dataSettingOptions
                                }
                                firstItemType={item?.firstItemType}
                              />
                            
                            :null
                          
                        :
                        <Row style={{width:380}}>
                        <Col span={10} style={{paddingTop: 5}}>
                          <Label text={item.label} important={item.important} />
                        </Col>
                        <Col span={14} style={{width: '100%', display: 'block'}}>
                        {
                          item.type === 'text' ?
                            <div>
                              <Textbox
                                id={item.id}
                                name={item.name || item.id}
                                important={item.important}
                                // label={item.label}
                                inputType='text'
                                widthSize={item.widthSize || 'flex'}
                                disabled={item.usePopup || item.disabled}
                                readOnly={item.usePopup || item.readOnly}
                                placeholder={item.placeholder}
                                value={values[item.name || item.id]}
                                defaultValue={defaultValues[item.name || item.id]}
                                onChange={async (e) => {
                                  await setFieldValued(item.name || item.id, e.target.value);

                                  if (item?.onAfterChange)
                                    item?.onAfterChange(e);
                                }}
                                suffix={item.suffix}
                              />
                              <div style={{float:'right'}}>
                                {item.usePopup ?
                                  <div style={{marginLeft:-30}}>
                                  <PopupButton
                                    {...item.popupButtonSettings}
                                    id={item.id}
                                    setValues={(values) => {
                                      setValues(crr => ({...crr, ...values}));
                                      handleSubmit();
                                    }}
                                    firstItemEmpty={item?.required !== true}
                                    popupKey={item.popupKey}
                                    params={item.params}
                                    popupKeys={item.popupKeys}
                                    disabled={item.disabled}
                                    handleChange={item.handleChange}
                                    values={values}
                                  />
                                  </div>
                                : null}
                              </div>
                            </div>
                          

                          :item.type === 'number' ?
                            <Textbox
                              id={item.id}
                              name={item.name || item.id}
                              important={item.important}
                              // label={item.label}
                              inputType='number'
                              widthSize={item.widthSize || 'flex'}
                              disabled={item.disabled}
                              readOnly={item.readOnly}
                              placeholder={item.placeholder}
                              // value={values[item.name || item.id]}
                              value={Number(values[item.name || item.id]).toFixed(item?.decimal ?? ENUM_DECIMAL.DEC_NOMAL)}
                              defaultValue={Number(defaultValues[item.name || item.id]).toFixed(item?.decimal ?? ENUM_DECIMAL.DEC_NOMAL)}
                              onChange={async (e) => {
                                await setFieldValued(item.name || item.id, e.target.value);

                                if (item?.onAfterChange)
                                  item?.onAfterChange(e);
                              }}
                              suffix={item.suffix}
                            />


                          :item.type === 'date' ?
                            <div>
                              {item?.useCheckbox ?
                                <Checkbox
                                  id={item.id + '_chk'} code={item.id + '_chk'} name={(item.name || item.id) + '_chk'} text={item.label}
                                  checked={values[(item.name || item.id) + '_chk']}
                                  onChange={async (e) => {
                                    await setFieldValued((item.name || item.id) + '_chk', e.target.checked);
                                    if (item?.onAfterChange)
                                      item?.onAfterChange(e);
                                  }}
                                />
                              : null}
                              <DatePicker
                                id={item.id}
                                name={item.name || item.id}
                                picker='date'
                                format='YYYY-MM-DD'
                                widthSize={item.widthSize || 'flex'}
                                important={item.important}
                                // label={item?.useCheckbox ? null : item.label}
                                disabled={
                                  item?.useCheckbox ? 
                                    !(values[(item.name || item.id) + '_chk'] === true)
                                  : item.disabled
                                }
                                placeholder={item.placeholder}
                                value={values[item.name || item.id]}
                                defaultValue={_initialValues[item.name || item.id] ? dayjs(_initialValues[item.name || item.id]) : null}
                                // defaultValue={item.default ? dayjs(item.default) : null}
                                onChange={async (e) => {
                                  await setFieldValued(item.name || item.id, dayjs(e).format('YYYY-MM-DD'));
  
                                  if (item?.onAfterChange)
                                    item?.onAfterChange(e);
                                }}
                              />
                            </div>

                          
                          :item.type === 'daterange' ?
                            <div>
                              {item?.useCheckbox ?
                                <Checkbox
                                  id={item.id + '_chk'} code={item.id + '_chk'} name={(item.name || item.id) + '_chk'} text={item.label}
                                  checked={values[(item.name || item.id) + '_chk']}
                                  onChange={async (e) => {
                                    await setFieldValued((item.name || item.id) + '_chk', e.target.checked);
                                    if (item?.onAfterChange)
                                      item?.onAfterChange(e);
                                  }}
                                />
                              : null}
                              <DateRangePicker
                                ids={item.ids}
                                names={item.names || item.ids}
                                picker='date'
                                widthSize={item.widthSize || 'flex'}
                                format='YYYY-MM-DD'
                                important={item.important}
                                // label={item?.useCheckbox ? null : item.label}
                                disabled={
                                  item?.useCheckbox ? 
                                    !(values[(item.name || item.id) + '_chk'] === true)
                                  : item.disabled
                                }
                                placeholders={item.placeholders}
                                values={[
                                  values[
                                    item.names && item.names?.length > 2 ?
                                      item.names[0]
                                    : item.ids[0]
                                  ], 
                                  values[
                                    item.names && item.names?.length > 2 ?
                                      item.names[1]
                                    : item.ids[1]
                                  ], 
                                ]}
                                defaultValues={
                                  _initialValues ? 
                                    item.names ?
                                      [dayjs(_initialValues[item.names[0]]) || null, dayjs(_initialValues[item.names[1]]) || null]
                                    :
                                      [dayjs(_initialValues[item.ids[0]]) || null, dayjs(_initialValues[item.ids[1]]) || null]
                                  :
                                    null}
                                // defaultValues={item.defaults ? [dayjs(item.defaults[0]) || null, dayjs(item.defaults[1]) || null] : null}
                                onChanges={[
                                  async (e) => {
                                    await setFieldValued(item.names && item.names?.length > 2 ? item.names[0] : item.ids[0], dayjs(e).format('YYYY-MM-DD'));

                                    if (item?.onAfterChange)
                                      item?.onAfterChange(e);
                                  },
                                  async (e) => {
                                    await setFieldValued(item.names && item.names?.length > 2 ? item.names[1] : item.ids[1], dayjs(e).format('YYYY-MM-DD'));

                                    if (item?.onAfterChange)
                                      item?.onAfterChange(e);
                                  },
                                ]}
                              />
                            </div>


                          :item.type === 'time' ?
                            <DatePicker
                              id={item.id}
                              name={item.name || item.id}
                              picker='time'
                              widthSize={item.widthSize || 'flex'}
                              format='HH:mm'
                              important={item.important}
                              label={props?.onSubmit ? item.label: null}
                              disabled={item.disabled}
                              placeholder={item.placeholder}
                              value={values[item.name || item.id]}
                              defaultValue={_initialValues[item.name || item.id] ? dayjs(_initialValues[item.name || item.id]) : null}
                              // defaultValue={item.default ? dayjs(item.default) : null}
                              onChange={async (e) => {
                                await setFieldValued(item.name || item.id, dayjs(e).format('HH:mm'));
                                
                                if (item?.onAfterChange)
                                  item?.onAfterChange(e);
                              }}
                            />

                          :item.type === 'datetime' ?
                          <div>
                            {item?.useCheckbox ?
                              <Checkbox
                                id={item.id + '_chk'} code={item.id + '_chk'} name={(item.name || item.id) + '_chk'} text={item.label}
                                checked={values[(item.name || item.id) + '_chk']}
                                onChange={async (e) => {
                                  await setFieldValued((item.name || item.id) + '_chk', e.target.checked);
                                  if (item?.onAfterChange)
                                    item?.onAfterChange(e);
                                }}
                              />
                            : null}
                            <DatePicker
                              id={item.id}
                              name={item.name || item.id}
                              picker='datetime'
                              widthSize={item.widthSize || 'flex'}
                              format='YYYY-MM-DD HH:mm:ss'
                              important={item.important}
                              // label={item?.useCheckbox ? null : item.label}
                              disabled={
                                item?.useCheckbox ? 
                                  !(values[(item.name || item.id) + '_chk'] === true)
                                : item.disabled
                              }
                              placeholder={item.placeholder}
                              value={values[item.name || item.id]}
                              defaultValue={_initialValues[item.name || item.id] ? dayjs(_initialValues[item.name || item.id]) : null}
                              // defaultValue={item.default ? dayjs(item.default) : null}
                              onChange={async (e) => {
                                await setFieldValued(item.name || item.id, dayjs(e).format('YYYY-MM-DD HH:mm:ss'));

                                if (item?.onAfterChange)
                                  item?.onAfterChange(e);
                              }}
                            />
                          </div>

                          :item.type === 'check' ?
                            <CheckboxGroup
                              id={item.id}
                              name={item.name || item.id}
                              options={item.options as ICheckboxItem[]}
                              important={item.important}
                              label={props?.onSubmit ? item.label: null}
                              disabled={item.disabled}
                              defaultValue={defaultValues[item.name || item.id]}
                              // defaultValue={item.default}
                              onChange={async (e) =>  {
                                await setFieldValued(item.name || item.id, e);

                                if (item?.onAfterChange)
                                  item?.onAfterChange(e);
                              }}
                            />
                

                          :item.type === 'radio' ?
                            <RadioGroup
                              id={item.id}
                              name={item.name || item.id}
                              options={item.options as IRadioItem[]}
                              important={item.important}
                              label={props?.onSubmit ? item.label: null}
                              disabled={item.disabled}
                              defaultValue={defaultValues[item.name || item.id]}
                              // defaultValue={item.default}
                              value={values[item.name || item.id]}
                              useOutline={true}
                              onChange={async (e) => {
                                await setFieldValued(item.name || item.id, e.target.value);
                                
                                if (item?.onAfterChange)
                                  item?.onAfterChange(e);
                              }}
                            />

                          :item.type === 'combo' ?
                            <Combobox
                              id={item.id}
                              name={item.name || item.id}
                              widthSize={item.widthSize || 'flex'}
                              options={item.options as IComboboxItem[]}
                              important={item.important}
                              label={props?.onSubmit ? item.label: null}
                              disabled={item.disabled} 
                              defaultValue={defaultValues[item.name || item.id]}
                              // defaultValue={item.default}
                              value={values[item.name || item.id]}
                              onChange={async (e) => {
                                await setFieldValued(item.name || item.id, e)

                                if (item?.onAfterChange)
                                  item?.onAfterChange(e, setFieldValue);
                              }}
                              dataSettingOptions={
                                typeof item?.dataSettingOptions === 'function' ?
                                  item.dataSettingOptions({item, props}) as any
                                :
                                  item.dataSettingOptions
                              }
                              firstItemType={item?.firstItemType}
                            />
                          
                          :null
                        }
                      </Col>
                      </Row>}
                      </div>
                    )
                  else null;
                })}
                {props.onSubmit ?
                  <button type='submit'>
                    {props.buttonText}
                  </button>
                : null}
              </Space>
            </Form>
          )
        }}
      >
      </Formik>
      </div>
    </Container>
  );
};

const InputGroupbox = React.memo(BaseInputGroupbox);

export {InputGroupbox};