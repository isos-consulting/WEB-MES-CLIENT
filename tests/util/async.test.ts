describe('async 반환에 대한 테스트', () => {
  const asyncFunc = async () => {
    return 'async';
  };

  const api = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('promise');
      }, 1000);
    });
  };

  const asyncApi = async () => {
    return api();
  };

  test('async 반환', async () => {
    const result = await asyncFunc();

    expect(result).toBe('async');
  });

  test('promise 반환', async () => {
    const result = await api();

    expect(result).toBe('promise');
  });

  test('async 함수는 Promise에서 반환값을 래핑하기 때문에 return await는 중복 사용이다', async () => {
    const result = await asyncApi();

    expect(result).toBe('promise');
  });
});
