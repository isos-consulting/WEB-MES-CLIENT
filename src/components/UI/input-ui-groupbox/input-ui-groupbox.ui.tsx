import React, { useMemo } from 'react';
import { Container } from '../container';
import { DatePicker } from '../date-picker';
import { DateRangePicker } from '../date-range-picker';
import { Textbox } from '../textbox';
import { Combobox } from '../combobox';
import { CheckboxGroup } from '../checkbox-group';
import { RadioGroup } from '../radio-group';
import { PopupButton } from '../popup-button';
import { Space } from 'antd';
import Props, { IInputUiGroupItem } from './input-ui-groupbox.ui.type';
import { selectorFamily } from 'recoil';
import {
  afAnyArrayState,
  afBooleanState,
  afDateState,
  afObjectArrayState,
  afObjectState,
  afStringArrayState,
  afStringState,
} from '~/recoils/recoil.atom-family';

export const sfInputbox = selectorFamily({
  key: 'sfInputbox',
  get:
    (ids: string[]) =>
    ({ get }) => {
      const result: object = {};
      ids.forEach(id => {
        result[id] =
          get(afStringState(id)) != null
            ? get(afStringState(id))
            : get(afStringArrayState(id)) != null
            ? get(afStringArrayState(id))
            : get(afAnyArrayState(id)) != null
            ? get(afAnyArrayState(id))
            : get(afBooleanState(id)) != null
            ? get(afBooleanState(id))
            : get(afDateState(id)) != null
            ? get(afDateState(id))
            : get(afObjectState(id)) != null
            ? get(afObjectState(id))
            : get(afObjectArrayState(id)) != null
            ? get(afObjectArrayState(id))
            : null;
      });

      return result;
    },
});

const InputUiGroupbox: React.FC<Props> = props => {
  const { inputItems } = props;

  if (!inputItems) return <></>;

  // 검색조건 컨트롤 생성
  const searchComponent = useMemo(
    () => (
      <Space size={[16, 8]} wrap key="searchComponent">
        <>
          {inputItems.length > 0
            ? inputItems.map((value: IInputUiGroupItem, index: number) => {
                let disabled: boolean = value?.disabled as boolean;

                if (
                  props.insertType === 'create' &&
                  value?.insertable === true
                ) {
                  disabled = false;
                }

                let returnJSX = <div></div>;
                switch (value.type) {
                  case 'text':
                    returnJSX = (
                      <Textbox
                        {...value}
                        id={value.id as string}
                        name={value.name as string}
                        value={value?.value}
                        inputType={value?.format as any}
                        placeholder={value?.placeholder as string}
                        disabled={disabled}
                      />
                    );
                    break;

                  case 'combo':
                    returnJSX = (
                      <Combobox
                        {...value}
                        id={value.id as string}
                        options={value.options}
                        disabled={disabled}
                        dataSettingOptions={
                          value?.dataSettingOptions as {
                            uriPath: string;
                            params?: object;
                            codeName: string;
                            textName: string;
                          }
                        }
                      />
                    );
                    break;

                  case 'radio':
                    returnJSX = (
                      <RadioGroup
                        {...value}
                        id={value.id as string}
                        disabled={disabled}
                      />
                    );
                    break;

                  case 'check':
                    returnJSX = (
                      <CheckboxGroup
                        {...value}
                        id={value.id as string}
                        options={value.options}
                        disabled={disabled}
                      />
                    );
                    break;

                  case 'date':
                    returnJSX = (
                      <DatePicker
                        {...value}
                        id={value.id as string}
                        disabled={disabled}
                        placeholder={value?.placeholder as string}
                      />
                    );
                    break;

                  case 'dateRange':
                    returnJSX = (
                      <DateRangePicker
                        {...value}
                        ids={value.id as string[]}
                        disabled={disabled}
                        placeholders={value?.placeholder as string[]}
                      />
                    );
                    break;

                  case 'popup':
                    returnJSX = (
                      <div style={{ marginLeft: -28 }}>
                        <PopupButton
                          id={value.id as string}
                          popupKey={value.popupKey}
                          disabled={disabled}
                        />
                      </div>
                    );
                    break;

                  default:
                    break;
                }

                if (!value.hidden)
                  return (
                    <Space wrap key={'groupbox-element' + index}>
                      {returnJSX}
                    </Space>
                  );
                else return null;
              })
            : ''}
        </>
      </Space>
    ),
    [props.inputItems],
  );

  // 여기서 return
  return <Container>{searchComponent}</Container>;
};

export default InputUiGroupbox;
