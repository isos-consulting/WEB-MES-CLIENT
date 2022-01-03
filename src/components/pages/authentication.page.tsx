import React from "react";
import { useLayoutEffect } from "react";
import { getData } from "~/functions";

/** 로그인 페이지 */
export const PgAuthentication = (props: any) => {
  
  // constructor
  useLayoutEffect(() => {
    const webURL:string = ['localhost','191.1.70.130'].includes(window.location.hostname) ? 'isos.isos.kr' : window.location.hostname
    // const webURL:string = 'najs.i-so.kr'
    
    getData({tenant_cd: webURL.split('.')[0]},'/tenant/auth','raws',null, true, 'http://admin.was.kisos.net:3000/').then((res)=>{
      if(res.length > 0) {
        localStorage.setItem(
          'tenantInfo',
          JSON.stringify({
            tenantUuid: res[0]?.uuid
          })
        )
        props.setTenantUuid(res[0]?.uuid)
      }
    })
  }, []);

  return (
    <>
      사용자정보 받아오는중 ...
    </>
  );
}