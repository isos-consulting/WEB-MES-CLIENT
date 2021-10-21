import React from "react";
import { useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import { authStore } from "../../hooks/auth.hook";
import { message, Form } from 'antd';
import crypto from 'crypto-js'
import { v4 as uuidv4 } from 'uuid';
import {executeData, getData} from '../../functions';
import dotenv from 'dotenv';
import { TpLogin } from "../templates/login/login.template";
import { IComboboxItem } from "../UI/combobox";
import IInputPopupProps from "../UI/input-popup/input-popup.ui.type";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useLayoutEffect } from "react";

dotenv.config();

const pageId = uuidv4();
const uriPath='aut/user/sign-in/';

const getLocalStorageId = () => {
  return localStorage.getItem('iso-user-id') || '';
}



/** 로그인 페이지 */
export const PgLogin = () => {

  const [form] = Form.useForm();

  const [checked, setChecked] = useState<boolean>(Boolean(getLocalStorageId()));
  // const [formState, setFormState] = useRecoilState(formStore.findState);
  const setUser = useSetRecoilState(authStore.user.state);
  
  const [visible, setVisible] = useState(false);

  const [userId, setUserId] = useState<string>(getLocalStorageId() || null);//useRecoilState(afStringState('userId'));
  const [userPw, setUserPw] = useState<string>(null);//useRecoilValue(afStringState('userPw'));

  // const inputPwd = useRecoilValue(afStringState('inputPwd'));
  // const inputPwdChk = useRecoilValue(afStringState('inputPwdChk'));

  // 공장 콤보박스 세팅용
  const [cboFactory, setCboFactory] = useState<IComboboxItem[]>([]);

  // 공장 콤보박스 선택된 데이터
  const [cboFactoryCode, setCboFactoryCode] = useState<string>('-');//getItemState('combo',pageId+'factory');

  const defaultValue = getLocalStorageId() || null;

  // constructor
  useLayoutEffect(() => {
    // 이전에 저장된 아이디 불러오기
    // const id = getLocalStorageId();
    // setUserId(id);

    // 공장 콤보박스 조회
    getFactories();
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
  


  const showUserModal = () => {
    setVisible(true);
  };

  const hideUserModal = () => {
    setVisible(false);
  };

  // 비번 변경용 팝업 액션
  const InputPassWordChk = (values:object) => {
    if (values['pwd'] != values['pwdChk']) {
      message.warning('비밀번호가 다릅니다. 확인해주세요.')
      return;
    }
    
    try {
      let strResult:object[];
      
      strResult=[{
        uidPk: JSON.parse(sessionStorage.getItem("userInfo") as string)?.uid,
        pwd: crypto.AES.encrypt(values['pwd'],'secret' ).toString(),
        uid: JSON.parse(sessionStorage.getItem("userInfo") as  string)?.uid,
        pwdFg: 0
      }];
      
      executeData(strResult,'aut/user/','patch')
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
  }

  // 인풋 팝업박스 세팅 (비밀번호 찾기용 팝업)
  const InputPopupProps:IInputPopupProps = {
    modalProps:{
      onOk:InputPassWordChk,
      onCancel:hideUserModal,
      title:'비밀번호변경',
      okText:'확인',
      cancelText:'취소',
      visible:visible,
    },
    formProps:{
      name:'userForm',
      layout:'vertical', 
    },
    formItemList:[
      { 
        id:'inputPwd',
        name: 'inputPwd',
        inputItemType:'password',
        formItemProps:{
          name:'pwd',
          label:'비밀번호',
          required:true,
          requireMessage:'변경 할 비밀번호를 입력해 주세요'
        }
      },
      {
        id:'inputPwdChk',
        name: 'inputPwdChk',
        inputItemType:'password',
        formItemProps:{
          name:'pwdChk',
          label:'비밀번호 확인',
          required:true,
          requireMessage:'변경 할 비밀번호를 다시 한번 입력해 주세요'
        }
      },
    ]
  }

  // 아이디와 패스워드가 둘다 입력된 상태면 로그인 버튼 활성화
  const clickable = useMemo(
    () => !!userId?.length && !!userPw?.length,
    [userId, userPw]
  );

  // 체크박스 체크 이벤트
  const onChecked = (e: CheckboxChangeEvent) => {
    const { target: { checked } } = e;
    setChecked(checked);
  };
  
  // 로그인 버튼 눌렀을시
  const onLogin = async () => {
    try {
      let factory:object = {};

      if (cboFactoryCode != null && cboFactoryCode != '-') {
        factory = JSON.parse(cboFactoryCode as string);
      } else {
        message.error('로그인 실패 : 공장을 선택해주세요.');
        return;
      }

      let strResult:object;
      strResult={
        id: userId,
        pwd: crypto.AES.encrypt(userPw,'secret').toString(),
      }
      
      executeData(strResult,uriPath,'post')
      .then(res => {
        const {success, datas} = res;
        const {raws} = datas;

        if (success === true) {
          sessionStorage.setItem(
            'userInfo',
            JSON.stringify({
              uid: raws[0].uid,
              factory_uuid:factory['factory_uuid'],
            })
          );

          if (raws[0].pwd_fg === 1){
            showUserModal();
          }else{
            message.success('로그인 성공');
            sessionStorage.setItem(
              'userInfo',
              JSON.stringify({
                uid: raws[0].uid,
                // id:formState.id,
                id: userId,
                userNm: raws[0].user_nm,
                token: raws[0].token,
                factory_uuid:factory['factory_uuid'],
              })
            );

            if (checked) {
              localStorage.setItem('iso-factory',cboFactoryCode as string)
              localStorage.setItem('iso-user-id',userId)
            }else{
              localStorage.removeItem('iso-factory')
              localStorage.removeItem('iso-user-id')
            }
            
            return setUser(JSON.parse(sessionStorage.getItem("userInfo") as string));
          }
        }
      })
      .catch(err => console.log(err));
      
    } catch (err) {
      return message.error(err);
    }
  }

  // 공장 콤보박스 세팅하는 함수
  const getFactories = () => {
    getData({}, 'std/factories/sign-in').then((value) => {
      let data:object[] = value;
      let cboData:IComboboxItem[] = [];

      data?.forEach((value) => {
        cboData.push({
          code: JSON.stringify({factory_uuid:value['factory_uuid'],factory_id:value['factory_id']}),
          text: value['factory_nm']
        });
      });
      
      setCboFactory(cboData);
    });
  }

  const onChangeId = (ev) => {
    setUserId(ev?.target?.value);
  }

  const onChangePw = (ev) => {
    setUserPw(ev?.target?.value);
  }

  const onChangeCbo = (ev) => {
    setCboFactoryCode(ev);
  }

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
}