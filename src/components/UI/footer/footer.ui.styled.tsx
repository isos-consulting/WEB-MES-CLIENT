import styled from 'styled-components';
import Props from './footer.ui.type';
import Fonts from '~styles/font.style.module.scss';
import Colors from '~styles/color.style.module.scss';

export const ScContainer = styled.div<Props>`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: flex-start;
  position: absolute;
  z-index: 1;
  left: ${({ left }) => left}px;
  height: 60px;
  left: 0;
  right: 0;
  margin-right: -25px;
  background-color: ${Colors.bg_footer_default};
  color: ${Colors.fg_footer_copyRight};
`;

export const ScText = styled.span`
  font-size: ${Fonts.fontSize_footer};
  margin: 5px 40px 25px auto;
`;
