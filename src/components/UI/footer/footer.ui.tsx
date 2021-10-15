import React, { lazy, Suspense } from "react";
import { img_footer_logo } from '~images/index';
import Props from './footer.ui.type';


const ScContainer = lazy(() => import('./footer.ui.styled').then(module=>({default:module.ScContainer})));
const ScText = lazy(() => import('./footer.ui.styled').then(module=>({default:module.ScText})));


/** 푸터(하단바) */
const Footer: React.FC<Props> = (props) => {
  return (
    <div>
      <Suspense fallback='...loading'>
        <ScContainer {...props}>
          <img src={img_footer_logo} style={{marginLeft: "auto", marginRight: "40px", marginTop: "30px"}} />
          <ScText>Copyright 2020. 000. All Right Reserved.</ScText>
        </ScContainer>
      </Suspense>
    </div>
  );
};


export default Footer;