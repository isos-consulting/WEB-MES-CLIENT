const fakeApiPromise = (params, uri) =>
  Promise.resolve([
    { userId: 'john', userNm: 'John Doe' },
    { userId: 'kim', userNm: 'min-su' },
  ]);

const getComboDatasFake = async (codeName, textName, params, uri) => {
  const options = await fakeApiPromise(params, uri);

  const res = options.reduce((resOptions, option) => {
    const optionEntry = {
      code: option[codeName],
      text: option[textName],
    };

    if (optionEntry.code && optionEntry.text) {
      return resOptions.concat(optionEntry);
    }

    return resOptions;
  }, []);

  return res;
};

describe('getComboDatas 함수는 react 내장 훅으로 정의되어 있으므로 가짜 함수를 이용한다', () => {
  test('getComboDatas 함수는 Promise를 반환한다', () => {
    const params = {};
    const uriPath = '/fake/path';

    const comboboxOptionsPromise = getComboDatasFake(
      'userId',
      'userNm',
      params,
      uriPath,
    );

    expect(comboboxOptionsPromise).toBeInstanceOf(Promise);
  });

  test('getComboDatas의 응답 데이터는 {code, value}쌍으로 구성된 오브젝트 배열을 반환한다', () => {
    const params = {};
    const uriPath = '/fake/path';

    const comboboxOptionsPromise = getComboDatasFake(
      'userId',
      'userNm',
      params,
      uriPath,
    );

    comboboxOptionsPromise.then(comboboxOptions => {
      expect(comboboxOptions).toEqual([
        {
          code: 'john',
          text: 'John Doe',
        },
        { code: 'kim', text: 'min-su' },
      ]);
    });
  });
});
