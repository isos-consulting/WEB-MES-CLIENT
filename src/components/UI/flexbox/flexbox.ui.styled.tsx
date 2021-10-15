import styled from "styled-components";
import Props from './flexbox.ui.type';


/** 플렉스 박스 컨테이너 */
export const ScFlexContainer = styled.div<Props>`
  display: flex;
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "100%"};
  flex-flow: ${({ direction = "row" }) => direction};
  align-items: ${({ alignItems = "center" }) => alignItems};
  justify-content: ${({ justifyContent = "center" }) => justifyContent};
  margin: 0 auto;
`;
