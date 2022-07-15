import React, { useMemo, useState } from 'react';
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
import UploadButton from './upload/upload-button.ui';

/** 버튼 */
const Button: React.FC<Props> & { Upload: typeof UploadButton } = props => {
  const [loading, setLoading] = useState(false);
  const { ImageType, ...otherProps } = props;
  let iconElement = useMemo(() => setIcon(ImageType), [ImageType]);

  const handleClick = async () => {
    setLoading(true);
    await props.onClick();
    setLoading(false);
  };

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
    <ScButton
      {...otherProps}
      onClick={handleClick}
      icon={iconElement}
      loading={loading}
    >
      {props.children}
    </ScButton>
  );
};

Button.Upload = UploadButton;

export default Button;
