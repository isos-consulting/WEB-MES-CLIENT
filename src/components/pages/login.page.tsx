import { Form, message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import crypto from 'crypto-js';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { AuthenticationRemoteStore } from '~/apis/aut/authentication';
import { FactoryResponse, FactoryRepository } from '~/v2/api/FactoryRepository';
import { isNil } from '~/helper/common';
import { Profile } from '~/models/user/profile';
import { UserService } from '~/service/auth';
import { TpLogin } from '../templates/login/login.template';
import { IComboBoxItem } from '../UI/combobox';
import { TestMESRequest } from '~/v2/api/stub/TestMESRequest';
// import { mesRequest } from '~/apis/request-factory';

const pageId = uuidV4();

const getLocalStorageId = () => {
  return localStorage.getItem('iso-user-id') || '';
};

const isSaveUserInfo = () => {
  return !isNil(localStorage.getItem('userInfo'));
};

export const PgLogin = ({
  profile,
  authenticatedCallback,
}: {
  profile: Profile;
  authenticatedCallback: (userProfile: Profile) => void;
}) => {
  const [form] = Form.useForm();

  const [checked, setChecked] = useState<boolean>(Boolean(getLocalStorageId()));
  const [userId, setUserId] = useState<string>(getLocalStorageId() || null);
  const [userPw, setUserPw] = useState<string>(null);

  const [cboFactory, setCboFactory] = useState<IComboBoxItem[]>([]);

  const [cboFactoryCode, setCboFactoryCode] = useState<string>('-');

  const defaultValue = getLocalStorageId();

  const handleLoginCheck = async () => {
    if (isSaveUserInfo() === true) {
      const storedUserProfile =
        JSON.parse(localStorage.getItem('userInfo')).pwd_fg === true
          ? profile.authenticate().resetPassword('')
          : profile.authenticate();

      authenticatedCallback(storedUserProfile);
    } else {
      getFactories();
    }
  };

  useLayoutEffect(() => {
    handleLoginCheck();
  }, []);

  useLayoutEffect(() => {
    let auto_save_factory = localStorage.getItem('iso-factory');
    for (let i = 0; i < cboFactory.length; i++) {
      if (auto_save_factory === cboFactory[i]['code']) {
        setCboFactoryCode(localStorage.getItem('iso-factory') || '-');
        break;
      }
    }
  }, [cboFactory]);

  const clickable = useMemo(
    () => !!userId?.length && !!userPw?.length,
    [userId, userPw],
  );

  const onChecked = (e: CheckboxChangeEvent) => {
    const {
      target: { checked },
    } = e;
    setChecked(checked);
  };

  const onLogin = async () => {
    try {
      let factory: FactoryResponse = {
        factory_uuid: '',
        factory_cd: '',
        factory_nm: '',
      };

      if (!isNil(cboFactoryCode) && cboFactoryCode != '-') {
        factory = JSON.parse(cboFactoryCode as string);
      } else {
        message.error('로그인 실패 : 공장을 선택해주세요.');
        return;
      }

      const strResult = [
        {
          id: userId,
          pwd: crypto.AES.encrypt(userPw, 'secret').toString(),
        },
      ];

      const authorizedUser = await AuthenticationRemoteStore.login(strResult);
      message.success('로그인 성공');

      const userService = new UserService();

      const userInfo = userService.serializeUser(
        authorizedUser[0],
        userId,
        factory,
      );
      const tokenInfo = userService.serializeToken(authorizedUser[0]);

      userService.setAutoLoginData(userInfo, tokenInfo);
      if (checked) {
        userService.rememberAutoInputData(cboFactoryCode, userId);
      } else if (checked === false) {
        userService.removeAutoInputData();
      }

      const passedUserProfile =
        authorizedUser[0].pwd_fg === true
          ? profile.authenticate().resetPassword('')
          : profile.authenticate();

      authenticatedCallback(passedUserProfile);
    } catch (err) {
      message.error(err);
    }
  };

  const getFactories = async () => {
    const serialFactoryInfo = (factory: object) => {
      return JSON.stringify({
        factory_uuid: factory['factory_uuid'],
        factory_id: factory['factory_id'],
      });
    };
    const pushFactoryComboDatas = factories => {
      const comboBoxDatas = [];

      factories.forEach(factory => {
        comboBoxDatas.push({
          code: serialFactoryInfo(factory),
          text: factory['factory_nm'],
        });
      });

      return comboBoxDatas;
    };

    const factories = await FactoryRepository.getInstance(
      TestMESRequest,
      // this TestMESRequest will replace to mesRequest.
      // mesRequest
    ).get();

    const cboData = pushFactoryComboDatas(factories);

    setCboFactory(cboData);
  };

  const onChangeId = ev => {
    setUserId(ev?.target?.value);
  };

  const onChangePw = ev => {
    setUserPw(ev?.target?.value);
  };

  const onChangeCbo = ev => {
    setCboFactoryCode(ev);
  };

  return (
    <TpLogin
      id={pageId}
      factoryList={cboFactory}
      form={form}
      factoryValue={cboFactoryCode}
      defaultIdValue={defaultValue}
      idValue={userId}
      onChangeCbo={onChangeCbo}
      onChangeId={onChangeId}
      onChangePw={onChangePw}
      onLogin={onLogin}
      disabled={!clickable}
      savedIdChecked={checked}
      onSavedIdChecked={onChecked}
    />
  );
};
