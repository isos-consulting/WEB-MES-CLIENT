import React, { lazy, Suspense, useLayoutEffect, useState, useCallback, useMemo } from "react";
import { Spin } from "antd";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { PgLogin } from "./components/pages";
import { Result, Container } from '~components/UI';
import { useLoadingState } from "./hooks";
import { getData, getMenus } from "./functions";
import { layoutStore } from '~/components/UI/layout';
import { Modal } from 'antd';
import { Dashboard } from "./components/pages/dashboard.page";

const Layout = lazy(() => import('./components/UI/layout').then(module=>({default:module.Layout})));


const App = () => {
  const [modal, contextHolder] = Modal.useModal();
  
  const [teneunt, setTeneunt] = useState('')

  const handleGetTeneuntInfo = async () => {
    let result:boolean = false;

    const webURL:string = ['localhost','191.1.70.201'].includes(window.location.hostname) ? 'najs.isos.kr' : window.location.hostname
    // const webURL:string = 'najs.i-so.kr'
    
    const tenantInfo = await getData({tenant_cd: webURL.split('.')[0]},'/tenant/auth','raws',null, true, 'https://was.isos.kr:3002/')
    if(tenantInfo.length > 0) {
      localStorage.setItem(
        'tenantInfo',
        JSON.stringify({
          tenantUuid: tenantInfo[0]?.uuid
        })
      )
      setTeneunt(tenantInfo[0]?.uuid)
      result = true;
    }
    return result
  }

  /** 로그인을 하면 메뉴와 권한 데이터를 불러옵니다. */
  useLayoutEffect(() => {
    handleGetTeneuntInfo()
  },[])

  return (
    <div>
      {teneunt ? <LayoutRoute /> : <span>테넌트 정보를 받아오는 중...</span>}
      {contextHolder}
    </div>
  )
};

const LayoutRoute = () => {
  const [loading, setLoading] = useLoadingState();
  const [isLogin, setIsLogin] = useState(false)
  const [menu, setMenu] = useState([])
  
  useLayoutEffect(()=>{
    setLoading(true);
    getMenus().then((menu) => {
      setMenu(menu.data);
    }).finally(() => setLoading(false));
  },[])

  useLayoutEffect(()=>{

  },[isLogin])

  return (
    <>
      {isLogin ? 
        <Spin spinning={loading} style={{zIndex:999999}} tip='Loading...'>
          <Suspense fallback='...loading'>
            <BrowserRouter>
              <Switch>
                <Redirect exact from="/" to='/dashboard' />
                <Layout>
                  <Route
                    key={'dashboard'}
                    path={'/dashboard'}
                    component={Dashboard}
                  />
                  {Object.keys(menu).map((item, key) => (
                    <Route
                      key={key}
                      path={menu[item]?.path}
                      component={menu[item]?.component ?? errorPage404}
                    />
                    ))
                  }
                </Layout>
              </Switch>
            </BrowserRouter>
          </Suspense>
        </Spin>
        : <PgLogin setIsLogin={setIsLogin} />
      }
    </>
  )
}

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


export default App;