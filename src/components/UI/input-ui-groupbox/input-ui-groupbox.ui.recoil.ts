// import { selectorFamily } from "recoil";
// import { afAnyArrayState, afBooleanState, afDateState, afObjectArrayState, afObjectState, afStringArrayState, afStringState } from "~/recoils/recoil.atom-family";


// const sfInputUiGroupItems = selectorFamily<any, string>({
//   key: 'sfInputUiGroupItems',
//   get: (inputItems) => ({get}) => {
//     inputItems?.forEach(element => {
      
//     });
//   },
//   set: () => ({set, get}, newValues) => {
//     newValues?.forEach(({id, value}) => {
//       const recoilState = 
//         get(afStringState(id)) != null ? afStringState(id) :
//         get(afStringArrayState(id)) != null ? afStringArrayState(id) :
//         get(afAnyArrayState(id)) != null ? afAnyArrayState(id) :
//         get(afBooleanState(id)) != null ? afBooleanState(id) :
//         get(afDateState(id)) != null ? afDateState(id) :
//         get(afObjectState(id)) != null ? afObjectState(id) :
//         get(afObjectArrayState(id)) != null ? afObjectArrayState(id) :
//         null;

//       if (recoilState != null) {
//         set(recoilState, value);
//       }
//     });
//   },
// });