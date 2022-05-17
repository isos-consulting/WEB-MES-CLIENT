/** 파이 그래프 스타일 컴포넌트 */
export const ScPieGraph = {
  root: {
    fontFamily: 'Noto Sans CJK KR',
    textAlign: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',

    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 25,
    color: '#000000',
    fontWeight: '600',
    top: -30,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  totalLabel: {
    fontSize: 14,
  },
};
