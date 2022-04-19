import React from 'react';

export const PgEquiInterfaceMonitor = () => {
    return (
        <>
            <div style={{width: '300px', backgroundColor: '#ffffff', border: 'none'}}>
                <div style={{display:'flex', justifyContent:'flex-start', height:'60px'}}>
                <span style={{fontSize: '15px', marginLeft:'15px', marginTop:'20px'}}>설비1</span>
                </div>
                <div style={{display: 'flex', justifyContent:'space-around'}}>
                <div style={{display: 'flex', justifyContent:'center', alignItems:'center', width: '70px', height:'70px', border: '1px solid #6ad198', borderRadius: '50%', backgroundColor: '#00af4e', color: '#ffffff'}}>55%</div>
                </div>
                <div style={{height:'70px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <span>가동 8.5h | 목표 12h</span>
                </div>
            </div>
            <div style={{width: '300px', backgroundColor: '#ffffff', border: 'none'}}>
                <div style={{display:'flex', justifyContent:'flex-start', height:'60px'}}>
                <span style={{fontSize: '15px', marginLeft:'15px', marginTop:'20px'}}>설비1</span>
                </div>
                <div style={{display: 'flex', justifyContent:'space-around'}}>
                <div style={{display: 'flex', justifyContent:'center', alignItems:'center', width: '70px', height:'70px', border: '1px solid #fee491', borderRadius: '50%', backgroundColor: '#fcc002', color: '#ffffff'}}>55%</div>
                </div>
                <div style={{height:'70px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <span>가동 8.5h | 목표 12h</span>
                </div>
            </div>
            <div style={{width: '300px', backgroundColor: '#ffffff', border: 'none'}}>
                <div style={{display:'flex', justifyContent:'flex-start', height:'60px'}}>
                <span style={{fontSize: '15px', marginLeft:'15px', marginTop:'20px'}}>설비1</span>
                </div>
                <div style={{display: 'flex', justifyContent:'space-around'}}>
                <div style={{display: 'flex', justifyContent:'center', alignItems:'center', width: '70px', height:'70px', border: '1px solid #fe9292', borderRadius: '50%', backgroundColor: '#fe0201', color: '#ffffff'}}>55%</div>
                </div>
                <div style={{height:'70px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <span>가동 8.5h | 목표 12h</span>
                </div>
            </div>
        </>
    )
}