import React, { lazy, Suspense, useMemo } from 'react';
import { Dropdown, Menu, Space } from 'antd';
import UserOutlined from '@ant-design/icons/UserOutlined';
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import { useSetRecoilState } from 'recoil';
import { img_logo2 } from '~images/index';
import { Link } from 'react-router-dom';
import { layoutStore, authStore } from '~hooks/index';
import Props from './header.ui.type';
import {
  ScMyPageText,
  ScRightWrapper,
  ScTitleBodyDescription,
  ScUserLogo,
} from './header.ui.styled';
import { getUserInfo, setLogout } from '~/functions';
import { Bookmark } from '~components/UI/dropdown/subscribe/subscribe-list.ui';
import SubscribeButton from '../button/subscribe/subscribe-button.ui';

const ScContainer = lazy(() =>
  import('./header.ui.styled').then(module => ({
    default: module.ScContainer,
  })),
);
const ScLogo = lazy(() =>
  import('./header.ui.styled').then(module => ({ default: module.ScLogo })),
);

/** 헤더 */
const Header: React.FC<Props> = props => {
  const userInfo = getUserInfo();
  const setLayoutState = useSetRecoilState(layoutStore.state);

  const userName = useMemo(() => {
    return userInfo?.user_nm ? userInfo?.user_nm + '님' : '';
  }, [userInfo?.user_nm]);

  const subscribe = (
    prev: boolean,
    changeSubscribeState: (boolean) => void,
  ) => {
    console.log('create or delete subscribe action');
    changeSubscribeState(!prev);
  };

  console.log(props);

  return (
    <div>
      <Suspense fallback="...loading">
        <ScContainer {...props}>
          <ScLogo>
            <Link
              to="/dashboard"
              style={{
                color: 'inherit',
              }}
              onClick={() => {
                setLayoutState(prevState => ({
                  ...prevState,
                  leftSpacing: 70,
                  showResizeBtn: false,
                }));
              }}
            >
              <img src={img_logo2} alt="" />
            </Link>
          </ScLogo>

          <ScTitleBodyDescription>
            <div>{props.title}</div>
            {props.description}
          </ScTitleBodyDescription>

          {props.title == null ? null : (
            <SubscribeButton
              checked={false}
              onClick={subscribe}
              key={`subscribe-button-${props.description}`}
            />
          )}

          <ScRightWrapper key="RightWrapper">
            <ScMyPageText>{userName}</ScMyPageText>
            <Dropdown
              overlay={
                <Menu>
                  <Bookmark.List
                    key={'bookmark-list'}
                    title={'북마크'}
                    style={{ width: '150px', marginLeft: '5px' }}
                  >
                    <Bookmark.Item key="bookmark-menu-disabled" disabled={true}>
                      메뉴가 없습니다
                    </Bookmark.Item>
                    <Bookmark.Item key="bookmark-menu-1">
                      <Link to="/adm/bom-type">
                        BOM 구성유형
                      </>
                    </Bookmark.Item>
                    <Bookmark.Item key="bookmark-menu-2">
                      <Link to="/dashboard">대시보드</Link>
                    </Bookmark.Item>
                    <Bookmark.Item key="bookmark-menu-3">
                      <Link
                        to="/std/factories"
                        style={{ color: '#000000' }}
                      >
                        공장관리
                      </Link>
                    </Bookmark.Item>
                  </Bookmark.List>
                  <Menu.Divider />
                  <Menu.Item
                    key="0"
                    style={{ marginLeft: '5px' }}
                    onClick={setLogout}
                  >
                    로그아웃
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Space className="ant-dropdown-link">
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
