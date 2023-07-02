import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import koKr from './v2/langs/kr.lang';
import 'dayjs/locale/ko';
import { GlobalStyles } from './styles/theme.style';

const App = lazy(() => import('./app'));
const RecoilRoot = lazy(() =>
  import('recoil').then(module => ({ default: module.RecoilRoot })),
);
const ConfigProvider = lazy(() =>
  import('antd').then(module => ({ default: module.ConfigProvider })),
);

ReactDOM.render(
  <Suspense fallback="...loading">
    <RecoilRoot>
      <ConfigProvider locale={koKr}>
        <GlobalStyles />
        <App />
      </ConfigProvider>
    </RecoilRoot>
  </Suspense>,
  document.getElementById('root'),
);
