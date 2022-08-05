import React, { lazy, Suspense, useLayoutEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
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
import { getData, getMenus } from './functions';
import { layoutStore } from '~/components/UI/layout';
import { Dashboard } from './components/pages/dashboard.page';
import { URL_PATH_AUT } from './enums';
import { KeyStore } from './constants/keys';
import { CloudTenant } from './enums/types';
import UserProfile, { Profile } from './models/user/profile';
import { CurrentUser } from './models/user/user';
import PgUpdatePassword from './components/pages/aut/update-password.page';

const Layout = lazy(() =>
  import('./components/UI/layout').then(module => ({ default: module.Layout })),
);

const App = () => {
  const [, contextHolder] = Modal.useModal();
  const [teneunt, setTeneunt] = useState('');

  const checkLocalEnviroment = (url: string) => {
    return url === 'localhost' || url.includes('191.1.70');
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
    const hostName = window.location.hostname;
    const webURL =
      checkLocalEnviroment(hostName) === true
        ? process.env.NAJS_LOCAL_WEB_URL
        : hostName;

    const tenants: Array<CloudTenant> = await getData(
      { tenant_cd: getTenantCode(webURL) },
      URL_PATH_AUT.TENANT.GET.TENANT,
      'raws',
      null,
      true,
      process.env.TENANT_SERVER_URL,
    );

    if (tenantIsNotEmpty(tenants) === true) {
      const { uuid } = tenants[0];
      localStorage.setItem(KeyStore.tenantInfo, getSerialTenantUuid(uuid));

      setTeneunt(uuid);
    }
  };
  const routeLayout = () => {
    return tenantIsAllocated(teneunt) === true ? (
      <LayoutRoute />
    ) : (
      <span>테넌트 정보를 받아오는 중...</span>
    );
  };

  useLayoutEffect(() => {
    handleGetTeneuntInfo();
  }, []);

  return (
    <div>
      {routeLayout()}
      {contextHolder}
    </div>
  );
};

const LayoutRoute = () => {
  const [profile, setProfile] = useState<Profile>(
    new UserProfile({
      ...new CurrentUser({ id: '', password: '' }),
      isAuthenticated: false,
      isResetPassword: false,
    }),
  );
  const [loading, setLoading] = useLoadingState();
  const [menuContent, setMenuContent] = useRecoilState(atSideNavMenuContent);
  const [, setMenuRawData] = useRecoilState(atSideNavMenuRawData);

  useLayoutEffect(() => {
    if (profile.isAuthenticated === true) {
      setLoading(true);
      getMenus().then(menus => {
        setMenuContent(menus.data);
        setMenuRawData(menus.rawData);
        setLoading(false);
      });
    }
  }, [profile]);

  return (
    <>
      {profile.isAuthenticated === true ? (
        profile.isResetPassword === true ? (
          <PgUpdatePassword
            profile={profile}
            authenticatedCallback={setProfile}
          />
        ) : (
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
                    {Object.keys(menuContent).map((item, key) => (
                      <Route
                        key={key}
                        path={menuContent[item]?.path}
                        component={menuContent[item]?.component ?? errorPage404}
                      />
                    ))}
                  </Layout>
                </Switch>
              </BrowserRouter>
            </Suspense>
          </Spin>
        )
      ) : (
        <PgLogin profile={profile} authenticatedCallback={setProfile} />
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
