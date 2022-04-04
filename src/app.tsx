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
  
  const [teneunt, setTeneunt] = useState('');

  const checkLocalEnviroment = (url: string) => {
    return url === 'localhost' || url === '191.1.70.201';
  }

  const getLocalUrl = () => {
    return 'najs.isos.kr';
  }

  const getTenantCode = (url) => {
    return url.split('.')[0];
  }

  const tenantIsNotEmpty = (tenants: any[]) => {
    return tenants.length > 0;
  }

  const getSerialTenantUuid = (uuid: string) => {
    return JSON.stringify({
      tenantUuid: uuid
    })
  }

  const tenantIsAllocated = (tenant) => {
    return tenant !== '';
  }

  const handleGetTeneuntInfo = async () => {
    const hostName = window.location.hostname;

    console.log(`접속 호스트 : ${hostName}`);
    console.log(`접속 호스트가 로컬 환경인가요? : ${hostName}`);
    console.log(`로컬 webURL 주소 : ${getLocalUrl()}`);

    const webURL = checkLocalEnviroment(hostName)? getLocalUrl(): hostName;
    
    const tenantInfo = await getData({tenant_cd: getTenantCode(webURL)},'/tenant/auth','raws',null, true, 'https://was.isos.kr:3002/')

    console.log(`테넌트 정보가 존재 하나요? : ${tenantIsNotEmpty(tenantInfo)}`);

    if(tenantIsNotEmpty(tenantInfo)) {

      console.log(`직렬화 된 tenantUuid : ${getSerialTenantUuid(tenantInfo[0]?.uuid)}`);

      localStorage.setItem('tenantInfo', getSerialTenantUuid(tenantInfo[0]?.uuid));

      setTeneunt(tenantInfo[0]?.uuid);
    }
  }

  const routeLayout = () => {
    return (tenantIsAllocated(teneunt))? <LayoutRoute /> : <span>테넌트 정보를 받아오는 중...</span>
  }

  /** 로그인을 하면 메뉴와 권한 데이터를 불러옵니다. */
  useLayoutEffect(() => {
    handleGetTeneuntInfo()
  },[])

  return (
    <div>
      {console.log(`tenant 정보를 부여 받았나요?: ${tenantIsAllocated(teneunt)}`)}
      {routeLayout()}
      {contextHolder}
    </div>
  )
};

const LayoutRoute = () => {
  const [loading, setLoading] = useLoadingState(); // 이 녀석 때문에 콘솔에 state의 값이 2번씩 찍힘
  const [isLogin, setIsLogin] = useState(false);
  const [menu, setMenu] = useState({});
  const [rawMenu, setRawMenu] = useState([]);
  
  useLayoutEffect(()=>{
    const setMenus = async () => {
      const menus = await getMenus();
      console.log(`menu api 호출 결과: ${menus}`, menus);
      setMenu(menus.data);
      setRawMenu(menus.rawData);
    };

    if(isLogin) {
      setLoading(true);
      setMenus();
      setLoading(false);
    }
  },[isLogin]);

  // useLayoutEffect(()=>{

  // },[isLogin])

  return (
    <>
      {console.log(`어라 왜 2번 불러와지지? 어라 왜 2번 불러와지지?`)}
      {console.log(`로딩 상태? : ${loading}`)}
      {console.log(`로그인 상태인가요? : ${isLogin}`)}
      {console.log(`메뉴가 있나요? : ${menu}`, menu)}
      {isLogin ? 
        <Spin spinning={loading} style={{zIndex:999999}} tip='Loading...'>
          <Suspense fallback='...loading'>
            <BrowserRouter>
              <Switch>
                <Redirect exact from="/" to='/dashboard' />
                <Layout menu={menu} rawMenu={rawMenu}>
                  <Route
                    key={'dashboard'}
                    path={'/dashboard'}
                    component={Dashboard}
                  />
                  {/* {Object.keys(menu).map ((item, key) => {
                    console.log(`key: ${key}`);
                    console.log(`path: ${menu[item]?.path}`);
                    console.log(`component : ${menu[item]?.component ?? errorPage404}`);
                  })} */}
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