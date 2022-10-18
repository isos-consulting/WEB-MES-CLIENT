import React from 'react';
import { Button, Upload, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface UploadButtonProps extends UploadProps {
  text: string;
  onClick: Function;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  action,
  headers,
  onChange,
  text,
  beforeUpload,
  disabled,
  onClick,
  openFileDialogOnClick,
}: UploadButtonProps) => {
  return (
    <Upload
      name="file"
      action={action}
      headres={headers}
      onChange={onChange}
      maxCount={1}
      beforeUpload={beforeUpload}
      showUploadList={false}
      openFileDialogOnClick={openFileDialogOnClick}
    >
      <Button icon={<UploadOutlined />} disabled={disabled} onClick={onClick}>
        {text}
      </Button>
    </Upload>
  );
};

export default UploadButton;
