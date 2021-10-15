import React from 'react';
import {ScSingleGridDiv, ScDoubleGridDiv} from './div.ui.styled';
import Props from './div.ui.type';


/** 커스텀 Div */
const Div:React.FC<Props> = (props) => {
  if (props.divType === 'singleGridButtonsDiv') {
    return <ScSingleGridDiv {...props} />

  } else if (props.divType === 'doubleGridButtonsDiv') {
    return <ScDoubleGridDiv {...props} />

  } else {
    return <div id={props.id} children={props.children}/>
  }
}


export default Div;