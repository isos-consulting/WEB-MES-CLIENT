import { Divider, Space, Typography } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import React from 'react';
import { Button, Container, Searchbox, TPermission } from '~/components/UI';

export const WorkPerformanceHeader = ({
  permissions,
  onProdOrder,
  searchInfo,
  onSearch,
  HeaderGridElement,
}: {
  permissions: TPermission;
  onProdOrder: () => void;
  searchInfo: any;
  onSearch: (values: any, afterSearch: () => void) => void;
  HeaderGridElement: any;
}) => {
  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: -16, fontSize: 14 }}>
        <CaretRightOutlined />
        생산이력
      </Typography.Title>
      <Divider style={{ marginBottom: 10 }} />
      <Container>
        <div style={{ width: '100%', display: 'inline-block' }}>
          <Space size={[6, 0]} style={{ float: 'right' }}>
            <Button
              btnType="buttonFill"
              widthSize="large"
              heightSize="small"
              fontSize="small"
              ImageType="add"
              colorType="blue"
              onClick={onProdOrder}
              disabled={!permissions?.update_fg}
            >
              작업지시 관리
            </Button>
          </Space>
        </div>
        <div style={{ maxWidth: 700, marginTop: -33, marginLeft: 0 }}>
          <Searchbox
            {...searchInfo.props}
            onSearch={permissions?.read_fg ? onSearch : null}
            boxShadow={false}
          />
        </div>
        <p />
        {HeaderGridElement}
      </Container>
    </>
  );
};
