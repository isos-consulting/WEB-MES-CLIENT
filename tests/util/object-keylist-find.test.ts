const aObject = {
  a: '1',
  b: '2',
  c: '3',
  d: '4',
  e: '5',
};

test('object-keylist-find', () => {
  // given
  const aList: string[] = Object.keys(aObject);

  // when
  const bKey = aList.filter(key => ['a', 'b', 'c'].includes(key));

  // then
  expect(bKey).toEqual(['a', 'b', 'c']);
});

test('object-entry-find', () => {
  // given
  const aList: [string, string][] = Object.entries(aObject);

  // when
  const bKey = aList.filter(([key, value]) => ['a', 'b', 'c'].includes(key));

  // then
  expect(bKey).toEqual([
    ['a', '1'],
    ['b', '2'],
    ['c', '3'],
  ]);
});
