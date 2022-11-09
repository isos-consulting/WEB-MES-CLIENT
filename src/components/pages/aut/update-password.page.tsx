import React from 'react';
import { Col, Form, Row } from 'antd';
import { Button, Textbox } from '~/components/UI';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import PasswordValidation from '~/models/user/password';
import { executeData } from '~/functions';
import crypto from 'crypto-js';
import { Profile } from '~/models/user/profile';
import { ico_lock } from '~/images';

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
      <article style={{ padding: '76px 265px 0' }}>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              backgroundImage: `URL(${ico_lock})`,
              height: '300px',
              width: '303px',
              backgroundPosition: 'top 9.6% right 85.9%',
            }}
          ></div>
          <div style={{ marginLeft: '20px' }}>
            <h1 style={{ fontSize: '90px', fontWeight: 'bold', margin: '0px' }}>
              안전한 서비스 이용을 위해
            </h1>
            <h1
              style={{
                fontSize: '90px',
                fontWeight: 'bold',
                lineHeight: '83px',
                marginBottom: '109px',
              }}
            >
              <span style={{ color: '#02aef2' }}>비밀번호를 변경</span>하세요.
            </h1>
          </div>
        </div>
        <div style={{ marginLeft: '13px', marginBottom: '37px' }}>
          <h3 style={{ fontSize: '24px' }}>
            관리자에 의해 비밀번호가 세팅 또는 초기화 되었습니다.
          </h3>
          <h3 style={{ fontSize: '24px' }}>
            개인 정보보호를 위해 비밀번호를 변경해주세요.
          </h3>
        </div>
        <div
          style={{
            border: 'solid 3px #f0f0f0',
            padding: '30px 0 30px 0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Form
              form={resetForm}
              layout="vertical"
              style={{
                width: 850,
                height: 230,
              }}
            >
              <Textbox name="username" hidden={true} autoComplete="username" />
              <Password />
              <Password.Confirm />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '15px 0',
                }}
              >
                <Button
                  btnType="buttonFill"
                  widthSize="large"
                  fontSize="large"
                  style={{ marginTop: '30px', backgroundColor: '#02aef2' }}
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
                        // 예외 처리에 대한 코드를 추가해주세요
                      });
                  }}
                >
                  변경하기
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </article>
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
              if (value == null) {
                return Promise.resolve();
              }

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
        style={{ margin: '0' }}
      >
        <Row gutter={8}>
          <Col span={4}>
            <p
              style={{
                height: '100%',
                margin: 0,
                padding: '6px 0',
                fontSize: '18px',
              }}
            >
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
            <p
              style={{
                height: '100%',
                margin: 0,
                padding: '6px 0',
                fontSize: '18px',
              }}
            >
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
            <p
              style={{
                height: '100%',
                margin: 0,
                padding: '6px 0',
                fontSize: '18px',
              }}
            >
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
            <p
              style={{
                height: '100%',
                margin: 0,
                padding: '6px 0',
                fontSize: '18px',
              }}
            >
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
