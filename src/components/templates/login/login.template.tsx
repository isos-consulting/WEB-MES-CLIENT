import React from 'react';
import { Flexbox } from '~components/UI/flexbox';
import { Button, Textbox, Checkbox, Combobox } from '~components/UI';
import { Space, Form } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { img_login_logo, img_login } from '~images/index';
import { ScContainer, ScFooter, ScImg } from './login.template.styled';
import Props from './login.template.interface';

/** 로그인 템플릿 */
export const TpLogin: React.FC<Props> = props => {
  const {
    id,
    defaultIdValue,
    idValue,
    factoryValue,
    savedIdChecked,
    factoryList,
    form,
    onChangeCbo,
    onChangeId,
    onChangePw,
    onLogin,
    onSavedIdChecked,
  } = props;

  return (
    <>
      <ScContainer>
        <Flexbox height="100vh" width="100%">
          <Space
            direction="horizontal"
            style={{ height: '100%', backgroundColor: '#F1f3f5' }}
            align="center"
          >
            <Space
              style={{ maxWidth: 800, height: '100%', overflow: 'hidden' }}
            >
              <ScImg
                src={img_login}
                style={{
                  width: '40vw',
                  height: '100vh',
                  marginLeft: '-150px',
                }}
                loading="lazy"
              />
            </Space>
          </Space>
          <Space
            align="center"
            direction="vertical"
            style={{
              position: 'relative',
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              backgroundColor: '#F1f3f5',
            }}
          >
            <Space
              style={{
                margin: '0 auto',
                height: '100%',
              }}
            >
              <Space>
                <Form
                  layout="vertical"
                  form={form}
                  style={{ width: 350, height: 600, marginBottom: 60 }}
                  requiredMark="optional"
                  initialValues={{ id: defaultIdValue }}
                >
                  <Space
                    direction="vertical"
                    style={{
                      marginBottom: 30,
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <img //로고이미지
                      style={{
                        width: 170,
                        marginBottom: 50,
                      }}
                      src={img_login_logo}
                      loading="lazy"
                    ></img>
                  </Space>

                  <Space
                    direction="vertical"
                    style={{
                      width: '100%',
                    }}
                    size="small"
                  >
                    <Combobox
                      id={id + 'factory'}
                      label="공장"
                      onChange={onChangeCbo}
                      options={factoryList}
                      value={factoryValue}
                      fontSize="large"
                    />
                    <Form.Item
                      id="id"
                      name="id"
                      label="아이디"
                      rules={[
                        { required: true, message: '아이디를 입력해주세요' },
                      ]}
                      style={{ margin: 0, marginTop: 15 }}
                    >
                      <Textbox
                        id="userId"
                        name="id"
                        inputType="id"
                        value={idValue}
                        onChange={onChangeId}
                        placeholder="아이디를 입력하세요."
                        widthSize="flex"
                        onPressEnter={onLogin}
                      />
                    </Form.Item>

                    <Form.Item
                      id="password"
                      name="password"
                      rules={[
                        { required: true, message: '비밀번호를 입력해주세요' },
                      ]}
                      label="비밀번호"
                      style={{ margin: 0, marginTop: 5 }}
                    >
                      <Textbox
                        id="userPw"
                        name="password"
                        inputType="password"
                        placeholder="비밀번호를 입력하세요."
                        widthSize="flex"
                        iconRender={(visible: boolean) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        onChange={onChangePw}
                        onPressEnter={onLogin}
                      />
                    </Form.Item>
                    <Flexbox
                      alignItems="center"
                      justifyContent="flex-start"
                      currentStyles={{
                        margin: '8px 0',
                        marginBottom: 10,
                        marginTop: 10,
                      }}
                    >
                      <Checkbox
                        checked={savedIdChecked}
                        onChange={onSavedIdChecked}
                        text="아이디 저장"
                      />
                    </Flexbox>

                    <Button
                      btnType="buttonFill"
                      colorType="blue"
                      fontSize="large"
                      // disabled={disabled}
                      onClick={onLogin}
                    >
                      로그인
                    </Button>
                  </Space>
                </Form>
              </Space>
              <ScFooter>Copyright 2020.000 All Right Reserved.</ScFooter>
            </Space>
          </Space>
        </Flexbox>
        {/* <McInputPopup {...InputPopupProps} /> */}
      </ScContainer>
    </>
  );
};
