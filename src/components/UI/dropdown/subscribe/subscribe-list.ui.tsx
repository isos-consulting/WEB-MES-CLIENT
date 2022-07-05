import React from 'react';
import { Menu, SubMenuProps, MenuItemProps } from 'antd';

interface BookmarkProps extends SubMenuProps {
  key: string;
}

const MenuList = (props: BookmarkProps) => {
  return <Menu.SubMenu {...props}></Menu.SubMenu>;
};

const MenuItem = (props: MenuItemProps) => {
  const menuItemProps = {
    style: {
      minWidth: '150px',
      maxWidth: '200px',
      marginLeft: '5px',
    },
    ...props,
  };

  return <Menu.Item {...menuItemProps}></Menu.Item>;
};

export default BookmarkProps;

export const Bookmark = {
  List: MenuList,
  Item: MenuItem,
};
