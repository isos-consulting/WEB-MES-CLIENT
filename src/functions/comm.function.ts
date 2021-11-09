import axios from 'axios';
import { loadProgressBar } from 'axios-progress-bar';
import { getUserInfoKeys, getUserFactoryUuid, getUserAccessToken } from './storage.function';
import { getObjectKeyDuplicateCheck } from './util.function';
import { message } from 'antd';
import dotenv from 'dotenv';
import { useReducer } from 'react';
import { atSideNavMenuContent, ILevel1Info, ILevel2Info, ILevel3Info, TPermission } from '~/components/UI';
import * as Pages from "~/components/pages";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {useLayoutEffect, useState} from 'react';
import { JSXElement } from '@babel/types';
import { errorState } from '~/enums/response.enum';
import { getUserRefreshToken, onAsyncFunction } from '.';
import { authStore } from '~/hooks';


dotenv.config();
// const baseURL = process.env.TEST_URL_WON;
const baseURL = process.env.TEST_URL;
// const baseURL ="http://191.1.70.134:3000/";
// const baseURL = process.env.URL;
// const baseURL ="http://191.1.70.5:3000/";

/**
 * 서버 데이터 가져오기
 * @param params 서버에 전달할 파라메터
 * @param uriPath 도메인 뒤에 붙는 URL
 * @param returnType 반환 타입
 */
export async function getData<T = any[]>(
  params: object,
  uriPath: string,
  returnType: 'data' | 'datas' | 'raws' | 'header-details' | 'value' | 'message' | 'success' | 'report' | 'original' = 'raws',
  headersObj?: object,
):Promise<T> {
  loadProgressBar();
  
  let datas:any = null;
  // let FACTORY_INSERT_FLAG:boolean = true;

  try {
    // session 유저 정보의 키와 params로 넘길 키가 중복되는게 있는지 확인 (중복이면 유저 정보에 있는 키는 사용안함)
    if (params != null && getUserInfoKeys() != null) {
      if (getObjectKeyDuplicateCheck(Object.keys(params), getUserInfoKeys()) === true) {
        datas = null;
        // FACTORY_INSERT_FLAG = false;
      }
    }
    datas = await axios({
      method: 'get',
      baseURL:baseURL,
      url: uriPath,
      params: {...params, factory_uuid:getUserFactoryUuid()},
      headers: {
        authorization:getUserAccessToken(),
        ...headersObj

        //refresh:getUserRefreshToken(),
      },
    })
  } catch (error) {
    console.log(error.response.data.state)
    if (error.response.data.state.state_no === errorState.EXPIRED_ACCESS_TOKEN) {
      await getData({},'/refresh-token', 'raws', {refresh:getUserRefreshToken()}).then(async (res)=>{
        await onAsyncFunction(sessionStorage.setItem, 
          'tokenInfo',
          JSON.stringify({
            access_token: res[0].access_token,
            refresh_token: res[0].refresh_token
          })
        )

        await getData(params, uriPath, 'original', headersObj).then((res)=>{
          datas = res;
        });
      }).catch((error)=>{
        
        setLogout();

        datas = null
      })
    } else {
      datas = null;

      console.log('err', error);
    }
  } finally {
    switch (returnType) {
      case 'datas':
        datas = datas?.data?.datas;
        break;

      case 'raws':
        datas = datas?.data?.datas?.raws;
        break;
    
      case 'header-details':
        datas = datas?.data?.datas?.raws[0];
        break;

      case 'value':
        datas = datas?.data?.datas?.value;
        break;

      case 'message':
        datas = datas?.data?.message;
        break;

      case 'success':
        datas = datas?.data?.success;
        break;
      
      case 'report':
        datas = datas?.data?.datas?.raws[0]; // {datas. subTotals}
        break;

      case 'original':
        break;

      case 'data':
      default:
        datas = datas?.data;
        break;
    }

    return datas;
  }
}


/**
 * 데이터를 저장시키기 위해 서버에 전송하는 함수
 * @param data 저장할 데이터
 * @param uriPath 도메인 뒤에 붙는 URL
 * @param mothodType 메소드 타입 post, put, patch, delete
 * @param returnType 반환 타입
 * @param disableErrorMessage 에러메시지 여부
 * @returns 
 */
export const executeData = async (
  data: object[] | object,
  uriPath: string,
  mothodType: 'post' | 'put' | 'patch' | 'delete',
  returnType: 'data' | 'datas' | 'raws' | 'value' | 'message' | 'success' = 'data',
  disableErrorMessage: boolean = false,
) => {
  loadProgressBar();

  let datas : any;
  try {
    datas = await axios({
          method: mothodType,
          baseURL: baseURL,
          url: uriPath,
          data: data,
          headers:{
            authorization:getUserAccessToken(),
          }
        });
  } catch (error) {
    if (!disableErrorMessage) message.error(error.response.data.message);
    console.log(error);
    datas = null;
  }

  switch (returnType) {
    case 'datas':
      datas = datas?.data?.datas;
      break;

    case 'raws':
      datas = datas?.data?.datas?.raws;
      break;

    case 'value':
      datas = datas?.data?.datas?.value;
      break;

    case 'message':
      datas = datas?.data?.message;
      break;

    case 'success':
      datas = datas?.data?.success;
      break;
  
    case 'data':
    default:
      datas = datas?.data;
      break;
  }

  return datas;
}


export function useForceUpdate(): () => void {
  return useReducer(() => ({}), {})[1] as () => void // <- paste here
}


/** API를 사용해서 메뉴 데이터를 반환합니다. */
export const getMenus = async () => {
  let rawData = []; //미가동 메뉴 데이터
  let data = {};

  await getData({}, '/aut/menus/permission').then((res) => {
    rawData = res;

  }).finally(() => {
    let result = {};
    
    rawData?.forEach((level1:ILevel1Info) => {
    if (level1.menu_type === 'page') {
      result[level1.menu_nm] = {
      uuid: level1.menu_uuid as string,
      path: level1.menu_uri as string,
      title: level1.menu_nm as string,
      component: Pages[level1.component_nm] as () => JSXElement,
      description: null,
      permissions: {
        create_fg: level1.create_fg,
        read_fg: level1.read_fg,
        update_fg: level1.update_fg,
        delete_fg: level1.delete_fg,
      },
      };
    };

    if (level1.menu_type === 'menu' && level1.sub_menu?.length as number > 0) {
      level1?.sub_menu?.forEach((level2:ILevel2Info) => {
      if (level2.menu_type === 'page') {
        result[level2.menu_nm] = {
        uuid: level2.menu_uuid as string,
        path: level2.menu_uri as string,
        title: level2.menu_nm as string,
        component: Pages[level2.component_nm] as () => JSXElement,
        description: level1.menu_nm as string,
        permissions: {
          create_fg: level2.create_fg,
          read_fg: level2.read_fg,
          update_fg: level2.update_fg,
          delete_fg: level2.delete_fg,
        },
        };
      };

      if (level2.menu_type === 'menu' && level2.sub_menu?.length as number > 0) {
        level2?.sub_menu?.forEach((level3:ILevel3Info) => {
        if (level3.menu_type === 'page') {
          result[level3.menu_nm] = {
          uuid: level3.menu_uuid as string,
          path: level3.menu_uri as string,
          title: level3.menu_nm as string,
          component: Pages[level3.component_nm] as () => JSXElement,
          description: level1.menu_nm + ' > ' + level2.menu_nm as string,
          permissions: {
            create_fg: level3.create_fg,
            read_fg: level3.read_fg,
            update_fg: level3.update_fg,
            delete_fg: level3.delete_fg,
          },
          };
        };
        });
      }
      });
    };
    });

    data = result;
  });

  return {data, rawData};
}

/** 권한 정보를 가져오는 함수입니다.
 * recoil state를 사용하여 조회하므로 컴포넌트 최상단 로직에 사용해야 합니다.
 * @param pageName 페이지명
 * @returns TPermssion
 */
export const getPermissions = (pageName:string):TPermission => {
  const menuContent = useRecoilValue(atSideNavMenuContent);
  const [permissions, setPermissions] = useState<TPermission>(null);

  useLayoutEffect(() => {
    if (!menuContent) return;
    const permissions = menuContent[pageName]?.permissions;

    if (!permissions) return;
    setPermissions(permissions);
  }, [menuContent]);

  return permissions;
}

/**
 * 로그아웃 함수 ..
 * 로그인 된 정보를 해당 함수에서 삭제해줘야 함.
 */
export const setLogout = async () => {
  await sessionStorage.removeItem('userInfo');
  await sessionStorage.removeItem('tokenInfo');
  window.location.href = "/login";
}