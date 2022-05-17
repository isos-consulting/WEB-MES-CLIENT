import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useLayoutEffect, useState } from 'react';
import { Label, PopupButton, Textbox } from '~/components/UI';
import Fonts from '~styles/font.style.scss';

/**
 * 실적 정보 컴포넌트
 */
const BaseWorkInfo = ({ permissions, values, infoState, infoDispatch }) => {
  const textboxDefaultSettings = {
    style: { fontSize: Fonts.fontSize_default },
  };

  /** 시작일 */
  const changeStartDate = ev => {
    const { value } = ev?.target;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: '_start_date', value });

    let datetime = value + ' ' + values?._start_time;
    if (dayjs(datetime).isValid() === false || values?._start_time == null)
      datetime = null;

    infoDispatch({
      type: 'CHANGE_ROUTING_INFO',
      name: 'start_date',
      value: datetime,
    });
  };

  /** 시작시간 */
  const changeStartTime = ev => {
    const { value } = ev?.target;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: '_start_time', value });

    let datetime = values?._start_date + ' ' + value + ':00';
    if (dayjs(datetime).isValid() === false || value == null) datetime = null;

    infoDispatch({
      type: 'CHANGE_ROUTING_INFO',
      name: 'start_date',
      value: datetime,
    });
  };

  /** 종료일 */
  const changeEndDate = ev => {
    const { value } = ev?.target;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: '_end_date', value });

    let datetime = value + ' ' + values?._end_time;
    if (dayjs(datetime).isValid() === false || values?._end_time == null)
      datetime = null;

    infoDispatch({
      type: 'CHANGE_ROUTING_INFO',
      name: 'end_date',
      value: datetime,
    });
  };

  /** 종료시간 */
  const changeEndTime = ev => {
    const { value } = ev?.target;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: '_end_time', value });

    let datetime = values?._end_date + ' ' + value + ':00';
    if (dayjs(datetime).isValid() === false || value == null) datetime = null;

    infoDispatch({
      type: 'CHANGE_ROUTING_INFO',
      name: 'end_date',
      value: datetime,
    });
  };

  const changeCboStore = value => {
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'to_store_uuid', value });
  };

  const changeCboLocation = value => {
    infoDispatch({
      type: 'CHANGE_ROUTING_INFO',
      name: 'to_location_uuid',
      value,
    });
  };

  const changeQty = ev => {
    const { value } = ev?.target;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'qty', value });
  };

  const changePrdSignalCnt = ev => {
    const { value } = ev?.target;
    infoDispatch({
      type: 'CHANGE_ROUTING_INFO',
      name: 'prd_signal_cnt',
      value,
    });
  };

  const changeRemark = ev => {
    const { value } = ev?.target;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'remark', value });
  };

  const changeCavity = ev => {
    const { value } = ev?.target;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'mold_cavity', value });
  };

  const changeEquip = (values: any) => {
    let value = values.equip_nm;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'equip_nm', value });

    value = values.equip_uuid;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'equip_uuid', value });
  };

  const changeWorkings = (values: any) => {
    let value = values.workings_nm;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'workings_nm', value });

    value = values.workings_uuid;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'workings_uuid', value });
  };

  const changeMold = (values: any) => {
    let value = values.mold_nm;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'mold_nm', value });

    value = values.cavity;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'mold_cavity', value });

    value = values.mold_uuid;
    infoDispatch({ type: 'CHANGE_ROUTING_INFO', name: 'mold_uuid', value });
  };

  return (
    <div style={{ padding: '0px 4px', marginTop: -10, width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col span={6} style={{ paddingLeft: 4 }}>
          <Label text="공정" width={100} />
          <Textbox
            {...textboxDefaultSettings}
            id="proc_nm"
            value={values?.proc_nm}
            widthSize="flex"
            disabled={true}
          />
        </Col>
        <Col span={6}>
          <Label text="공정순서" width={100} />
          <Textbox
            {...textboxDefaultSettings}
            id="proc_no"
            value={values?.proc_no}
            widthSize="flex"
            disabled={true}
          />
        </Col>
        <Col span={6}>
          <Label text="시작 일자" width={100} />
          <Textbox
            {...textboxDefaultSettings}
            type="date"
            id="start_date"
            value={values?._start_date}
            widthSize="flex"
            onChange={changeStartDate}
          />
        </Col>
        <Col span={6} style={{ paddingRight: 4 }}>
          <Label text="시작 시간" width={100} />
          <Textbox
            {...textboxDefaultSettings}
            type="time"
            id="start_time"
            value={values?._start_time}
            widthSize="flex"
            onChange={changeStartTime}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6} style={{ paddingLeft: 4 }}>
          <Label text="작업장" width={100} />
          <div style={{ display: 'flex' }}>
            <Textbox
              {...textboxDefaultSettings}
              id="workings_nm"
              value={values?.workings_nm}
              widthSize="flex"
              disabled={true}
            />
            <div
              style={{
                float: 'right',
                marginLeft: -30,
              }}
            >
              <PopupButton
                widthSize={'medium'}
                firstItemEmpty={true}
                popupKey={'작업장관리'}
                popupKeys={['workings_nm', 'workings_uuid']}
                setValues={values => {
                  changeWorkings(values);
                }}
              />
            </div>
          </div>
        </Col>
        <Col span={6}>
          <Label text="설비" width={100} />
          <div style={{ display: 'flex' }}>
            <Textbox
              {...textboxDefaultSettings}
              id="equip_nm"
              value={values?.equip_nm}
              widthSize="flex"
              disabled={true}
            />
            <div
              style={{
                float: 'right',
                marginLeft: -30,
              }}
            >
              <PopupButton
                widthSize={'medium'}
                firstItemEmpty={true}
                popupKey={'설비관리'}
                popupKeys={['equip_nm', 'equip_uuid']}
                setValues={values => {
                  changeEquip(values);
                }}
              />
            </div>
          </div>
        </Col>
        <Col span={6}>
          <Label text="종료 일자" width={100} />
          <Textbox
            {...textboxDefaultSettings}
            type="date"
            id="end_date"
            value={values?._end_date}
            widthSize="flex"
            onChange={changeEndDate}
          />
        </Col>
        <Col span={6} style={{ paddingRight: 4 }}>
          <Label text="종료 시간" width={100} />
          <Textbox
            {...textboxDefaultSettings}
            type="time"
            id="end_time"
            value={values?._end_time}
            widthSize="flex"
            onChange={changeEndTime}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6} style={{ paddingLeft: 4 }}>
          <Label text="금형" />
          <div style={{ display: 'flex' }}>
            <Textbox
              {...textboxDefaultSettings}
              id="mold_nm"
              value={values?.mold_nm}
              widthSize="flex"
              disabled={true}
            />
            <div
              style={{
                float: 'right',
                marginLeft: -30,
              }}
            >
              <PopupButton
                widthSize={'medium'}
                firstItemEmpty={true}
                popupKey={'금형관리'}
                popupKeys={['mold_nm', 'mold_uuid', 'cavity']}
                setValues={values => {
                  changeMold(values);
                }}
              />
            </div>
          </div>
        </Col>
        <Col span={3}>
          <Label text="금형Cavity" width={100} />
          <Textbox
            {...textboxDefaultSettings}
            type="number"
            id="mold_cavity"
            value={values?.mold_cavity}
            widthSize="flex"
            onChange={changeCavity}
          />
        </Col>
        <Col span={3}>
          <Label text="양품 수량" width={100} />
          <Textbox
            {...textboxDefaultSettings}
            type="number"
            id="qty"
            value={values?.qty}
            widthSize="flex"
            onChange={changeQty}
          />
        </Col>
        <Col span={3}>
          <Label text="설비 카운트" width={100} />
          <Textbox
            {...textboxDefaultSettings}
            type="number"
            id="prd_signal_cnt"
            value={values?.prd_signal_cnt}
            widthSize="flex"
            onChange={changePrdSignalCnt}
          />
        </Col>
        <Col span={9} style={{ marginBottom: 16, paddingRight: 4 }}>
          <Label text="비고" width={100} />
          <Textbox
            {...textboxDefaultSettings}
            id="remark"
            value={values?.remark}
            widthSize="flex"
            onChange={changeRemark}
          />
        </Col>
      </Row>
    </div>
  );
};

export const WorkInfo = React.memo(BaseWorkInfo);
