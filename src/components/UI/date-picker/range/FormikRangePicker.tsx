import { DatePicker } from 'formik-antd';
import styled from 'styled-components';
import Colors from '~styles/color.style.module.scss';
import Sizes from '~styles/size.style.module.scss';

export const RangePicker = styled(DatePicker.RangePicker)`
  width: 230px;
  height: ${Sizes.height_datepicker_default};
  border-radius: ${Sizes.borderRadius_common};
  border-color: ${Colors.bg_datepicker_border};
`;
