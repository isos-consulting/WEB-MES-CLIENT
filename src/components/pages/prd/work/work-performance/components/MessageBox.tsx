import React from 'react';
import { working_test } from '~/images';

export const CascadingSelectHeaderMessageBox = () => {
  return (
    <>
      <div
        style={{
          position: 'relative',
          marginTop: '20px',
          width: '100%',
          height: '120px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: '15px', fontWeight: '600' }}>
            생산 이력을 선택하면 작업정보와 실적정보를 확인할 수 있습니다
          </p>
        </div>
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${working_test})`,
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(5px)',
            position: 'absolute',
          }}
        />
      </div>
    </>
  );
};
