import React from "react";
import { useState, useLayoutEffect } from "react";
import { getData } from "~/functions";

/** 로그인 페이지 */
export const PgAuthentication = () => {

  const [tenantUuid, setTenantUuid] = useState<string>('');

  // constructor
  useLayoutEffect(() => {
    const webURL:string = window.location.hostname === 'localhost' ? 'najs.isos.kr' : window.location.hostname
    // const webURL:string = 'najs.i-so.kr'

    getData({tenant_cd: webURL.split('.')[0]},'/tenant/auth','raws',null, true, 'http://admin.was.kisos.net:3000/').then((res)=>{
      if(res.length > 0) {
        setTenantUuid(res[0]?.uuid)
      }
    })
  }, []);

  useLayoutEffect(() => {
    if(tenantUuid){
      sessionStorage.setItem(
        'tenantInfo',
        JSON.stringify({
          tenantUuid: tenantUuid
        })
      )
      window.location.href = "/login"
    }
  }, [tenantUuid]);

  return (
    <>
      사용자정보 받아오는중 ...
    </>
  );
}