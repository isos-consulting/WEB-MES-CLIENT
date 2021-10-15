import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
// import { RecoilRoot } from "recoil";
// import { ThemeProvider } from "styled-components";
import './index.css';
import "antd/dist/antd.css";
import koKr from "antd/lib/locale-provider/ko_KR";
import "dayjs/locale/ko";

// import App from "./app";
import { GlobalStyles } from "./styles/theme.style";
// import { ConfigProvider } from "antd";

const App = lazy(() => import('./app'));
const RecoilRoot = lazy(() => import('recoil').then(module => ({default: module.RecoilRoot})));
const ConfigProvider = lazy(() => import('antd').then(module => ({default: module.ConfigProvider})));

ReactDOM.render(
  <Suspense fallback='...loading'>
  <RecoilRoot>
    <ConfigProvider locale={koKr}>
      <GlobalStyles />
      <App />
    </ConfigProvider>
  </RecoilRoot>
  </Suspense>,
  document.getElementById("root")
);
