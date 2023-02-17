import axios from 'axios';

export const tenantRequest = axios.create({
  baseURL: import.meta.env.VITE_TENANT_SERVER_URL,
  params: { tenant_cd: import.meta.env.VITE_NAJS_LOCAL_WEB_URL },
  responseType: 'json',
});
