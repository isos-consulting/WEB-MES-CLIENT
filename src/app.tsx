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
import { executeData, getData, getMenus } from './functions';
import { layoutStore } from '~/components/UI/layout';
import { Dashboard } from './components/pages/dashboard.page';
import { URL_PATH_AUT } from './enums';
import { KeyStore } from './constants/keys';
import { CloudTenant } from './enums/types';
import UserProfile, { Profile } from './models/user/profile';
import { CurrentUser } from './models/user/user';
import PgUpdatePassword from './components/pages/aut/update-password.page';
import { isEmpty, isNil } from './helper/common';

const Layout = lazy(() =>
  import('./components/UI/layout').then(module => ({ default: module.Layout })),
);

const App = () => {
  const [, contextHolder] = Modal.useModal();
  const [teneunt, setTeneunt] = useState('');

  const checkLocalEnviroment = (url: string) => {
    return url === 'localhost' || url.includes('191.1.70');
  };

  const getTenantCode = (url: string) => {
    return url.split('.')[0];
  };

  const tenantIsNotEmpty = (tenants: any[]) => {
    return Array.from(tenants).length > 0;
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
        ? import.meta.env.VITE_NAJS_LOCAL_WEB_URL
        : hostName;

    const tenants: Array<CloudTenant> = await getData(
      { tenant_cd: getTenantCode(webURL) },
      URL_PATH_AUT.TENANT.GET.TENANT,
      'raws',
      null,
      true,
      import.meta.env.VITE_TENANT_SERVER_URL,
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

  const handleAppComponentClick = e => {
    const useLogPayload = {
      log_caption: location.pathname,
      log_info: `${location.pathname}-`,
      log_tag: `${location.pathname}-`,
      log_action: '',
    };
    if (e.target.matches('button')) {
      useLogPayload.log_info = useLogPayload.log_info.concat(
        e.target.innerText,
      );
      useLogPayload.log_tag = useLogPayload.log_tag.concat(e.target.innerText);
      useLogPayload.log_action = e.target.innerText;
    } else {
      const buttonComponent =
        e.target[
          Object.keys(e.target).filter(key => key.includes('__reactFiber'))[0]
        ]?.stateNode.closest('button');

      if (!isNil(buttonComponent)) {
        if (typeof buttonComponent.innerText === 'object') {
          const buttonInnerText = buttonComponent.innerText.join('');
          useLogPayload.log_info =
            useLogPayload.log_info.concat(buttonInnerText);
          useLogPayload.log_tag = useLogPayload.log_tag.concat(buttonInnerText);
          useLogPayload.log_action = buttonInnerText;
        } else {
          const buttonInnerText = buttonComponent.innerText;
          useLogPayload.log_info =
            useLogPayload.log_info.concat(buttonInnerText);
          useLogPayload.log_tag = useLogPayload.log_tag.concat(buttonInnerText);
          useLogPayload.log_action = buttonInnerText;
        }
      } else {
        return;
      }
    }

    if (isEmpty(useLogPayload.log_action)) return;
    if (useLogPayload.log_action === '로그인') return;

    executeData([useLogPayload], '/adm/use-log', 'post', 'data', true);
  };

  return (
    <div onClick={handleAppComponentClick}>
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

  if (profile.isAuthenticated === false) {
    return <PgLogin profile={profile} authenticatedCallback={setProfile} />;
  }

  return (
    <>
      {profile.isResetPassword === true ? (
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
      )}
    </>
  );
};

const errorPage404 = () => {
  const layoutState = useRecoilValue(layoutStore.state);
  const [height, setHeight] = useState<number>(0);

  const onResize = ev => {
    const screenHeight = ev.target.innerHeight;
    const resizedHeight = screenHeight - layoutState.bottomSpacing;
    setHeight(resizedHeight);
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
