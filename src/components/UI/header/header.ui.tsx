import React, { lazy, Suspense, useMemo } from "react";
import { Dropdown, Menu, Space } from 'antd';
import UserOutlined from '@ant-design/icons/UserOutlined';
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import { useSetRecoilState } from 'recoil';
import { img_logo2 } from '~images/index';
import { Link } from 'react-router-dom';
import { layoutStore, authStore } from '~hooks/index';
import Props from './header.ui.type';
import { ScMyPageText, ScRightWrapper, ScTitleBodyDescription, ScUserLogo} from './header.ui.styled';
import { getUserInfo, setLogout } from "~/functions";

const ScContainer = lazy(() => import('./header.ui.styled').then(module=>({default:module.ScContainer})));
const ScLogo = lazy(() => import('./header.ui.styled').then(module=>({default:module.ScLogo})));


/** 헤더 */
const Header: React.FC<Props> = (props) => {
  const userInfo = getUserInfo();
  const setLayoutState = useSetRecoilState(layoutStore.state);

  const userName = useMemo(() => {
    return userInfo?.userNm ? userInfo?.userNm + '님' : '';
  }, [userInfo?.userNm]);

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
            {/* <Link to='/mypage' style={{
              color: 'inherit'
            }}>
              <ScMyPageText>마이페이지</ScMyPageText>
            </Link> */}
            <ScMyPageText>{userName}</ScMyPageText>
            <Dropdown overlay={<Menu>
              <Menu.Item
                key='0'
                style={{ textAlign: 'center' }}
                onClick={setLogout}
              >
                로그아웃
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