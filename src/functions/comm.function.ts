import axios from 'axios';
import { loadProgressBar } from 'axios-progress-bar';
import { getUserInfoKeys, getUserFactoryUuid, getUserToken } from './storage.function';
import { getObjectKeyDuplicateCheck } from './util.function';
import { message } from 'antd';
import dotenv from 'dotenv';
import { useReducer } from 'react';
import { ILevel1Info, ILevel2Info, ILevel3Info } from '~/components/UI';
import * as Pages from "~/components/pages";


dotenv.config();
// const baseURL = process.env.TEST_URL_WON;
const baseURL = process.env.TEST_URL;
// const baseURL ="http://191.1.70.134:3000/";
// const baseURL = process.env.URL;

/**
 * 서버 데이터 가져오기
 * @param params 서버에 전달할 파라메터
 * @param uriPath 도메인 뒤에 붙는 URL
 * @param returnType 반환 타입
 */
export async function getData<T>(
  params: object,
  uriPath: string,
  returnType: 'data' | 'datas' | 'raws' | 'header-details' | 'value' | 'message' | 'success' | 'report' = 'raws',
): Promise<T> {
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
        authorization:getUserToken(),
      }
    });

  } catch (error) {
    console.log(error);
    datas = null;

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
            authorization:getUserToken(),
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
      component: Pages[level1.component_nm] as () => JSX.Element,
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
        component: Pages[level2.component_nm] as () => JSX.Element,
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
          component: Pages[level3.component_nm] as () => JSX.Element,
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