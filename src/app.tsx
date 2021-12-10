import React, { lazy, Suspense, useLayoutEffect, useState, useCallback, useMemo } from "react";
import { Spin } from "antd";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { PgAuthentication, PgLogin } from "./components/pages";
import { atSideNavMenuContent, atSideNavMenuRawData } from "./components/UI/side-navbar";
import { Result, Container } from '~components/UI';
import { useLoadingState, authStore } from "./hooks";
import { getMenus, setLogout } from "./functions";
import { layoutStore } from '~/components/UI/layout';
import { Modal } from 'antd';
import { Dashboard } from "./components/pages/dashboard.page";
import { PgAutMenu } from '~components/pages';

const Layout = lazy(() => import('./components/UI/layout').then(module=>({default:module.Layout})));


const App = () => {
  const [loading, setLoading] = useLoadingState();
  const [modal, contextHolder] = Modal.useModal();
  
  const [user] = useRecoilState(authStore.user.state);
  const [menuContent, setMenuContent] = useRecoilState(atSideNavMenuContent);
  const [menuRawData, setMenuRawData] = useRecoilState(atSideNavMenuRawData);
  const [NOT_PERMISSION, SET_NOT_PERMISSION] = useState<boolean>(false);


  /** 로그인을 하면 메뉴와 권한 데이터를 불러옵니다. */
  useLayoutEffect(() => {
    if (!user) return;
    setLoading(true);
    getMenus().then((menu) => {
      setMenuContent(menu.data);
      setMenuRawData(menu.rawData);
    }).finally(() => setLoading(false));
  }, [user]);

  useLayoutEffect(() => {
    if (Array.isArray(menuRawData) && menuRawData?.length === 0) {
      SET_NOT_PERMISSION(true);
    } else {
      SET_NOT_PERMISSION(false);
    }
  }, [menuRawData]);

  useLayoutEffect(() => {
    if (!NOT_PERMISSION) return;
    modal.error({
      content: <div>
        권한 정보가 없습니다. <p/>
        관리자에게 문의하신 후 다시 로그인해주세요. <br/>
      </div>,
      okText: '로그인 페이지로 돌아가기',
      onOk: () => {
        // 로그인 해제
        setLogout();
        SET_NOT_PERMISSION(false);
      },
      cancelButtonProps: {
        hidden: true,
      }
    });
  }, [NOT_PERMISSION]);

  return <div>
    <Spin spinning={loading} style={{zIndex:999999}} tip='Loading...'>
      {/* {sessionStorage.getItem('userInfo') ? <LoggedIn menuContent={menuContent} /> : <LoggedOut />} */}
      <LoggedIn menuContent={menuContent} />
      {contextHolder}
    </Spin>
  </div>;
};

const errorPage404 = () => {
  const layoutState = useRecoilValue(layoutStore.state);
  const [height, setHeight] = useState<number>(0);

  const onResize = (ev) => {
    const screenHeight = ev.target.innerHeight;
    const height = screenHeight - (layoutState.bottomSpacing);
    setHeight(height);
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', onResize, true);
    onResize({target:{innerHeight:window.innerHeight}});

    return () => {
      window.removeEventListener('resize', onResize, true);
    };
  }, []);

  return (
    <Container height={height}>
      <Result status='404' type='custom' title='404' subTitle='준비중 입니다.'/>
    </Container>
  )
}



/** 인증완료시의 렌더링될 컴포넌트 */
const LoggedIn = (props: any) => {
  const menueData = useMemo(() => {
    if (props?.menuContent.length > 0) {
      return (
        Object.keys(props.menuContent).map((item, key) => (
          <Route
            key={key}
            path={props.menuContent[item]?.path}
            component={props.menuContent[item]?.component ?? errorPage404}
          />
        )) 
      )
    } else {
      return null
    }
    
  } 
  ,[props?.menuContent])
  
  // if (Object.keys(props?.menuContent).length <= 0) return null;
  return (
    <Suspense fallback='...loading'>
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to='/login' />
        <Route
          key={'authentication'}
          path={'/authentication'}
          component={PgAuthentication}
        />
        <Route
          key={'login'}
          path={'/login'}
          component={PgLogin}
        />
        <Layout>
          <Route
            key={'dashboard'}
            path={'/dashboard'}
            component={Dashboard}
          />
          <Route
            key={'autMenu'}
            path={'/aut/menus'}
            component={PgAutMenu}
          />
          {menueData}
        </Layout>
      </Switch>
    </BrowserRouter>
    </Suspense>
  );
};


export default App;