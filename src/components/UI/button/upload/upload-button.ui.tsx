import React from 'react';
import { Button, Upload, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface UploadButtonProps extends UploadProps {
  text: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  action,
  headers,
  onChange,
  text,
  beforeUpload,
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
    >
      <Button icon={<UploadOutlined />}>{text}</Button>
    </Upload>
  );
};

export default UploadButton;
