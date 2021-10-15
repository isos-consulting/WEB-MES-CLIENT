import React from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import RightOutlined from '@ant-design/icons/RightOutlined';
import { layoutStore } from '../layout/layout.ui.hook';
import { Flexbox } from '../flexbox';
import { Menu } from 'antd';
import { atSideNavMenuRawData } from './side-navbar.ui.recoil';
import * as Images from '~images/nav.index';
import Props, {ILevel1Info, ILevel2Info, ILevel2Props, ILevel3Info} from './side-navbar.ui.type';
import {ScContainer, ScExtendedLink, ScLevel1Menu, ScLevel2Menu, ScMenuItem, ScMenuTitle, ScResizeButton} from './side-navbar.ui.styled';


const { SubMenu } = Menu;

const LEVEL1_Width = 70;
const LEVEL1_Expanded_Width = 270;


/** 사이드 네비게이션 바 */
const SideNavbar: React.FC<Props> = (props) => {
  const [menuState, setMenuState] = useRecoilState(layoutStore.menu.state);
  const [layoutState, setLayoutState] = useRecoilState(layoutStore.state);

  // 1level메뉴 클릭 이벤트
  const onChangeLevel1State = (selectedLevel1: string, route?:boolean) => {
    setMenuState((prevState) => {
      return { //선택한 Level1에 따른 Level2메뉴 세팅
        ...prevState,
        selectedLevel1,
      };
    });

    if (route === true) { //1Level에서 라우트를 사용하는 경우 2Level 메뉴 숨김
      setLayoutState((prevState) => ({
        ...prevState,
        leftSpacing: LEVEL1_Width,
        showResizeBtn: false
      }))
    } else {
      setLayoutState((prevState) => { return ({
        ...prevState,
        leftSpacing: layoutState.leftSpacing === LEVEL1_Width ? LEVEL1_Expanded_Width : prevState.leftSpacing, //1Level 선택시 2Level 접혀있으면 자동 펼침
        showResizeBtn: true
      });});
    }
  };

  return (
    <ScContainer {...props}>
      <Flexbox>
        <Level1
          selectedLevel1={menuState.selectedLevel1 as string}
          onChangeLevel1State={onChangeLevel1State}
        />
        <Level2 active={layoutState.leftSpacing === LEVEL1_Width}/>
      </Flexbox>
      {layoutState.showResizeBtn === false ?
        ''
      :
        <ScResizeButton className={layoutState.leftSpacing === LEVEL1_Width ? 'active' : ''} onClick={() => {
          setLayoutState(prevState => ({
            ...prevState,
            leftSpacing: prevState.leftSpacing === LEVEL1_Width ? LEVEL1_Expanded_Width : LEVEL1_Width
          }))
        }}>
          <RightOutlined />
        </ScResizeButton>
      }
    </ScContainer>
  );
};



//--- [1레벨 메뉴 세팅] ----------------------------------------------------------------------
const Level1: React.FC<{
  selectedLevel1: string;
  onChangeLevel1State: (newLevel: string, newRoute: boolean) => void;
}> = ({ selectedLevel1, onChangeLevel1State }) => {
  const [menuRawData] = useRecoilState(atSideNavMenuRawData);

  return (
    <ScLevel1Menu
      paddingTop={50}
      alignItems='center'
      justifyContent='flex-start'
      direction='column'
    >
      {menuRawData?.map((item, index) => (
        <ScMenuItem
          key={item.menu_uuid}
          onClick={() => {
            onChangeLevel1State(item.menu_uri, item.menu_type === 'page' ? true : false);
          }}
          className={`level1 ${item.menu_uri === selectedLevel1 ? 'active' : ''}`}
        >
          {item.menu_type === 'page' ?
          <ScExtendedLink to={item.menu_uri}>
            <img src={Images[item.icon]} loading='lazy'/>
          </ScExtendedLink>
          :
          <>
          <img src={Images[item.icon]} loading='lazy'/> <br/>
          </>
          } {item.menu_nm}
        </ScMenuItem> 
      ))}
    </ScLevel1Menu>
  );
};



//--- [2레벨 메뉴 세팅] ----------------------------------------------------------------------
const Level2: React.FC<ILevel2Props> = ({
  active
}) => {
  const { pathname } = useLocation();
  const [menuState] = useRecoilState(layoutStore.menu.state);
  const [menuRawData] = useRecoilState(atSideNavMenuRawData);
  
  if (!menuRawData) return null;

  return (
    <ScLevel2Menu
      className={active ? 'level2-active' : ''}
      paddingTop={40}
      alignItems='flex-start'
      justifyContent='flex-start'
      direction='column'
      currentStyles={{
        fontSize: 15
      }}
    >
      {
        menuRawData?.map((level1:ILevel1Info) => {
          if (level1?.menu_type === 'menu' && level1?.sub_menu?.length as number > 0) {
            if (menuState.selectedLevel1 === level1.menu_uri) {
              return (<React.Fragment key={level1.menu_uuid}>
                <ScMenuTitle>{level1.menu_nm}</ScMenuTitle>
                <Menu
                  key={level1.menu_uri}
                  style={{
                    border: 0,
                  }}
                  mode='inline'
                  selectedKeys={[pathname]}
                >{
                  level1?.sub_menu?.map((level2:ILevel2Info) => {
                    
                    if (level2?.menu_type === 'page') {
                      return (
                        <Menu.Item key={level2.menu_uri}>
                          <ScExtendedLink to={level2.menu_uri}>
                            {level2.menu_nm}
                          </ScExtendedLink>
                        </Menu.Item>
                      );

                    } else if (level2?.menu_type === 'menu' && level2?.sub_menu?.length as number > 0) {
                      let subMenu = level2?.sub_menu?.map((level3:ILevel3Info) => {
                        return (
                          <Menu.Item key={level3.menu_uri}>
                            <ScExtendedLink to={level3.menu_uri}>
                              {level3.menu_nm}
                            </ScExtendedLink>
                          </Menu.Item>
                        );
                      });

                      return (
                        <SubMenu key={level2.menu_uri} title={level2.menu_nm}>
                          {subMenu}
                        </SubMenu>
                      );
                    }
                  })
                }</Menu>
              </React.Fragment>);
            } else {
              return '';
            }
          } 
        }
      )  
    }
    </ScLevel2Menu>
  );
};


export default SideNavbar;