import axios from 'axios';
import { loadProgressBar } from 'axios-progress-bar';
import { getUserInfoKeys, getUserFactoryUuid, getUserAccessToken } from './storage.function';
import { getObjectKeyDuplicateCheck } from './util.function';
import { message } from 'antd';
import dotenv from 'dotenv';
import { useReducer } from 'react';
import { atSideNavMenuContent, ILevel1Info, ILevel2Info, ILevel3Info, TPermission } from '~/components/UI';
import * as Pages from "~/components/pages";
import { useRecoilValue } from 'recoil';
import {useLayoutEffect, useState} from 'react';
import { JSXElement } from '@babel/types';
import { errorState } from '~/enums/response.enum';
import { getStorageValue, getUserRefreshToken } from '.';

dotenv.config();
const baseURL = process.env.TEST_URL_TEST;

// environment : production, development, test
const getTenantInfo = () => {
  return {
    'restrict-access-to-tenants':getStorageValue({storageName:'tenantInfo',keyName:'tenantUuid'}),
    'service-type':'iso',
    environment:'development',
  }
}

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
  disabledErrorMessage: boolean = false,
  optionBaseURL: string = baseURL,
  options?:{
    title?: string,
    disabledZeroMessage?: boolean,
  }
):Promise<T> {
  loadProgressBar();
  const _baseUrl = optionBaseURL ? optionBaseURL : baseURL
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
      baseURL:_baseUrl,
      url: uriPath,
      params: {...params, factory_uuid:getUserFactoryUuid()},
      headers: {
        authorization:getUserAccessToken(),
        ...getTenantInfo(),
        ...headersObj
        //refresh:getUserRefreshToken(),
      },
    })
  } catch (error) {
    if (error?.response?.data?.state?.state_no === errorState.EXPIRED_ACCESS_TOKEN) {
      
      const refreshState = await getAccessToken();
      
      if(!refreshState || refreshState?.state_no === errorState.EXPIRED_REFRESH_TOKEN){
        return ;
      }
      
      await getData(params, uriPath, 'original', headersObj).then((res)=>{
        datas = res;
      });
      
    } else {
      datas = null;

      if (!disabledErrorMessage) {
        message.error(error.response.data.message);
      }
    }
  } finally {
    if (datas?.data?.datas?.value?.count === 0 && options?.disabledZeroMessage !== true) {
      message.warning(`${options?.title ? options?.title + ' - ' : '' }조회 할 데이터가 없습니다.`)
    }
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
  returnType: 'data' | 'datas' | 'raws' | 'value' | 'message' | 'success' | 'original' = 'data',
  disableErrorMessage: boolean = false,
  optionBaseURL:string = baseURL
) => {
  loadProgressBar();

  let datas : any;
  try {
    datas = await axios({
      method: mothodType,
      baseURL: optionBaseURL,
      url: uriPath,
      data: data,
      headers:{
        'file-included': true,
        authorization:getUserAccessToken(),
        ...getTenantInfo(),
      }
    });
  } catch (error) {
    console.log(error.response)
    if (error?.response?.data?.state?.state_no === errorState.EXPIRED_ACCESS_TOKEN) {
      const refreshState = await getAccessToken();
      if(!refreshState || refreshState?.state_no === errorState.EXPIRED_REFRESH_TOKEN){
        return ;
      }

      await executeData(data, uriPath, mothodType, 'original', disableErrorMessage).then((res)=>{
        datas = res;
      });
      
    } else {
      if (!disableErrorMessage) message.error(error.response.data.message);
      console.log(error);
      datas = null;
    }
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
    case 'original':
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
    
    if (getStorageValue({storageName:'userInfo', keyName:'super_admin_fg'})) {
    
      rawData.unshift({
        component_nm: null,
        create_fg: null,
        delete_fg: null,
        first_menu_uuid: null,
        icon: 'ico_nav_standard',
        lv: 1,
        menu_nm: '관리자 정보',
        menu_type: 'menu',
        menu_uri: 'adm',
        menu_uuid: 'adm',
        read_fg: null,
        sub_menu: [
          {
            component_nm: 'PgAutMenu',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '메뉴 관리',
            menu_type: 'page',
            menu_uri: '/adm/menus',
            menu_uuid: 'admMenus',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmBomType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: 'BOM 구성유형',
            menu_type: 'page',
            menu_uri: '/adm/bom-type',
            menu_uuid: 'admBomType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmBomInputType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: 'BOM 투입유형',
            menu_type: 'page',
            menu_uri: '/adm/bom-input-type',
            menu_uuid: 'admBomInputType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmInspType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '검사유형',
            menu_type: 'page',
            menu_uri: '/adm/insp-type',
            menu_uuid: 'admInspType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmInspDetailType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '세부검사유형',
            menu_type: 'page',
            menu_uri: '/adm/insp-detail-type',
            menu_uuid: 'admInspDetailType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmTranType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '수불유형',
            menu_type: 'page',
            menu_uri: '/adm/tran-type',
            menu_uuid: 'admTranType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmDemandType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '요청유형',
            menu_type: 'page',
            menu_uri: '/adm/demand-type',
            menu_uuid: 'admDemandType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmDailyInspCycle',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '일상점검주기 관리',
            menu_type: 'page',
            menu_uri: '/adm/daily-insp-cycle',
            menu_uuid: 'admCycleUnit',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmPatternOpt',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '번호자동발행 옵션',
            menu_type: 'page',
            menu_uri: '/adm/pattern-opt',
            menu_uuid: 'admPatternOpt',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmReworkType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '재작업유형',
            menu_type: 'page',
            menu_uri: '/adm/rework-type',
            menu_uuid: 'admReworkType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmCycleUnit',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '주기단위 관리',
            menu_type: 'page',
            menu_uri: '/adm/cycle-unit',
            menu_uuid: 'admCycleUnit',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmStoreType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '창고유형',
            menu_type: 'page',
            menu_uri: '/adm/store-type',
            menu_uuid: 'admStoreType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmFileMgmtType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '파일관리유형',
            menu_type: 'page',
            menu_uri: '/adm/file-mgmt-type',
            menu_uuid: 'admFileMgmtType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmFileMgmtDetailType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '파일관리상세유형',
            menu_type: 'page',
            menu_uri: '/adm/file-mgmt-detail-type',
            menu_uuid: 'admFileMgmtDetailType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmCompanyOpt',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '회사옵션',
            menu_type: 'page',
            menu_uri: '/adm/company-opt',
            menu_uuid: 'admCompanyOpt',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmInspHandlingType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '검사처리유형',
            menu_type: 'page',
            menu_uri: '/adm/insp-handling-type',
            menu_uuid: 'admInspHandlingType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          {
            component_nm: 'PgAdmPrdPlanType',
            create_fg: true,
            delete_fg: true,
            first_menu_uuid: 'adm',
            icon: null,
            lv: 2,
            menu_nm: '생산계획유형',
            menu_type: 'page',
            menu_uri: '/adm/prd-plan-type',
            menu_uuid: 'admPrdPlanType',
            read_fg: true,
            sub_menu: [],
            update_fg: true
          },
          
          
        ],
        update_fg: null
      })
    };
    
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
  if (getStorageValue({storageName:'userInfo', keyName:'super_admin_fg'})) {
    return {create_fg: true, delete_fg: true, read_fg: true, update_fg: true};
  }
  useLayoutEffect(() => {
    if (!menuContent) return;
    const permissions = menuContent[pageName]?.permissions;

    if (!permissions) return;
    setPermissions(permissions);
  }, [menuContent]);

  return permissions;
}

export const getAccessToken = async ():Promise<{state_no:string, state_tag:string, type:string}> => {
  let refreshData:any = null;
  let refreshState:any = null;
  try {
    refreshData = await axios({
      method: 'get',
      baseURL:baseURL,
      url: '/refresh-token',
      params: {factory_uuid:getUserFactoryUuid()},
      headers: {
        authorization:getUserAccessToken(),
        refresh:getUserRefreshToken(),
        ...getTenantInfo(),
      },
    })
    
    localStorage.setItem(
      'tokenInfo',
      JSON.stringify({
        access_token: refreshData.data.datas.raws[0].access_token,
        refresh_token: refreshData.data.datas.raws[0].refresh_token,
      })
    )

    refreshState = refreshData.data.state
  } catch (error) {
    console.log(error)
    // if (error?.response?.data?.state?.state_no === errorState.EXPIRED_REFRESH_TOKEN) {
      localStorage.setItem('state',JSON.stringify({
        EXPIRED_REFRESH_TOKEN: true,
      }));
      await setLogout();
      
    // }
    refreshState = error.response.data.state
  }
  console.log(...refreshState)
  return {...refreshState}
}

/**
 * 로그아웃 함수 ..
 * 로그인 된 정보를 해당 함수에서 삭제해줘야 함.
 */
export const setLogout = async () => {
  
  localStorage.removeItem('userInfo');
  
  window.location.href = "/";
}