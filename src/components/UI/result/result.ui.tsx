import React from 'react';
import { Result as AntdResult } from 'antd';
import Props from './result.ui.type';

/** 결과 디스플레이 컴포넌트 */
const Result: React.FC<Props> = props => {
  const AntResult = () => AntdResult;
  let returnElement = <></>;

  switch (props.type) {
    case 'custom':
      returnElement = (
        <>
          <AntResult
            status={props.status}
            title={props.title}
            subTitle={props.subTitle}
          />
        </>
      );
      break;

    case 'loadFailed':
      returnElement = (
        <>
          <AntResult
            status="500"
            title="Load Failed"
            subTitle="불러오기에 실패했습니다. 관리자에게 문의 바랍니다."
          />
        </>
      );
      break;

    default:
      break;
  }

  return returnElement;
};

export default Result;
