import React, {
  lazy,
  Suspense,
  useLayoutEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Spin } from 'antd';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PgLogin } from './components/pages';
import {
  Result,
  Container,
  atSideNavMenuContent,
  atSideNavMenuRawData,
} from '~components/UI';
import { useLoadingState } from './hooks';
import { consoleLogLocalEnv, getData, getMenus } from './functions';
import { layoutStore } from '~/components/UI/layout';
import { Modal } from 'antd';
import { Dashboard } from './components/pages/dashboard.page';

const Layout = lazy(() =>
  import('./components/UI/layout').then(module => ({ default: module.Layout })),
);

const App = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [teneunt, setTeneunt] = useState('');

  const checkLocalEnviroment = (url: string) => {
    return url === 'localhost' || url.includes('191.1.70');
  };

  const getLocalUrl = () => {
    return 'najs.isos.kr';
  };

  const getTenantCode = url => {
    return url.split('.')[0];
  };

  const tenantIsNotEmpty = (tenants: any[]) => {
    return tenants.length > 0;
  };

  const getSerialTenantUuid = (uuid: string) => {
    return JSON.stringify({
      tenantUuid: uuid,
    });
  };

  const tenantIsAllocated = tenant => {
    return tenant !== '';
  };

  const handleGetTeneuntInfo = async () => {
    {
      consoleLogLocalEnv(
        '%cTenant 정보 부여 테스트 시작',
        'color: green; font-size: 20px;',
      );
    }
    const hostName = window.location.hostname;

    consoleLogLocalEnv(`접속 호스트 : ${hostName}`);
    consoleLogLocalEnv(`로컬 호스트 일 경우 webURL 주소 : ${getLocalUrl()}`);

    const webURL = checkLocalEnviroment(hostName) ? getLocalUrl() : hostName;

    const tenantInfo = await getData(
      { tenant_cd: getTenantCode(webURL) },
      '/tenant/auth',
      'raws',
      null,
      true,
      'https://was.isos.kr:3002/',
    );

    consoleLogLocalEnv(
      `테넌트 정보가 존재 하나요? : ${tenantIsNotEmpty(tenantInfo)}`,
    );

    if (tenantIsNotEmpty(tenantInfo)) {
      consoleLogLocalEnv(
        `직렬화 된 tenantUuid : ${getSerialTenantUuid(tenantInfo[0]?.uuid)}`,
      );

      localStorage.setItem(
        'tenantInfo',
        getSerialTenantUuid(tenantInfo[0]?.uuid),
      );

      {
        consoleLogLocalEnv(
          '%cTenant 정보 부여 테스트 끝',
          'color: green; font-size: 20px;',
        );
      }
      setTeneunt(tenantInfo[0]?.uuid);
    }
  };
  const routeLayout = () => {
    return tenantIsAllocated(teneunt) ? (
      <LayoutRoute />
    ) : (
      <span>테넌트 정보를 받아오는 중...</span>
    );
  };

  /** 로그인을 하면 메뉴와 권한 데이터를 불러옵니다. */
  useLayoutEffect(() => {
    handleGetTeneuntInfo();
  }, []);

  return (
    <div>
      {consoleLogLocalEnv(
        `tenant 정보를 부여 받았나요?: ${tenantIsAllocated(teneunt)}`,
      )}
      {routeLayout()}
      {contextHolder}
    </div>
  );
};

const LayoutRoute = () => {
  const [loading, setLoading] = useLoadingState(); // 이 녀석 때문에 콘솔에 state의 값이 2번씩 찍힘
  const [isLogin, setIsLogin] = useState(false);
  const [menuContent, setMenuContent] = useRecoilState(atSideNavMenuContent);
  const [, setMenuRawData] = useRecoilState(atSideNavMenuRawData);

  useLayoutEffect(() => {
    const setMenus = async () => {
      const menus = await getMenus();

      consoleLogLocalEnv('menu api 호출 결과:', menus);
      setMenuContent(menus.data);
      setMenuRawData(menus.rawData);
    };

    consoleLogLocalEnv(
      '%cLayoutRoute 컴포넌트 useLayoutEffect 훅 동작',
      'color: orange; font-size: 24px;',
    );
    consoleLogLocalEnv(
      `로딩 상태: ${loading}, 로그인 상태: ${isLogin}, 메뉴 정보: `,
      menuContent,
    );
    if (isLogin) {
      setLoading(true);
      setMenus();
      setLoading(false);
    }
  }, [isLogin]);

  // useLayoutEffect(()=>{

  // },[isLogin])

  return (
    <>
      {consoleLogLocalEnv(
        '%cLayoutRoute 컴포넌트 테스트 시작',
        'color: green; font-size: 20px;',
      )}
      {consoleLogLocalEnv(`로딩 상태? : ${loading}`)}
      {consoleLogLocalEnv(`로그인 상태인가요? : ${isLogin}`)}
      {consoleLogLocalEnv(`메뉴가 있나요? : `, menuContent)}
      {consoleLogLocalEnv(
        '%cLayoutRoute 컴포넌트 테스트 끝',
        'color: green; font-size: 20px;',
      )}
      {isLogin ? (
        <Spin spinning={loading} style={{ zIndex: 999999 }} tip="Loading...">
          <Suspense fallback="...loading">
            <BrowserRouter>
              <Switch>
                <Redirect exact from="/" to="/dashboard" />
                <Layout>
                  <Route
                    key={'dashboard'}
                    path={'/dashboard'}
                    component={Dashboard}
                  />
                  {Object.keys(menuContent).map((item, key) => {
                    if (!menuContent[item]?.component) {
                      console.log(menuContent[item]);
                    }

                    return (
                      <Route
                        key={key}
                        path={menuContent[item]?.path}
                        component={menuContent[item]?.component ?? errorPage404}
                      />
                    );
                  })}
                </Layout>
              </Switch>
            </BrowserRouter>
          </Suspense>
        </Spin>
      ) : (
        <PgLogin setIsLogin={setIsLogin} />
      )}
    </>
  );
};

const errorPage404 = () => {
  const layoutState = useRecoilValue(layoutStore.state);
  const [height, setHeight] = useState<number>(0);

  const onResize = ev => {
    const screenHeight = ev.target.innerHeight;
    const height = screenHeight - layoutState.bottomSpacing;
    setHeight(height);
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', onResize, true);
    onResize({ target: { innerHeight: window.innerHeight } });

    return () => {
      window.removeEventListener('resize', onResize, true);
    };
  }, []);

  return (
    <Container height={height}>
      <Result
        status="404"
        type="custom"
        title="404"
        subTitle="준비중 입니다."
      />
    </Container>
  );
};

export default App;
