import { Input } from 'formik-antd';
import styled from 'styled-components';
import Fonts from '~styles/font.style.module.scss';
import Sizes from '~styles/size.style.module.scss';

export const TextBox = styled(Input)`
  width: 221px;
  height: ${Sizes.height_datePicker_default};
  font-size: ${Fonts.fontSize_datePicker};
`;
