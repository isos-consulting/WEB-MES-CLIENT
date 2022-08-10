describe('iterables loop test', () => {
  const arr = [1, '가', false];

  test('for loop', () => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === '가') {
        expect(arr[i]).toBe('가');
      }

      if (arr[i] === false) {
        expect(arr[i]).toBe(false);
      }

      if (arr[i] === 1) {
        expect(arr[i]).toBe(1);
      }
    }
  });

  test('for of loop', () => {
    for (const item of arr) {
      if (item === '가') {
        expect(item).toBe('가');
      }

      if (item === false) {
        expect(item).toBe(false);
      }

      if (item === 1) {
        expect(item).toBe(1);
      }
    }
  });

  test('for of loop break', () => {
    let i = '나';
    for (const item of arr) {
      if (item === '가') {
        i = item;

        break;
      }

      i = `${item}`;
    }

    expect(i).toBe('가');
  });
});
