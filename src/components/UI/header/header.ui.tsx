import React, { lazy, Suspense, useMemo, useState, useEffect } from 'react';
import { Dropdown, Menu, Space } from 'antd';
import UserOutlined from '@ant-design/icons/UserOutlined';
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import { useSetRecoilState } from 'recoil';
import { img_logo2 } from '~images/index';
import { Link } from 'react-router-dom';
import { layoutStore } from '~hooks/index';
import Props from './header.ui.type';
import {
  ScMyPageText,
  ScRightWrapper,
  ScTitleBodyDescription,
  ScUserLogo,
} from './header.ui.styled';
import { executeData, getData, getUserInfo, setLogout } from '~/functions';
import Bookmark from '~components/UI/dropdown/subscribe/subscribe-list.ui';
import SubscribeButton from '../button/subscribe/subscribe-button.ui';

const ScContainer = lazy(() =>
  import('./header.ui.styled').then(module => ({
    default: module.ScContainer,
  })),
);
const ScLogo = lazy(() =>
  import('./header.ui.styled').then(module => ({ default: module.ScLogo })),
);

const fetchBookmarks = () =>
  getData({}, '/aut/bookmarks', 'raws', {}, false, null, {
    disabledZeroMessage: true,
  });

const Header: React.FC<Props> = props => {
  const userInfo = getUserInfo();
  const setLayoutState = useSetRecoilState(layoutStore.state);
  const [bookmarkItems, setBookmarkList] = useState<any[]>([]);

  const userName = useMemo(() => {
    return userInfo?.user_nm ? userInfo?.user_nm + '님' : '';
  }, [userInfo?.user_nm]);

  useEffect(() => {
    fetchBookmarks().then(setBookmarkList);
  }, []);

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
            <BookmarkButton
              uuid={props.uuid}
              key={`bookmark-button-${props.uuid}`}
              items={bookmarkItems}
              flush={setBookmarkList}
            />
          )}

          <ScRightWrapper key="RightWrapper">
            <ScMyPageText>{userName}</ScMyPageText>
            <Dropdown
              overlay={
                <Menu>
                  <Bookmark
                    key={'bookmark-list'}
                    title={'북마크'}
                    style={{ width: '150px', marginLeft: '5px' }}
                  >
                    {bookmarkItems.length === 0 ? (
                      <Bookmark.Item
                        key="bookmark-menu-disabled"
                        disabled={true}
                      />
                    ) : (
                      bookmarkItems.map(item => (
                        <Bookmark.Item
                          key={item.menu_uuid}
                          location={item.menu_uri}
                          title={item.menu_nm}
                        />
                      ))
                    )}
                  </Bookmark>
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

interface BookmarkButtonProps {
  uuid: string;
  key: string;
  flush: () => void;
  items: any[];
}

const BookmarkButton: React.FC<BookmarkButtonProps> = props => {
  const isSubscribe = props.items.some(item => item.menu_uuid === props.uuid);

  const subscribe = () => {
    (async () => {
      isSubscribe === true
        ? await executeData(
            [{ menu_uuid: props.uuid }],
            '/aut/bookmark/by-menu',
            'delete',
          )
        : await executeData(
            [{ menu_uuid: props.uuid }],
            '/aut/bookmarks',
            'post',
          );
      fetchBookmarks().then(props.flush);
    })();
  };

  return (
    <SubscribeButton
      checked={isSubscribe}
      onClick={subscribe}
      key={`subscribe-button-${props.uuid}-${isSubscribe}`}
    />
  );
};

export default Header;
