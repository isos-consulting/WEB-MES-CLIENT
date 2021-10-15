import React, { lazy, Suspense, useLayoutEffect, useState } from "react";
import { Spin } from "antd";
import { useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { PgLogin } from "./components/pages";
import { atSideNavMenuContent, atSideNavMenuRawData } from "./components/UI/side-navbar";
import { Result, Container } from '~components/UI';
import { useLoadingState, authStore } from "./hooks";
import { getMenus } from "./functions";
import { layoutStore } from '~/components/UI/layout';



const Layout = lazy(() => import('./components/UI/layout').then(module=>({default:module.Layout})));



const App = () => {
  const [loading, setLoading] = useLoadingState();
  
  const [user] = useRecoilState(authStore.user.state);
  const [menuContent, setMenuContent] = useRecoilState(atSideNavMenuContent);
  const [menuRawData, setMenuRawData] = useRecoilState(atSideNavMenuRawData);


  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getMenus().then((menu) => {
      setMenuContent(menu.data);
      setMenuRawData(menu.rawData);
    }).finally(() => setLoading(false));
  }, [user]);

  return <div>
    <Spin spinning={loading} style={{zIndex:999999}} tip='Loading...'>
      {user ? <LoggedIn menuContent={menuContent} /> : <LoggedOut />}
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
  if (Object.keys(props?.menuContent).length <= 0) return null;

  return (
    <Suspense fallback='...loading'>
    <BrowserRouter>
      <Layout>
        <Switch>
          <Redirect exact from="/" to='/dashboard' />
          {Object.keys(props.menuContent).map((item, key) => (
            <Route
              key={key}
              path={props.menuContent[item]?.path}
              component={props.menuContent[item]?.component ?? errorPage404}
            />
          ))}
        </Switch>
      </Layout>
    </BrowserRouter>
    </Suspense>
  );
};


/**
 *  인증전의 렌더링될 컴포넌트.
 */
const LoggedOut = () => {
  return (
    <>
      <PgLogin /> 
    </>
  );
};

export default App;