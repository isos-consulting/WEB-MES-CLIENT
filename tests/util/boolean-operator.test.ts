describe('Boolean 결과를 반전시키는 것은 반대 비교를 사용했을때보다 복잡하기 때문에 테스트를 실시함', () => {
  test('Boolean 반전', () => {
    expect(!true).toBe(false);
  });

  test('반대 비교 연산?', () => {
    // jest 실행 결과 반대 비교 연산이 속도가 더 빠른듯 함
    expect(true !== true).toBe(false);
  });
});
