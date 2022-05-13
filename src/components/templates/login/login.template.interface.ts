import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { IComboboxItem } from 'components/UI/combobox';
import React from 'react';

/**
 * 로그인 화면 속성 인터페이스
 */
export default interface ILoginProps {
  id: string;
  defaultIdValue?: string;

  idValue: string;
  // pwValue: string;
  factoryValue: string;
  disabled?: boolean;
  savedIdChecked?: boolean;
  factoryList: IComboboxItem[];
  form: any;
  onChangeCbo?: (ev) => void;
  onChangeId?: (ev) => void;
  onChangePw?: (ev) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  onSavedIdChecked?: (e: CheckboxChangeEvent) => void;
}

/** 로그인 템플릿의 로그인 폼 컴포넌트 속성 인터페이스 */
export interface ILoginForm {
  id: string;
  password: string;
}
