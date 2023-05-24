// --- [sessionStorage에 있는 유저 정보 가져오는 함수들] --------------------------------------------

type TGetStorageValueParams = {
  storageName: 'userInfo' | 'tokenInfo' | 'tenantInfo';
  keyName:
    | 'uid'
    | 'id'
    | 'user_nm'
    | 'factory_uuid'
    | 'super_admin_fg'
    | 'tenantUuid';
};

/** 로그인 유저 정보를 session storage에서 가져옵니다. */
export const getStorageValue = (props: TGetStorageValueParams) => {
  return JSON.parse(localStorage.getItem(props.storageName))?.[props.keyName];
};

export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem('userInfo'));
};

export const getTokenInfo = () => {
  return JSON.parse(localStorage.getItem('tokenInfo'));
};

/** 로그인 유저의 공장 고유아이디를 가져옵니다. */
export const getUserFactoryUuid = () => {
  return getUserInfo()?.factory_uuid;
};

/** 로그인 유저의 공장 아이디를 가져옵니다. */
export const getUserFactoryId = () => {
  return getUserInfo()?.factory_id;
};

/** 로그인 유저의 이름을 가져옵니다. */
export const getUserUserName = () => {
  return getUserInfo()?.user_nm;
};

/** 로그인 유저의 관리자권한을 가져옵니다. */
export const getUserSuperAdminFg = () => {
  return getUserInfo()?.super_admin_fg;
};

/** 로그인 유저의 토큰을 가져옵니다. */
export const getUserAccessToken = () => {
  return `${import.meta.env.VITE_ACCESS_TOKEN_PREFIX} ${
    getTokenInfo()?.access_token
  }`;
};

export const getUserRefreshToken = () => {
  return getTokenInfo()?.refresh_token;
};

/** 로그인 유저의 야이디를 가져옵니다. */
export const getUserUid = () => {
  return getUserInfo()?.uid;
};

/** 로그인 유저 정보가 담긴 sessionStorage의 키 값들을 가져옵니다. */
export const getUserInfoKeys = () => {
  return Object.keys(getUserInfo() || {});
};
