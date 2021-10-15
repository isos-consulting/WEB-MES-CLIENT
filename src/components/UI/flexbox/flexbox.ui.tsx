import React from "react";
import Props from './flexbox.ui.type';
import {ScFlexContainer} from './flexbox.ui.styled';


/** 플렉스 박스 (자동 맞춤 박스) */
const Flexbox: React.FC<Props> = (props) => (
  <ScFlexContainer
    onClick={props.onClick}
    width={props.width}
    height={props.height}
    className={props.className}
    alignItems={props.alignItems}
    justifyContent={props.justifyContent}
    direction={props.direction}
    style={props.currentStyles}
  >
    {props.children}
  </ScFlexContainer>
);


export default Flexbox;