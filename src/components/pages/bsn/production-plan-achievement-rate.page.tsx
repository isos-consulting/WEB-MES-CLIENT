import React from 'react';
import {
  BarGraph,
  Container,
  Datagrid,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { getToday } from '~/functions';

const data = [
  {
    rt: '공정1',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
    c1: (Math.random() * 100).toFixed(2),
    c2: (Math.random() * 100).toFixed(2),
    c3: (Math.random() * 100).toFixed(2),
    c4: (Math.random() * 100).toFixed(2),
    c5: (Math.random() * 100).toFixed(2),
    c6: (Math.random() * 100).toFixed(2),
    c7: (Math.random() * 100).toFixed(2),
    c8: (Math.random() * 100).toFixed(2),
    c9: (Math.random() * 100).toFixed(2),
    c10: (Math.random() * 100).toFixed(2),
    c11: (Math.random() * 100).toFixed(2),
    c12: (Math.random() * 100).toFixed(2),
    a1: (Math.random() * 100).toFixed(2),
    a2: (Math.random() * 100).toFixed(2),
    a3: (Math.random() * 100).toFixed(2),
    a4: (Math.random() * 100).toFixed(2),
    a5: (Math.random() * 100).toFixed(2),
    a6: (Math.random() * 100).toFixed(2),
    a7: (Math.random() * 100).toFixed(2),
    a8: (Math.random() * 100).toFixed(2),
    a9: (Math.random() * 100).toFixed(2),
    a10: (Math.random() * 100).toFixed(2),
    a11: (Math.random() * 100).toFixed(2),
    a12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: '공정2',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
    c1: (Math.random() * 100).toFixed(2),
    c2: (Math.random() * 100).toFixed(2),
    c3: (Math.random() * 100).toFixed(2),
    c4: (Math.random() * 100).toFixed(2),
    c5: (Math.random() * 100).toFixed(2),
    c6: (Math.random() * 100).toFixed(2),
    c7: (Math.random() * 100).toFixed(2),
    c8: (Math.random() * 100).toFixed(2),
    c9: (Math.random() * 100).toFixed(2),
    c10: (Math.random() * 100).toFixed(2),
    c11: (Math.random() * 100).toFixed(2),
    c12: (Math.random() * 100).toFixed(2),
    a1: (Math.random() * 100).toFixed(2),
    a2: (Math.random() * 100).toFixed(2),
    a3: (Math.random() * 100).toFixed(2),
    a4: (Math.random() * 100).toFixed(2),
    a5: (Math.random() * 100).toFixed(2),
    a6: (Math.random() * 100).toFixed(2),
    a7: (Math.random() * 100).toFixed(2),
    a8: (Math.random() * 100).toFixed(2),
    a9: (Math.random() * 100).toFixed(2),
    a10: (Math.random() * 100).toFixed(2),
    a11: (Math.random() * 100).toFixed(2),
    a12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: '공정3',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
    c1: (Math.random() * 100).toFixed(2),
    c2: (Math.random() * 100).toFixed(2),
    c3: (Math.random() * 100).toFixed(2),
    c4: (Math.random() * 100).toFixed(2),
    c5: (Math.random() * 100).toFixed(2),
    c6: (Math.random() * 100).toFixed(2),
    c7: (Math.random() * 100).toFixed(2),
    c8: (Math.random() * 100).toFixed(2),
    c9: (Math.random() * 100).toFixed(2),
    c10: (Math.random() * 100).toFixed(2),
    c11: (Math.random() * 100).toFixed(2),
    c12: (Math.random() * 100).toFixed(2),
    a1: (Math.random() * 100).toFixed(2),
    a2: (Math.random() * 100).toFixed(2),
    a3: (Math.random() * 100).toFixed(2),
    a4: (Math.random() * 100).toFixed(2),
    a5: (Math.random() * 100).toFixed(2),
    a6: (Math.random() * 100).toFixed(2),
    a7: (Math.random() * 100).toFixed(2),
    a8: (Math.random() * 100).toFixed(2),
    a9: (Math.random() * 100).toFixed(2),
    a10: (Math.random() * 100).toFixed(2),
    a11: (Math.random() * 100).toFixed(2),
    a12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: '공정90',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
    c1: (Math.random() * 100).toFixed(2),
    c2: (Math.random() * 100).toFixed(2),
    c3: (Math.random() * 100).toFixed(2),
    c4: (Math.random() * 100).toFixed(2),
    c5: (Math.random() * 100).toFixed(2),
    c6: (Math.random() * 100).toFixed(2),
    c7: (Math.random() * 100).toFixed(2),
    c8: (Math.random() * 100).toFixed(2),
    c9: (Math.random() * 100).toFixed(2),
    c10: (Math.random() * 100).toFixed(2),
    c11: (Math.random() * 100).toFixed(2),
    c12: (Math.random() * 100).toFixed(2),
    a1: (Math.random() * 100).toFixed(2),
    a2: (Math.random() * 100).toFixed(2),
    a3: (Math.random() * 100).toFixed(2),
    a4: (Math.random() * 100).toFixed(2),
    a5: (Math.random() * 100).toFixed(2),
    a6: (Math.random() * 100).toFixed(2),
    a7: (Math.random() * 100).toFixed(2),
    a8: (Math.random() * 100).toFixed(2),
    a9: (Math.random() * 100).toFixed(2),
    a10: (Math.random() * 100).toFixed(2),
    a11: (Math.random() * 100).toFixed(2),
    a12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: '공정90',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
    c1: (Math.random() * 100).toFixed(2),
    c2: (Math.random() * 100).toFixed(2),
    c3: (Math.random() * 100).toFixed(2),
    c4: (Math.random() * 100).toFixed(2),
    c5: (Math.random() * 100).toFixed(2),
    c6: (Math.random() * 100).toFixed(2),
    c7: (Math.random() * 100).toFixed(2),
    c8: (Math.random() * 100).toFixed(2),
    c9: (Math.random() * 100).toFixed(2),
    c10: (Math.random() * 100).toFixed(2),
    c11: (Math.random() * 100).toFixed(2),
    c12: (Math.random() * 100).toFixed(2),
    a1: (Math.random() * 100).toFixed(2),
    a2: (Math.random() * 100).toFixed(2),
    a3: (Math.random() * 100).toFixed(2),
    a4: (Math.random() * 100).toFixed(2),
    a5: (Math.random() * 100).toFixed(2),
    a6: (Math.random() * 100).toFixed(2),
    a7: (Math.random() * 100).toFixed(2),
    a8: (Math.random() * 100).toFixed(2),
    a9: (Math.random() * 100).toFixed(2),
    a10: (Math.random() * 100).toFixed(2),
    a11: (Math.random() * 100).toFixed(2),
    a12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: '공정90',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
    c1: (Math.random() * 100).toFixed(2),
    c2: (Math.random() * 100).toFixed(2),
    c3: (Math.random() * 100).toFixed(2),
    c4: (Math.random() * 100).toFixed(2),
    c5: (Math.random() * 100).toFixed(2),
    c6: (Math.random() * 100).toFixed(2),
    c7: (Math.random() * 100).toFixed(2),
    c8: (Math.random() * 100).toFixed(2),
    c9: (Math.random() * 100).toFixed(2),
    c10: (Math.random() * 100).toFixed(2),
    c11: (Math.random() * 100).toFixed(2),
    c12: (Math.random() * 100).toFixed(2),
    a1: (Math.random() * 100).toFixed(2),
    a2: (Math.random() * 100).toFixed(2),
    a3: (Math.random() * 100).toFixed(2),
    a4: (Math.random() * 100).toFixed(2),
    a5: (Math.random() * 100).toFixed(2),
    a6: (Math.random() * 100).toFixed(2),
    a7: (Math.random() * 100).toFixed(2),
    a8: (Math.random() * 100).toFixed(2),
    a9: (Math.random() * 100).toFixed(2),
    a10: (Math.random() * 100).toFixed(2),
    a11: (Math.random() * 100).toFixed(2),
    a12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: '공정90',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
    c1: (Math.random() * 100).toFixed(2),
    c2: (Math.random() * 100).toFixed(2),
    c3: (Math.random() * 100).toFixed(2),
    c4: (Math.random() * 100).toFixed(2),
    c5: (Math.random() * 100).toFixed(2),
    c6: (Math.random() * 100).toFixed(2),
    c7: (Math.random() * 100).toFixed(2),
    c8: (Math.random() * 100).toFixed(2),
    c9: (Math.random() * 100).toFixed(2),
    c10: (Math.random() * 100).toFixed(2),
    c11: (Math.random() * 100).toFixed(2),
    c12: (Math.random() * 100).toFixed(2),
    a1: (Math.random() * 100).toFixed(2),
    a2: (Math.random() * 100).toFixed(2),
    a3: (Math.random() * 100).toFixed(2),
    a4: (Math.random() * 100).toFixed(2),
    a5: (Math.random() * 100).toFixed(2),
    a6: (Math.random() * 100).toFixed(2),
    a7: (Math.random() * 100).toFixed(2),
    a8: (Math.random() * 100).toFixed(2),
    a9: (Math.random() * 100).toFixed(2),
    a10: (Math.random() * 100).toFixed(2),
    a11: (Math.random() * 100).toFixed(2),
    a12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: '공정90',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
    c1: (Math.random() * 100).toFixed(2),
    c2: (Math.random() * 100).toFixed(2),
    c3: (Math.random() * 100).toFixed(2),
    c4: (Math.random() * 100).toFixed(2),
    c5: (Math.random() * 100).toFixed(2),
    c6: (Math.random() * 100).toFixed(2),
    c7: (Math.random() * 100).toFixed(2),
    c8: (Math.random() * 100).toFixed(2),
    c9: (Math.random() * 100).toFixed(2),
    c10: (Math.random() * 100).toFixed(2),
    c11: (Math.random() * 100).toFixed(2),
    c12: (Math.random() * 100).toFixed(2),
    a1: (Math.random() * 100).toFixed(2),
    a2: (Math.random() * 100).toFixed(2),
    a3: (Math.random() * 100).toFixed(2),
    a4: (Math.random() * 100).toFixed(2),
    a5: (Math.random() * 100).toFixed(2),
    a6: (Math.random() * 100).toFixed(2),
    a7: (Math.random() * 100).toFixed(2),
    a8: (Math.random() * 100).toFixed(2),
    a9: (Math.random() * 100).toFixed(2),
    a10: (Math.random() * 100).toFixed(2),
    a11: (Math.random() * 100).toFixed(2),
    a12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: '공정90',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
    c1: (Math.random() * 100).toFixed(2),
    c2: (Math.random() * 100).toFixed(2),
    c3: (Math.random() * 100).toFixed(2),
    c4: (Math.random() * 100).toFixed(2),
    c5: (Math.random() * 100).toFixed(2),
    c6: (Math.random() * 100).toFixed(2),
    c7: (Math.random() * 100).toFixed(2),
    c8: (Math.random() * 100).toFixed(2),
    c9: (Math.random() * 100).toFixed(2),
    c10: (Math.random() * 100).toFixed(2),
    c11: (Math.random() * 100).toFixed(2),
    c12: (Math.random() * 100).toFixed(2),
    a1: (Math.random() * 100).toFixed(2),
    a2: (Math.random() * 100).toFixed(2),
    a3: (Math.random() * 100).toFixed(2),
    a4: (Math.random() * 100).toFixed(2),
    a5: (Math.random() * 100).toFixed(2),
    a6: (Math.random() * 100).toFixed(2),
    a7: (Math.random() * 100).toFixed(2),
    a8: (Math.random() * 100).toFixed(2),
    a9: (Math.random() * 100).toFixed(2),
    a10: (Math.random() * 100).toFixed(2),
    a11: (Math.random() * 100).toFixed(2),
    a12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: '공정10',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
    c1: (Math.random() * 100).toFixed(2),
    c2: (Math.random() * 100).toFixed(2),
    c3: (Math.random() * 100).toFixed(2),
    c4: (Math.random() * 100).toFixed(2),
    c5: (Math.random() * 100).toFixed(2),
    c6: (Math.random() * 100).toFixed(2),
    c7: (Math.random() * 100).toFixed(2),
    c8: (Math.random() * 100).toFixed(2),
    c9: (Math.random() * 100).toFixed(2),
    c10: (Math.random() * 100).toFixed(2),
    c11: (Math.random() * 100).toFixed(2),
    c12: (Math.random() * 100).toFixed(2),
    a1: (Math.random() * 100).toFixed(2),
    a2: (Math.random() * 100).toFixed(2),
    a3: (Math.random() * 100).toFixed(2),
    a4: (Math.random() * 100).toFixed(2),
    a5: (Math.random() * 100).toFixed(2),
    a6: (Math.random() * 100).toFixed(2),
    a7: (Math.random() * 100).toFixed(2),
    a8: (Math.random() * 100).toFixed(2),
    a9: (Math.random() * 100).toFixed(2),
    a10: (Math.random() * 100).toFixed(2),
    a11: (Math.random() * 100).toFixed(2),
    a12: (Math.random() * 100).toFixed(2),
  },
];

const columns = [];
const complexColumns = [];
const headers = ['지시', '생산', '달성'];

columns.push({ header: '공정', name: 'rt' });

for (let i = 0; i < 12; i++) {
  for (let j = 0; j < headers.length; j++) {
    columns.push({
      header: headers[j],
      name: `${j === 0 ? 'o' : j === 1 ? 'c' : 'a'}${i + 1}`,
    });
  }

  complexColumns.push({
    header: `${i + 1}월`,
    name: `m${i + 1}`,
    childNames: [`o${i + 1}`, `c${i + 1}`, `a${i + 1}`],
  });
}

const summaryData = [...data].reduce((acc, cur, idx) => {
  const c = idx === 1 ? { ...acc } : acc;

  c.o1 = (Number(c.o1) + Number(cur.o1)).toFixed(2);
  c.o2 = (Number(c.o2) + Number(cur.o2)).toFixed(2);
  c.o3 = (Number(c.o3) + Number(cur.o3)).toFixed(2);
  c.o4 = (Number(c.o4) + Number(cur.o4)).toFixed(2);
  c.o5 = (Number(c.o5) + Number(cur.o5)).toFixed(2);
  c.o6 = (Number(c.o6) + Number(cur.o6)).toFixed(2);
  c.o7 = (Number(c.o7) + Number(cur.o7)).toFixed(2);
  c.o8 = (Number(c.o8) + Number(cur.o8)).toFixed(2);
  c.o9 = (Number(c.o9) + Number(cur.o9)).toFixed(2);
  c.o10 = (Number(c.o10) + Number(cur.o10)).toFixed(2);
  c.o11 = (Number(c.o11) + Number(cur.o11)).toFixed(2);
  c.o12 = (Number(c.o12) + Number(cur.o12)).toFixed(2);
  c.c1 = (Number(c.c1) + Number(cur.c1)).toFixed(2);
  c.c2 = (Number(c.c2) + Number(cur.c2)).toFixed(2);
  c.c3 = (Number(c.c3) + Number(cur.c3)).toFixed(2);
  c.c4 = (Number(c.c4) + Number(cur.c4)).toFixed(2);
  c.c5 = (Number(c.c5) + Number(cur.c5)).toFixed(2);
  c.c6 = (Number(c.c6) + Number(cur.c6)).toFixed(2);
  c.c7 = (Number(c.c7) + Number(cur.c7)).toFixed(2);
  c.c8 = (Number(c.c8) + Number(cur.c8)).toFixed(2);
  c.c9 = (Number(c.c9) + Number(cur.c9)).toFixed(2);
  c.c10 = (Number(c.c10) + Number(cur.c10)).toFixed(2);
  c.c11 = (Number(c.c11) + Number(cur.c11)).toFixed(2);
  c.c12 = (Number(c.c12) + Number(cur.c12)).toFixed(2);
  c.a1 = (Number(c.a1) + Number(cur.a1)).toFixed(2);
  c.a2 = (Number(c.a2) + Number(cur.a2)).toFixed(2);
  c.a3 = (Number(c.a3) + Number(cur.a3)).toFixed(2);
  c.a4 = (Number(c.a4) + Number(cur.a4)).toFixed(2);
  c.a5 = (Number(c.a5) + Number(cur.a5)).toFixed(2);
  c.a6 = (Number(c.a6) + Number(cur.a6)).toFixed(2);
  c.a7 = (Number(c.a7) + Number(cur.a7)).toFixed(2);
  c.a8 = (Number(c.a8) + Number(cur.a8)).toFixed(2);
  c.a9 = (Number(c.a9) + Number(cur.a9)).toFixed(2);
  c.a10 = (Number(c.a10) + Number(cur.a10)).toFixed(2);
  c.a11 = (Number(c.a11) + Number(cur.a11)).toFixed(2);
  c.a12 = (Number(c.a12) + Number(cur.a12)).toFixed(2);

  return c;
});

console.log(summaryData);

export const PgProductionPlanAchievementRateReport = () => {
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_reg_date', 'end_reg_date'],
      defaults: [getToday(-7), getToday()],
      label: '생산 기간',
    },
  ]);

  const barGraphProps = {
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: '생산계획달성율',
        },
      },
    },
    data: {
      labels: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
      datasets: [
        {
          label: '지시',
          data: Object.keys(summaryData)
            .filter(key => key.includes('o'))
            .map(key =>
              Number.parseFloat(
                Number(summaryData[key] / data.length - 1).toFixed(2),
              ),
            ),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: '생산',
          data: Object.keys(summaryData)
            .filter(key => key.includes('c'))
            .map(key =>
              Number.parseFloat(
                Number(summaryData[key] / data.length - 1).toFixed(2),
              ),
            ),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    },
  };

  return (
    <>
      <Searchbox
        searchItems={searchInfo.searchItems}
        innerRef={searchInfo.props.innerRef}
        onSearch={() => {}}
      />
      <Container>
        <BarGraph {...barGraphProps} />
      </Container>
      <Container>
        <Datagrid
          data={[...data]}
          columns={[...columns]}
          header={{
            complexColumns: [...complexColumns],
          }}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
