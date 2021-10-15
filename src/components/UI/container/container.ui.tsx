import React from 'react';
import Props from './container.ui.type';
import {ScContainer} from './container.ui.styled';


/** 컨테이너 (컴포넌트 박스) */
const Container: React.FC<Props> = (props) => {
    return (
        <ScContainer
            {...props}
            className={props?.title ? 'title ' + props.className : props.className}
            />
    );
}


export default Container;