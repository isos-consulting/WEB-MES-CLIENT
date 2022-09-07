import { Col, Divider, Input, Row, Space, Typography } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import React from 'react';
import { Button, Container, Label, Tabs, TPermission } from '~/components/UI';
import { RoutingInfo, WorkInfo } from '../../work-components';
import Fonts from '~styles/font.style.scss';

export const WorkPerformanceContent = ({
  permissions,
  onStartWork,
  onCancelWork,
  onDeleteWork,
  orderInfo,
  onSaveWork,
  onCompleteWork,
  workRouting,
  routingInfo,
  infoState,
  infoDispatch,
  changeTab,
  workInsp,
  workInput,
  workWorker,
  workReject,
  workDowntime,
  TAB_CODE,
  isWorkRoutingStarted,
}: {
  permissions: TPermission;
  onStartWork: () => void;
  onCancelWork: () => void;
  onDeleteWork: () => void;
  orderInfo: any;
  onSaveWork: any;
  onCompleteWork: any;
  workRouting: any;
  routingInfo: any;
  infoState: any;
  infoDispatch: any;
  changeTab: any;
  workInsp: any;
  workInput: any;
  workWorker: any;
  workReject: any;
  workDowntime: any;
  TAB_CODE: any;
  isWorkRoutingStarted: boolean;
}) => {
  return (
    <Row gutter={[16, 0]}>
      {/* 작업 정보 */}
      <Col span={24} style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Typography.Title
          level={5}
          style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
        >
          <CaretRightOutlined />
          작업 정보
        </Typography.Title>
        <div style={{ width: '100%', display: 'inline-block', marginTop: -26 }}>
          <div style={{ float: 'right', paddingRight: 4 }}>
            <Space>
              <Button
                btnType="buttonFill"
                colorType="blue"
                widthSize="large"
                heightSize="small"
                fontSize="small"
                ImageType="cancel"
                onClick={onCancelWork}
                disabled={!permissions?.update_fg}
              >
                실행 취소
              </Button>
              <Button
                btnType="buttonFill"
                colorType="red"
                widthSize="large"
                heightSize="small"
                fontSize="small"
                ImageType="delete"
                onClick={onDeleteWork}
                disabled={!permissions?.delete_fg}
              >
                실적 삭제
              </Button>
            </Space>
          </div>
        </div>
        <Divider style={{ marginTop: 2, marginBottom: 10 }} />
        <Row gutter={[16, 16]}>
          <Col span={12} style={{ paddingLeft: 0 }}>
            <Container>
              <Row gutter={[16, 16]}>
                <Col span={6} style={{ marginBottom: 8 }}>
                  <Label text="품번" />
                  <Input
                    disabled={true}
                    value={orderInfo.prod_no}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={6} style={{ marginBottom: 8 }}>
                  <Label text="품명" />
                  <Input
                    disabled={true}
                    value={orderInfo.prod_nm}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={6} style={{ marginBottom: 8 }}>
                  <Label text="품목유형" />
                  <Input
                    disabled={true}
                    value={orderInfo.item_type_nm}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={6} style={{ marginBottom: 8 }}>
                  <Label text="제품유형" />
                  <Input
                    disabled={true}
                    value={orderInfo.prod_type_nm}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={6} style={{ marginBottom: 4 }}>
                  <Label text="모델" />
                  <Input
                    disabled={true}
                    value={orderInfo.model_nm}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={6} style={{ marginBottom: 4 }}>
                  <Label text="REV" />
                  <Input
                    disabled={true}
                    value={orderInfo.rev}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={6} style={{ marginBottom: 4 }}>
                  <Label text="규격" />
                  <Input
                    disabled={true}
                    value={orderInfo.prod_std}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={6} style={{ marginBottom: 4 }}>
                  <Label text="단위" />
                  <Input
                    disabled={true}
                    value={orderInfo.unit_nm}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
              </Row>
            </Container>
          </Col>
          <Col span={12} style={{ paddingRight: 0 }}>
            <Container>
              <Row gutter={[16, 16]}>
                <Col span={6} style={{ marginBottom: 8 }}>
                  <Label text="설비" />
                  <Input
                    disabled={true}
                    value={orderInfo.equip_nm}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={6} style={{ marginBottom: 8 }}>
                  <Label text="공정" />
                  <Input
                    disabled={true}
                    value={orderInfo.proc_nm}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={6} style={{ marginBottom: 8 }}>
                  <Label text="작업교대" />
                  <Input
                    disabled={true}
                    value={orderInfo.shift_nm}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={6} style={{ marginBottom: 8 }}>
                  <Label text="작업장" />
                  <Input
                    disabled={true}
                    value={orderInfo.workings_nm}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
                <Col span={24} style={{ marginBottom: 4 }}>
                  <Label text="지시 비고" />
                  <Input
                    disabled={true}
                    value={orderInfo.remark}
                    style={{ fontSize: Fonts.fontSize_default }}
                  />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Col>

      {/* 실적 정보 */}
      <Col span={24} style={{ paddingLeft: 0, paddingRight: 0, marginTop: 12 }}>
        <Typography.Title
          level={5}
          style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
        >
          <CaretRightOutlined />
          실적 정보
        </Typography.Title>
        <div style={{ width: '100%', display: 'inline-block', marginTop: -26 }}>
          <div style={{ float: 'right', paddingRight: 4 }}>
            <Space>
              {isWorkRoutingStarted === true ? (
                <>
                  <Button
                    btnType="buttonFill"
                    colorType="blue"
                    widthSize="large"
                    heightSize="small"
                    fontSize="small"
                    ImageType="search"
                    onClick={onSaveWork}
                    disabled={!permissions?.read_fg}
                  >
                    실적 이력 관리
                  </Button>
                  <Button
                    btnType="buttonFill"
                    colorType="blue"
                    widthSize="large"
                    heightSize="small"
                    fontSize="small"
                    ImageType="add"
                    onClick={onSaveWork}
                    disabled={!permissions?.update_fg}
                  ></Button>
                  <Button
                    btnType="buttonFill"
                    colorType="blue"
                    widthSize="large"
                    heightSize="small"
                    fontSize="small"
                    ImageType="add"
                    onClick={onSaveWork}
                    disabled={!permissions?.update_fg}
                  >
                    실행 저장
                  </Button>
                  <Button
                    btnType="buttonFill"
                    colorType="delete"
                    widthSize="large"
                    heightSize="small"
                    fontSize="small"
                    ImageType="check"
                    onClick={onCompleteWork}
                    disabled={!permissions?.update_fg}
                  >
                    작업 종료
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    btnType="buttonFill"
                    colorType="blue"
                    widthSize="large"
                    heightSize="small"
                    fontSize="small"
                    ImageType="search"
                    onClick={onSaveWork}
                    disabled={!permissions?.read_fg}
                  >
                    실적 이력 관리
                  </Button>
                  <Button
                    btnType="buttonFill"
                    colorType="blue"
                    widthSize="large"
                    heightSize="small"
                    fontSize="small"
                    ImageType="add"
                    onClick={onStartWork}
                    disabled={!permissions?.update_fg}
                  >
                    작업 시작
                  </Button>
                </>
              )}
            </Space>
          </div>
        </div>
        <Divider style={{ marginTop: 2, marginBottom: 10 }} />
        <Row gutter={[16, 16]}>
          <Col span={6} style={{ paddingLeft: 0 }}>
            {/* 공정순서 */}
            <RoutingInfo
              permissions={permissions}
              height={709}
              {...workRouting}
            />
          </Col>
          <Col span={18} style={{ paddingRight: 0 }}>
            <Container>
              <Row>
                <WorkInfo
                  permissions={permissions}
                  values={routingInfo}
                  infoState={infoState}
                  infoDispatch={infoDispatch}
                />
              </Row>
              <Divider style={{ marginTop: 2 }} />
              <Row>
                <Col span={24}>
                  <Tabs
                    type="card"
                    onChange={changeTab}
                    panels={[
                      {
                        tab: '공정검사',
                        tabKey: TAB_CODE.WORK_INSP,
                        content: workInsp.component,
                      },
                      {
                        tab: '투입품목 관리',
                        tabKey: TAB_CODE.WORK_INPUT,
                        content: workInput.component,
                      },
                      {
                        tab: '투입인원 관리',
                        tabKey: TAB_CODE.WORK_WORKER,
                        content: workWorker.component,
                      },
                      {
                        tab: '부적합 관리',
                        tabKey: TAB_CODE.WORK_REJECT,
                        content: workReject.component,
                      },
                      {
                        tab: '비가동 관리',
                        tabKey: TAB_CODE.WORK_DOWNTIME,
                        content: workDowntime.component,
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
