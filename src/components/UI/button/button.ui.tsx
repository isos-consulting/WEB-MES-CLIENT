import React, { useMemo } from 'react';
import { ScButton } from './button.ui.styled';
import Colors from '~styles/color.style.scss';
import {
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  LeftCircleOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditFilled,
} from '@ant-design/icons';
import Props from './button.ui.type';

/** 버튼 */
const Button: React.FC<Props> = props => {
  const { ImageType, ...otherProps } = props;
  let iconElement = useMemo(() => setIcon(ImageType), [ImageType]);

  function setIcon(imgType) {
    switch (imgType) {
      case 'add':
        return <FileAddOutlined />;
      case 'cancel':
        return <LeftCircleOutlined />;
      case 'delete':
        return <DeleteOutlined />;
      case 'edit':
        return <EditOutlined />;
      case 'plus':
        return <PlusCircleOutlined />;
      case 'print':
        return <FileExcelOutlined />;
      case 'search':
        return <SearchOutlined />;
      case 'popup':
        return <EditFilled color={Colors.fg_fontColor_default} />;
      case 'check':
        return <CheckCircleOutlined />;
      default:
        return null;
    }
  }

  return (
    <ScButton {...otherProps} icon={iconElement}>
      {props.children}
    </ScButton>
  );
};

export default Button;
