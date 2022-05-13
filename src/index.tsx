import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import koKr from 'antd/lib/locale-provider/ko_KR';
import 'dayjs/locale/ko';
import { GlobalStyles } from './styles/theme.style';

const App = lazy(() => import('./app'));
const RecoilRoot = lazy(() =>
  import('recoil').then(module => ({ default: module.RecoilRoot })),
);
const ConfigProvider = lazy(() =>
  import('antd').then(module => ({ default: module.ConfigProvider })),
);

koKr.DatePicker.lang.shortWeekDays = ['일', '월', '화', '수', '목', '금', '토'];
koKr.DatePicker.lang.shortMonths = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

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
