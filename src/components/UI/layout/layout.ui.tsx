import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Header } from '../header';
import { Footer } from '../footer';
import { SideNavbar, atSideNavMenuContent } from '../side-navbar';
import { layoutStore } from './layout.ui.hook';
import { ScContainer, ScContent, ScMainBody } from './layout.ui.styled';
import Props from './layout.ui.type';

/** 화면 레이아웃 */
export const Layout: React.FC<Props> = ({ children }) => {
  const { pathname } = useLocation();
  const layoutState = useRecoilValue(layoutStore.state);
  const [, setMenuState] = useRecoilState(layoutStore.menu.state);
  const [currentRouterType, setCurrentRouterType] = useState(undefined);

  const [menuContent] = useRecoilState(atSideNavMenuContent);

  const getCurrentRouter = async () => {
    const menus = pathname.split('/');
    const menu1 = menus[1];
    const menu2 = menus[2];
    setMenuState({
      selectedLevel1: menu1 as string,
      selectedLevel2: [menu2],
    });

    const router = Object.keys(menuContent).find(
      key => menuContent[key].path === pathname,
    );
    if (router) {
      window.document.title = `ISOS | ` + router;
    }

    setCurrentRouterType(menuContent[router]);
  };

  useEffect(() => {
    getCurrentRouter();
  }, [pathname, menuContent]);

  return (
    <ScContainer
      top={layoutState.topSpacing}
      left={layoutState.leftSpacing}
      bottom={layoutState.bottomSpacing}
    >
      <Header
        uuid={currentRouterType?.uuid}
        height={layoutState.topSpacing}
        title={currentRouterType?.description}
        description={currentRouterType?.title}
        path={currentRouterType?.path}
      />

      <SideNavbar
        top={layoutState.topSpacing}
        width={layoutState.leftSpacing}
      />

      <ScMainBody
        id="main-body"
        top={layoutState.topSpacing}
        left={layoutState.leftSpacing}
        bottom={layoutState.bottomSpacing}
        contentSpacing={layoutState.contentSpacing}
      >
        <ScContent
          topSpacing={layoutState.topSpacing}
          titleBodySpacing={layoutState.topSpacing}
          bottomSpacing={layoutState.bottomSpacing}
          wrapperSpacing={layoutState.contentSpacing}
        >
          {children}
        </ScContent>

        <Footer
          id="main-footer"
          height={layoutState.bottomSpacing}
          left={layoutState.leftSpacing}
        />
      </ScMainBody>
    </ScContainer>
  );
};
