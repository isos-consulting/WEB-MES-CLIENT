import React, { lazy, Suspense, useMemo, useState, useEffect } from 'react';
import { Dropdown, Menu, message, Space } from 'antd';
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
import Bookmark from '~components/UI/dropdown/bookmark/bookmark.ui';
import SubscribeButton from '../button/subscribe/subscribe-button.ui';
import { WORD } from '~/constants/lang/ko/word';
import { SENTENCE } from '~/constants/lang/ko/sentence';
import { isNil } from '~/helper/common';

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
  const [bookmarkItems, setBookmarkItems] = useState<any[]>([]);

  const userName = useMemo(() => {
    return userInfo?.user_nm ? userInfo?.user_nm + WORD.SIR : '';
  }, [userInfo?.user_nm]);

  useEffect(() => {
    fetchBookmarks().then(setBookmarkItems);
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

          {isNil(props.title) ? null : (
            <BookmarkButton
              uuid={props.uuid}
              key={`bookmark-button-${props.uuid}`}
              items={bookmarkItems}
              flush={setBookmarkItems}
            />
          )}

          <ScRightWrapper key="RightWrapper">
            <ScMyPageText>{userName}</ScMyPageText>
            {/* @ts-ignore */}
            <Dropdown
              overlay={
                <Menu>
                  <Bookmark key={'bookmark-list'} title={WORD.FAVORITE}>
                    {bookmarkItems.length === 0 ? (
                      <Bookmark.Item
                        key="bookmark-menu-noitem"
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
                    {WORD.LOGOUT}
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
  flush: React.Dispatch<React.SetStateAction<any[]>>;
  items: any[];
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  uuid,
  flush,
  items,
}) => {
  const isSubscribe = items.some(({ menu_uuid }) => menu_uuid === uuid);
  const [apiQueue, updateQueue] = useState([]);

  useEffect(() => {
    (async () => {
      if (apiQueue.length > 0) await apiQueue[0]();
    })();
  }, [apiQueue]);

  const subscribe = () => {
    if (apiQueue.length === 0) {
      updateQueue([
        async () => {
          const isUnsubscribed = isSubscribe;

          isUnsubscribed === true
            ? await executeData(
                [{ menu_uuid: uuid }],
                '/aut/bookmark/by-menu',
                'delete',
              )
            : await executeData(
                [{ menu_uuid: uuid }],
                '/aut/bookmarks',
                'post',
              );

          message.success(
            isUnsubscribed === true ? SENTENCE.UNFAVORITE : SENTENCE.FAVORITE,
          );

          await fetchBookmarks().then(flush);
          updateQueue([]);
        },
      ]);
    }
  };

  return (
    <SubscribeButton
      checked={isSubscribe}
      onClick={subscribe}
      key={`subscribe-button-${uuid}-${isSubscribe}`}
    />
  );
};

export default Header;
