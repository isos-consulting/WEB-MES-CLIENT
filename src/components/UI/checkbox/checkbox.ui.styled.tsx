import Colors from '~styles/color.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import styled from 'styled-components';
import { Checkbox } from 'antd';

/* 체크박스 스타일 */
export const ScCheckbox = styled(Checkbox)`
  min-width: ${Sizes.width_checkbox_default};

  //클릭, 마우스오버 했을 때 적용
  &:active,
  &:hover {
    border-color: ${Colors.bg_checkBox_border};
  }
`;
