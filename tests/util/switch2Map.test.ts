type mapKeys = '부서관리' | '사용자관리';

const getDeptStr = () => {
  return '부서관리 함수 호출';
};

const getUserInfo = (option?: Object) => {
  return `사용자 이름: ${option}`;
};

const switchFunction = (str: string, option?: Object) => {
  switch (str) {
    case '부서관리':
      return getDeptStr();
    case '사용자관리':
      return getUserInfo(option);
  }
};

const mapFunction = new Map<mapKeys, Function>([
  ['부서관리', getDeptStr],
  ['사용자관리', getUserInfo],
]);

describe('switch', () => {
  test('부서관리', () => {
    expect(switchFunction('부서관리')).toBe('부서관리 함수 호출');
  });

  test('사용자관리, 매개변수 옵션을 곁들인..!', () => {
    expect(switchFunction('사용자관리', '엄준식')).toBe('사용자 이름: 엄준식');
  });
});

describe('map', () => {
  test('부서관리', () => {
    const deptFunc = mapFunction.get('부서관리');

    if (typeof deptFunc === 'function') {
      expect(deptFunc()).toBe('부서관리 함수 호출');
    }

    if (typeof deptFunc === 'undefined') {
      expect(deptFunc).toBeUndefined();
    }
    expect(mapFunction.has('부서관리')).toBeTruthy();
  });
  test('사용자관리', () => {
    const userFunc = mapFunction.get('사용자관리');

    if (typeof userFunc === 'function') {
      expect(userFunc('엄준식')).toBe('사용자 이름: 엄준식');
    }

    if (typeof userFunc === 'undefined') {
      expect(userFunc).toBeUndefined();
    }

    expect(mapFunction.has('사용자관리')).toBeTruthy();
  });
});
