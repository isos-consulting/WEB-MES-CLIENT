import React from 'react';
import { Menu, SubMenuProps, MenuItemProps } from 'antd';
import { ScExtendedLink } from '../../side-navbar/side-navbar.ui.styled';

interface BookmarkProps extends SubMenuProps {
  key: string;
}

interface BookmarkItemProps extends MenuItemProps {
  location?: string;
  title?: string;
}

const MenuList = (props: BookmarkProps) => {
  return <Menu.SubMenu {...props}></Menu.SubMenu>;
};

const MenuItem = (props: BookmarkItemProps) => {
  const itemProps = {
    style: {
      minWidth: '150px',
      maxWidth: '200px',
      padding: '0px',
      textIndent: '17px',
    },
    ...props,
  };

  const textStyle = { padding: '5px 0px', margin: '0px' };

  const linkProps = {
    style: { ...textStyle, color: '#000000' },
    to: props.location,
  };

  return (
    <Menu.Item {...itemProps}>
      {props.location == null ? (
        <p style={textStyle}>메뉴가 없습니다</p>
      ) : (
        <ScExtendedLink {...linkProps}>{props.title}</ScExtendedLink>
      )}
    </Menu.Item>
  );
};

export default BookmarkProps;

export const Bookmark = {
  List: MenuList,
  Item: MenuItem,
};
