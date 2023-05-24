import { Modal, Spin } from 'antd';
import React, { lazy, Suspense, useLayoutEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { layoutStore } from '~/components/UI/layout';
import {
  atSideNavMenuContent,
  atSideNavMenuRawData,
  Container,
  Result,
} from '~components/UI';
import { TenantRemoteStore } from './apis/aut/tenant';
import { PgLogin } from './components/pages';
import PgUpdatePassword from './components/pages/aut/update-password.page';
import { Dashboard } from './components/pages/dashboard.page';
import { KeyStore } from './constants/keys';
import { executeData, getMenus } from './functions';
import { isEmpty, isNil } from './helper/common';
import { useLoadingState } from './hooks';
import UserProfile, { Profile } from './models/user/profile';
import { CurrentUser } from './models/user/user';

const Layout = lazy(() =>
  import('./components/UI/layout').then(module => ({ default: module.Layout })),
);

const App = () => {
  const [, contextHolder] = Modal.useModal();
  const [tenant, setTenant] = useState('');

  const getSerialTenantUuid = (uuid: string) => {
    return JSON.stringify({
      tenantUuid: uuid,
    });
  };

  const handleGetTenantInfo = async () => {
    const tenants = await TenantRemoteStore.get();

    if (!isEmpty(tenants)) {
      const { uuid } = tenants[0];
      localStorage.setItem(KeyStore.tenantInfo, getSerialTenantUuid(uuid));

      setTenant(uuid);
    }
  };

  const routeLayout = () => {
    return !isEmpty(tenant) === true ? (
      <LayoutRoute />
    ) : (
      <span>테넌트 정보를 받아오는 중...</span>
    );
  };

  useLayoutEffect(() => {
    handleGetTenantInfo();
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
