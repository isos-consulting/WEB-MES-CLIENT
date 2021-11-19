// --- [sessionStorage에 있는 유저 정보 가져오는 함수들] --------------------------------------------
import dotenv from 'dotenv';
dotenv.config();

type TgetStorageValueParams = {
  storageName: 'userInfo' | 'tokenInfo',
  keyName: 'uid' | 'id' | 'user_nm' | 'factory_uuid' | 'super_admin_fg'
}

/** 로그인 유저 정보를 session storage에서 가져옵니다. */
export const getStorageValue = (props:TgetStorageValueParams ) => {
  return JSON.parse(sessionStorage.getItem(props.storageName))?.[props.keyName]
}

export const getUserInfo = () => {
  return JSON.parse(sessionStorage.getItem('userInfo'));
}

export const getTokenInfo = () => {
  return JSON.parse(sessionStorage.getItem('tokenInfo'));
}

/** 로그인 유저의 공장 고유아이디를 가져옵니다. */
export const getUserFactoryUuid = () => {
  return getUserInfo()?.factory_uuid;
}


/** 로그인 유저의 공장 아이디를 가져옵니다. */
export const getUserFactoryId = () => {
  return getUserInfo()?.factory_id;
}

/** 로그인 유저의 이름을 가져옵니다. */
export const getUserUserName = () => {
  return getUserInfo()?.user_nm;
}

/** 로그인 유저의 관리자권한을 가져옵니다. */
export const getUserSuperAdminFg = () => {
  return getUserInfo()?.super_admin_fg
}

/** 로그인 유저의 토큰을 가져옵니다. */
export const getUserAccessToken = () => {
  return process.env.ACCESS_TOKEN_PREFIX + ' ' + getTokenInfo()?.access_token;
}

export const getUserRefreshToken = () => {
  return getTokenInfo()?.refresh_token;
}

/** 로그인 유저의 야이디를 가져옵니다. */
export const getUserUid = () => {
  return getUserInfo()?.uid;
}


/** 로그인 유저 정보가 담긴 sessionStorage의 키 값들을 가져옵니다. */
export const getUserInfoKeys = () => {
  let userInfo = Object.keys(getUserInfo() || {});
  return userInfo;
}