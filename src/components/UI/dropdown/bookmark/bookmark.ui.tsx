import React from 'react';
import styled from 'styled-components';
import { Menu, SubMenuProps, MenuItemProps } from 'antd';
import { ScExtendedLink } from '../../side-navbar/side-navbar.ui.styled';
import { isNil } from '~/helper/common';

interface BookmarkProps extends SubMenuProps {
  key: string;
}

interface BookmarkItemProps extends MenuItemProps {
  location?: string;
  title?: string;
}

const SubMenuWrapper = styled(Menu.SubMenu)`
  width: 150px;
  margin-left: 5px;
`;

const MenuList: React.FC<BookmarkProps> & { Item: typeof MenuItem } = (
  props: BookmarkProps,
) => {
  return <SubMenuWrapper {...props} />;
};

const SubMenuItemWrapper = styled(Menu.Item)`
  min-width: 150px;
  max-width: 200px;
  padding: 0px;
  text-indent: 17px;
`;

const LinkWrapper = styled(ScExtendedLink)`
  padding: 5px 0px;
  margin: 0px;
  color: #000000;
`;

const NoitemWrapper = styled.p`
  padding: 5px 0px;
  margin: 0px;
`;

const MenuItem = (props: BookmarkItemProps) => {
  return (
    <SubMenuItemWrapper {...props}>
      {isNil(props.location) ? (
        <NoitemWrapper>메뉴가 없습니다</NoitemWrapper>
      ) : (
        <LinkWrapper to={props.location}>{props.title}</LinkWrapper>
      )}
    </SubMenuItemWrapper>
  );
};

const Bookmark = MenuList;
Bookmark.Item = MenuItem;

export default Bookmark;
