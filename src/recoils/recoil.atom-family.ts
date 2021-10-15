import {atomFamily, SerializableParam} from 'recoil';
import dayjs, {Dayjs} from 'dayjs';



export const afBooleanState = atomFamily<boolean, SerializableParam>({ 
  key: 'afBooleanState',
  default: false
});

export const afStringState = atomFamily<string, SerializableParam>({ 
  key: 'afStringState',
  default: ''
});

export const afStringArrayState = atomFamily<Array<string>, SerializableParam>({ 
  key: 'afStringArrayState',
  default: []
});

export const afDateState = atomFamily<Dayjs, SerializableParam>({ 
  key: 'afDateState',
  default: dayjs()
});

export const afObjectState = atomFamily<object, SerializableParam>({ 
  key: 'afObjectState',
  default: {}
});

export const afObjectArrayState = atomFamily<Array<object>, SerializableParam>({ 
  key: 'afObjectArrayState',
  default: []
});

export const afAnyArrayState = atomFamily<Array<string | number | boolean>, string>({
  key: 'afAnyArrayState',
  default: []
})