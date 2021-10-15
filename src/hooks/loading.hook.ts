import { atom, useRecoilState } from "recoil";

const atLoading = atom({
  key: 'atLoading',
  default: false
});

export const useLoadingState = ():[boolean, (value)=>void] => {
  const [loading, setLoading] = useRecoilState(atLoading);
  
  return [
    loading,
    setLoading
  ]
};