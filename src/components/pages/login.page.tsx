import React from 'react';
import { useMemo, useState } from 'react';
import { message, Form } from 'antd';
import crypto from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { consoleLogLocalEnv, executeData, getData } from '../../functions';
import dotenv from 'dotenv';
import { TpLogin } from '../templates/login/login.template';
import { IComboboxItem } from '../UI/combobox';
import IInputPopupProps from '../UI/input-popup/input-popup.ui.type';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useLayoutEffect } from 'react';
import { Profile } from '~/models/user/profile';

dotenv.config();

const pageId = uuidv4();
const uriPath = 'aut/user/sign-in/';

const getLocalStorageId = () => {
  return localStorage.getItem('iso-user-id') || '';
};

const isSaveUserInfo = () => {
  return localStorage.getItem('userInfo') != null;
};

/** 로그인 페이지 */
export const PgLogin = ({
  profile,
  authenticatedCallback,
}: {
  profile: Profile;
  authenticatedCallback: (userProfile: Profile) => void;
}) => {
  consoleLogLocalEnv('%c✔Login 화면 테스트', 'color: green; font-size: 20px;');
  const [form] = Form.useForm();

  const [checked, setChecked] = useState<boolean>(Boolean(getLocalStorageId()));

  const [visible, setVisible] = useState(false);

  const [userId, setUserId] = useState<string>(getLocalStorageId() || null);
  const [userPw, setUserPw] = useState<string>(null);

  // 공장 콤보박스 세팅용
  const [cboFactory, setCboFactory] = useState<IComboboxItem[]>([]);

  // 공장 콤보박스 선택된 데이터
  const [cboFactoryCode, setCboFactoryCode] = useState<string>('-');

  consoleLogLocalEnv(
    `로컬 스토리지에 저장 되어 있는 사용자 ID : ${getLocalStorageId()}`,
  );
  const defaultValue = getLocalStorageId();

  const handleLoginCheck = async () => {
    consoleLogLocalEnv(
      `로컬 스토리지에 사용자 정보가 저장되어 있나요? ${isSaveUserInfo()}`,
    );
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

  // constructor
  useLayoutEffect(() => {
    // 이전에 저장된 아이디 불러오기
    // const id = getLocalStorageId();
    // setUserId(id);

    // 공장 콤보박스 조회
    handleLoginCheck();
  }, []);

  // 공장 콤보박스 값 세팅하기
  useLayoutEffect(() => {
    let auto_save_factory = localStorage.getItem('iso-factory');
    for (let i = 0; i < cboFactory.length; i++) {
      if (auto_save_factory === cboFactory[i]['code']) {
        setCboFactoryCode(localStorage.getItem('iso-factory') || '-');
        break;
      }
    }
  }, [cboFactory]);

  const hideUserModal = () => {
    setVisible(false);
  };

  // 비번 변경용 팝업 액션
  const InputPassWordChk = (values: object) => {
    if (values['pwd'] != values['pwdChk']) {
      message.warning('비밀번호가 다릅니다. 확인해주세요.');
      return;
    }

    try {
      let strResult: object[];

      strResult = [
        {
          uidPk: JSON.parse(localStorage.getItem('userInfo') as string)?.uid,
          pwd: crypto.AES.encrypt(values['pwd'], 'secret').toString(),
          uid: JSON.parse(localStorage.getItem('userInfo') as string)?.uid,
          pwdFg: 0,
        },
      ];

      executeData(strResult, 'aut/user/', 'patch')
        .then(res => {
          if (res?.success === true) {
            message.success('비밀번호 변경 완료. 다시 로그인해주세요.');
          }
        })
        .catch(err => console.log(err));
    } catch (err) {
      return message.error(err);
    }

    hideUserModal();
  };

  // 인풋 팝업박스 세팅 (비밀번호 찾기용 팝업)
  const InputPopupProps: IInputPopupProps = {
    modalProps: {
      onOk: InputPassWordChk,
      onCancel: hideUserModal,
      title: '비밀번호변경',
      okText: '확인',
      cancelText: '취소',
      visible: visible,
    },
    formProps: {
      name: 'userForm',
      layout: 'vertical',
    },
    formItemList: [
      {
        id: 'inputPwd',
        name: 'inputPwd',
        inputItemType: 'password',
        formItemProps: {
          name: 'pwd',
          label: '비밀번호',
          required: true,
          requireMessage: '변경 할 비밀번호를 입력해 주세요',
        },
      },
      {
        id: 'inputPwdChk',
        name: 'inputPwdChk',
        inputItemType: 'password',
        formItemProps: {
          name: 'pwdChk',
          label: '비밀번호 확인',
          required: true,
          requireMessage: '변경 할 비밀번호를 다시 한번 입력해 주세요',
        },
      },
    ],
  };

  // 아이디와 패스워드가 둘다 입력된 상태면 로그인 버튼 활성화
  const clickable = useMemo(
    () => !!userId?.length && !!userPw?.length,
    [userId, userPw],
  );

  // 체크박스 체크 이벤트
  const onChecked = (e: CheckboxChangeEvent) => {
    const {
      target: { checked },
    } = e;
    setChecked(checked);
  };

  // 로그인 버튼 눌렀을시
  const onLogin = async () => {
    try {
      let factory: object = {};

      if (cboFactoryCode != null && cboFactoryCode != '-') {
        factory = JSON.parse(cboFactoryCode as string);
      } else {
        message.error('로그인 실패 : 공장을 선택해주세요.');
        return;
      }

      let strResult: object;
      strResult = [
        {
          id: userId,
          pwd: crypto.AES.encrypt(userPw, 'secret').toString(),
        },
      ];

      executeData(strResult, uriPath, 'post')
        .then(res => {
          const serialUserInfo = (raws, userId, factory) => {
            return JSON.stringify({
              uid: raws[0].uid,
              id: userId,
              user_nm: raws[0].user_nm,
              factory_uuid: factory['factory_uuid'],
              pwd_fg: raws[0].pwd_fg,
              super_admin_fg: raws[0].super_admin_fg,
            });
          };

          const serialTokenInfo = raws => {
            return JSON.stringify({
              access_token: raws[0].access_token,
              refresh_token: raws[0].refresh_token,
            });
          };

          const { success, datas } = res;
          const { raws } = datas;
          if (success === true) {
            consoleLogLocalEnv(`로그인 요청 이후 서버 응답 상태 : ${success}`);
            consoleLogLocalEnv(
              '사용자 정보 직렬화',
              serialUserInfo(raws, userId, factory),
            );
            consoleLogLocalEnv('토큰 정보 직렬화', serialTokenInfo(raws));
            message.success('로그인 성공');
            localStorage.setItem(
              'userInfo',
              serialUserInfo(raws, userId, factory),
            );
            localStorage.setItem('tokenInfo', serialTokenInfo(raws));

            if (checked) {
              localStorage.setItem('iso-factory', cboFactoryCode as string);
              localStorage.setItem('iso-user-id', userId);
            } else {
              localStorage.removeItem('iso-factory');
              localStorage.removeItem('iso-user-id');
            }

            const passedUserProfile =
              raws[0].pwd_fg === true
                ? profile.authenticate().resetPassword('')
                : profile.authenticate();

            authenticatedCallback(passedUserProfile);
          }
        })
        .catch(err => console.log(err));
    } catch (err) {
      return message.error(err);
    }
  };

  // 공장 콤보박스 세팅하는 함수
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
        consoleLogLocalEnv(`공장 정보 직렬화: ${serialFactoryInfo(factory)}`);
        comboBoxDatas.push({
          code: serialFactoryInfo(factory),
          text: factory['factory_nm'],
        });
      });

      return comboBoxDatas;
    };

    const factories = await getData({}, 'std/factories/sign-in');
    consoleLogLocalEnv(
      `콤보박스에 저장 된 공장 정보: ${pushFactoryComboDatas(factories)}`,
    );
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
      // pwValue={userPw}
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
