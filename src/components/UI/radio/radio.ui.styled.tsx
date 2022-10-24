import Colors from '~styles/color.style.module.scss';
import styled from 'styled-components';
import { Radio } from 'antd';

/* Radio 스타일 */
export const ScRadio = styled(Radio)`
  .ant-radio-input:focus + .ant-radio-inner,
  .ant-radio:hover .ant-radio-inner {
    border-color: ${Colors.bg_radio_inner};
  }
  //radio 체크했을 때 안쪽 스타일 (테두리, 안쪽 색상)
  .ant-radio-checked .ant-radio-inner {
    border-color: ${Colors.bg_radio_checkedBorder};
    .ant-radio-inner::after {
      background-color: ${Colors.bg_radio_checkedInner};
    }
  }
  //radio 체크한 후 내부 스타일 적용
  .ant-radio-inner::after {
    background-color: ${Colors.bg_radio_inner};
  }
`;
