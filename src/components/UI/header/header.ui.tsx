import React, { lazy, Suspense } from "react";
import { Dropdown, Menu, Space } from 'antd';
import UserOutlined from '@ant-design/icons/UserOutlined';
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import { useSetRecoilState } from 'recoil';
import { img_logo2 } from '~images/index';
import { Link } from 'react-router-dom';
import { layoutStore, authStore } from '~hooks/index';
import Props from './header.ui.type';
import { ScMyPageText, ScRightWrapper, ScTitleBodyDescription, ScUserLogo} from './header.ui.styled';

const ScContainer = lazy(() => import('./header.ui.styled').then(module=>({default:module.ScContainer})));
const ScLogo = lazy(() => import('./header.ui.styled').then(module=>({default:module.ScLogo})));


/** 헤더 */
const Header: React.FC<Props> = (props) => {
  const setUser = useSetRecoilState(authStore.user.state);
  const setLogout = () => {sessionStorage.removeItem('userInfo'); setUser(undefined);}
  const setLayoutState = useSetRecoilState(layoutStore.state);

  return (
    <div>
      <Suspense fallback='...loading'>
        <ScContainer {...props}>
          {/* 로고 */}
          <ScLogo>
            <Link
              to='/dashboard'
              style={{
                color: 'inherit'
              }}
              onClick={()=>{
                setLayoutState((prevState) => ({
                  ...prevState,
                  leftSpacing: 70,
                  showResizeBtn: false
                }))
              }}>
              <img
                src={img_logo2}
                alt=''
              />
            </Link>
          </ScLogo>

          {/* 타이틀 */}
          <ScTitleBodyDescription>
            <div>{props.title}</div>
            {props.description}
          </ScTitleBodyDescription>

          {/* 우측 버튼 */}
          <ScRightWrapper key='RightWrapper'>
            {/* <BellOutlined onClick={() => alert('아이콘 클릭')} /> */}
            <Link to='/mypage' style={{
              color: 'inherit'
            }}>
              <ScMyPageText>마이페이지</ScMyPageText>
            </Link>
            <Dropdown overlay={<Menu>
              <Menu.Item
                key='0'
                style={{ textAlign: 'center' }}
                onClick={() => {
                  setLogout();
                }}
              >
                로그아웃
              </Menu.Item>
              <Menu.Item
                key='1'
                style={{ textAlign: 'center' }}
                onClick={() => alert('텍스트1 클릭')}
              >
                텍스트1
              </Menu.Item>
              <Menu.Item
                key='3'
                onClick={() => alert('텍스트2 클릭')}
                style={{ textAlign: 'center' }}
              >
                텍스트2
              </Menu.Item>
            </Menu>} trigger={['click']}>
              <Space className='ant-dropdown-link'>
                <ScUserLogo>
                  <UserOutlined />
                </ScUserLogo>
                <CaretDownOutlined />
              </Space>
            </Dropdown>
          </ScRightWrapper>
        </ScContainer>
      </Suspense>
    </div>
    
  );
};


export default Header;