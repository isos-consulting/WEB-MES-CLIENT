import { IGridModifiedRows } from '../../src/components/UI/datagrid-new/datagrid.ui.type';
import { IGridColumn } from '../../src/components/UI/datagrid-new';
import { cloneDeep } from 'lodash';
import { Row, RowKey } from 'tui-grid/types/store/data';

const rowKey = (row: Row, columns: IGridColumn[]) => {
  return Object.keys(row)
    .filter(
      key =>
        !columns
          .map(column => {
            if (column.alias != null) {
              return column.name;
            }
          })
          .includes(key),
    )
    .concat([
      'rowKey',
      'sortKey',
      'uniqueKey',
      'rowSpanMap',
      '_attributes',
      '_relationListItemMap',
      '_disabledPriority',
      '_children',
      '_leaf',
    ]);
};

const replaceNamePropertyValueToAliasPropertyValue = (
  rows: Row[],
  columns: IGridColumn[],
) => {
  const aliasRemovedRows: Row[] = [];
  const c = rows.length > 0 ? rowKey(rows[0], columns) : [];
  for (const row of rows) {
    const newRow: Row = Object.keys(row).reduce((acc: any, cur: string) => {
      const obj = typeof acc === 'string' ? {} : acc;

      if (Object.keys(obj).length === 0) {
        if (c.includes(acc)) {
          obj[acc] = row[acc];
        }
      }

      if (c.includes(cur)) {
        obj[cur] = row[cur];
      }

      return obj;
    }) as unknown as Row;

    for (const column of columns) {
      if (column.alias != null) {
        newRow[column.alias] = row[column.name];
      }
      aliasRemovedRows.push(newRow);
    }
  }

  return aliasRemovedRows;
};

const removeEmptyString = (rows: Row[], columns: IGridColumn[]) => {
  const emptyStringRemovedRows: Row[] = [];

  for (const row of rows) {
    const c = Object.keys(row)
      .filter(
        key =>
          !columns
            .map(column => {
              if (
                (column.disableStringEmpty === true ||
                  column.format !== 'text') &&
                row[column.name] === ''
              ) {
                return column.name;
              }
            })
            .includes(key),
      )
      .concat([
        'rowKey',
        'sortKey',
        'uniqueKey',
        'rowSpanMap',
        '_attributes',
        '_relationListItemMap',
        '_disabledPriority',
        '_children',
        '_leaf',
      ]);

    const newRow: Row = Object.keys(row).reduce((acc: any, cur: string) => {
      const obj = typeof acc === 'string' ? {} : acc;

      if (Object.keys(obj).length === 0) {
        if (c.includes(acc)) {
          obj[acc] = row[acc];
        }
      }

      if (c.includes(cur)) {
        obj[cur] = row[cur];
      }

      return obj;
    }) as unknown as Row;

    // for (const column of columns) {
    // newRow[column.] = row[column.name];
    emptyStringRemovedRows.push(newRow);
    //   }
  }

  return emptyStringRemovedRows;
};

describe('SaveGridData 함수 리팩터링, 추가,수정,삭제한 데이터 이력을 순서대로 저장합니다.', () => {
  test('IGridModifiedRows cloneDeep', () => {
    const saveData: IGridModifiedRows = cloneDeep({
      createdRows: [],
      updatedRows: [],
      deletedRows: [],
    });

    expect(saveData).toEqual({
      createdRows: [],
      updatedRows: [],
      deletedRows: [],
    });
  });

  test('columns 요소에 있는 alias 프로퍼티의 값은 name 프로퍼티의 값으로 변경된다', () => {
    const createdRow: Row = {
      alias: 'a',
      name: 'b',
      header: 'hi john',
      rowKey: 1,
      sortKey: 1,
      uniqueKey: 'a',
      rowSpanMap: {},
      _attributes: {
        rowNum: 1,
        checked: true,
        disabled: true,
        checkDisabled: false,
        className: { row: [], column: { a: ['a'] } },
      },
      _relationListItemMap: {},
      _disabledPriority: {},
    };
    const updatedRow: Row = {
      property_uuid: 'abcd-uuid',
      uuid: '',
      name: 'c',
      rowKey: 1,
      sortKey: 1,
      uniqueKey: 'a',
      rowSpanMap: {},
      _attributes: {
        rowNum: 1,
        checked: true,
        disabled: true,
        checkDisabled: false,
        className: { row: [], column: { a: ['a'] } },
      },
      _relationListItemMap: {},
      _disabledPriority: {},
    };

    const saveData: IGridModifiedRows = {
      createdRows: [createdRow],
      updatedRows: [updatedRow],
      deletedRows: [],
    };
    const columns: IGridColumn[] = [
      { alias: 'uuid', name: 'property_uuid', editor: 'text' },
    ];
    const newData: IGridModifiedRows = {
      createdRows: [],
      updatedRows: [],
      deletedRows: [],
    };

    for (const [key, value] of Object.entries<Row[] | RowKey[]>(saveData)) {
      newData[key] = replaceNamePropertyValueToAliasPropertyValue(
        value as Row[],
        columns,
      );
    }

    expect(newData).toEqual({
      createdRows: [
        {
          alias: 'a',
          name: 'b',
          header: 'hi john',
          rowKey: 1,
          sortKey: 1,
          uniqueKey: 'a',
          rowSpanMap: {},
          _attributes: {
            rowNum: 1,
            checked: true,
            disabled: true,
            checkDisabled: false,
            className: { row: [], column: { a: ['a'] } },
          },
          _relationListItemMap: {},
          _disabledPriority: {},
        },
      ],
      updatedRows: [
        {
          uuid: 'abcd-uuid',
          name: 'c',
          rowKey: 1,
          sortKey: 1,
          uniqueKey: 'a',
          rowSpanMap: {},
          _attributes: {
            rowNum: 1,
            checked: true,
            disabled: true,
            checkDisabled: false,
            className: { row: [], column: { a: ['a'] } },
          },
          _relationListItemMap: {},
          _disabledPriority: {},
        },
      ],
      deletedRows: [],
    });
  });

  test('빈 공백문자열을 허용하지 않는 컬럼의 프로퍼티 값이 제거된다', () => {
    const createdRow: Row = {
      alias: '',
      name: 'john',
      rowKey: 1,
      sortKey: 1,
      uniqueKey: 'a',
      rowSpanMap: {},
      _attributes: {
        rowNum: 1,
        checked: true,
        disabled: true,
        checkDisabled: false,
        className: { row: [], column: { a: ['a'] } },
      },
      _relationListItemMap: {},
      _disabledPriority: {},
    };

    const saveData: IGridModifiedRows = {
      createdRows: [createdRow],
      updatedRows: [],
      deletedRows: [],
    };

    const columns: IGridColumn[] = [
      {
        name: 'alias',
        disableStringEmpty: true,
        format: 'text',
      },
    ];
    const newData: IGridModifiedRows = {
      createdRows: [],
      updatedRows: [],
      deletedRows: [],
    };

    for (const [key, value] of Object.entries<Row[] | RowKey[]>(saveData)) {
      newData[key] = removeEmptyString(value as Row[], columns);
    }

    expect(newData).toEqual({
      createdRows: [
        {
          name: 'john',
          rowKey: 1,
          sortKey: 1,
          uniqueKey: 'a',
          rowSpanMap: {},
          _attributes: {
            rowNum: 1,
            checked: true,
            disabled: true,
            checkDisabled: false,
            className: { row: [], column: { a: ['a'] } },
          },
          _relationListItemMap: {},
          _disabledPriority: {},
        },
      ],
      updatedRows: [],
      deletedRows: [],
    });
  });
});
