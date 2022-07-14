import React from 'react';
import { Col, Form, Row } from 'antd';
import { Button, Textbox } from '~/components/UI';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import PasswordValidation from '~/models/user/password';
import { consoleLogLocalEnv, executeData } from '~/functions';
import crypto from 'crypto-js';
import { Profile } from '~/models/user/profile';

const PgUpdatePassword = ({
  profile,
  authenticatedCallback,
}: {
  profile: Profile;
  authenticatedCallback: (userProfile: Profile) => void;
}) => {
  const [resetForm] = Form.useForm();
  return (
    <div>
      <h1>보다 안전한 서비스 이용을 위해</h1>
      <h1>비밀번호를 변경하세요.</h1>

      <h3>관리자에 의해 비밀번호가 세팅 또는 변경되었습니다.</h3>
      <h3>
        계정 사용자가 직접 변경한 비밀번호가 아니므로 개인 정보보호를 위해
        비밀번호를 변경해주세요
      </h3>
      <Form
        form={resetForm}
        layout="vertical"
        style={{ width: 700, height: 600, marginBottom: 60 }}
      >
        <Textbox name="username" hidden={true} autoComplete="username" />
        <Password />
        <Password.Confirm />
        <Button
          btnType="buttonFill"
          widthSize="large"
          fontSize="large"
          onClick={() => {
            resetForm
              .validateFields()
              .then(async values => {
                await executeData(
                  [
                    {
                      pwd: crypto.AES.encrypt(
                        values.password,
                        'secret',
                      ).toString(),
                    },
                  ],
                  '/aut/users/pwd',
                  'put',
                );

                const storedUserProfile = JSON.parse(
                  localStorage.getItem('userInfo'),
                );
                const updatedProfile = profile.updatePassword('');

                const stringifiedProfile = JSON.stringify({
                  ...storedUserProfile,
                  pwd_fg: updatedProfile.isResetPassword,
                });

                localStorage.setItem('userInfo', stringifiedProfile);

                authenticatedCallback(updatedProfile);
              })
              .catch(errorInfo => {
                consoleLogLocalEnv(errorInfo);
              });
          }}
        >
          변경하기
        </Button>
      </Form>
    </div>
  );
};

const Password: React.FC & { Confirm: typeof PasswordConfirm } = () => {
  return (
    <>
      <Form.Item
        id="password"
        name="password"
        rules={[
          { required: true, message: '비밀번호를 입력해주세요' },
          () => ({
            validator(_, value) {
              if (value.length > 9 && value.length < 17) {
                if (PasswordValidation.UPPER_CASE.test(value) === true)
                  return Promise.reject(
                    '영문 소문자, 숫자, 특수문자 중 2종을 조합을 포함해야 합니다.',
                  );

                const validator = new PasswordValidation();

                if (PasswordValidation.NUMBER.test(value) === true)
                  validator.pass();

                if (PasswordValidation.LOWER_CASE.test(value) === true)
                  validator.pass();

                if (PasswordValidation.SPECIAL_CHARACTER.test(value) === true)
                  validator.pass();

                if (validator.isPassed() === true) return Promise.resolve();

                return Promise.reject(
                  '영문 소문자, 숫자, 특수문자 중 2종을 조합을 포함해야 합니다.',
                );
              }

              return Promise.reject(' 비밀번호는 10 ~ 16자여야 합니다.');
            },
          }),
        ]}
        style={{ margin: 0 }}
      >
        <Row gutter={8}>
          <Col span={4}>
            <p style={{ height: '100%', margin: 0, padding: '10px 0' }}>
              새 비밀번호
            </p>
          </Col>
          <Col span={8}>
            <Textbox
              id="password"
              name="password"
              inputType="password"
              placeholder="비밀번호를 입력하세요."
              widthSize="flex"
              iconRender={(visible: boolean) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              autoComplete="new-password"
            />
          </Col>
          <Col span={12}>
            <p style={{ height: '100%', margin: 0, padding: '10px 0' }}>
              10~16 영문 소문자, 숫자, 특수문자 중 2종을 조합
            </p>
          </Col>
        </Row>
      </Form.Item>
    </>
  );
};

const PasswordConfirm = () => {
  return (
    <>
      <Form.Item
        id="confirm"
        name="confirm"
        rules={[
          { required: true, message: '비밀번호를 입력해주세요' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('비밀번호가 일치하지 않습니다.');
            },
          }),
        ]}
        style={{ margin: 0 }}
      >
        <Row gutter={8}>
          <Col span={4}>
            <p style={{ height: '100%', margin: 0, padding: '10px 0' }}>
              새 비밀번호 확인
            </p>
          </Col>
          <Col span={8}>
            <Textbox
              id="confirm"
              name="confirm"
              inputType="password"
              placeholder="비밀번호를 입력하세요."
              widthSize="flex"
              iconRender={(visible: boolean) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              autoComplete="new-password"
            />
          </Col>
          <Col span={12}>
            <p style={{ height: '100%', margin: 0, padding: '10px 0' }}>
              ',",\,공백 사용 불가
            </p>
          </Col>
        </Row>
      </Form.Item>
    </>
  );
};

Password.Confirm = PasswordConfirm;

export default PgUpdatePassword;
