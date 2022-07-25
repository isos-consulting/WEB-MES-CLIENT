import React, { useState } from 'react';
import { Container, Datagrid, Searchbox } from '~/components/UI';
import { getData, getToday } from '~/functions';
import UserLoginHistory, {
  LoginHistoryApiResponse,
} from '~/models/user/login-history';

interface LoginHistoryRequestQueryString {
  user_id: string;
  user_nm: string;
  start_date: string;
  end_date: string;
}

interface defaultItem {
  readonly id: string;
  readonly type: string;
  readonly label: string;
  readonly default: string;
}

interface dateReangeItem extends defaultItem {
  readonly ids: string[];
  readonly defaults: string[];
}

const fetchLoginHistory = async ({
  user_id,
  user_nm,
  start_date,
  end_date,
}: LoginHistoryRequestQueryString): Promise<UserLoginHistory[]> => {
  const fetchHistoryStore = await getData<LoginHistoryApiResponse[]>(
    { user_id, start_date, end_date, user_nm },
    '/adm/login-log',
  );

  return fetchHistoryStore.map(history => new UserLoginHistory(history));
};

const store: {
  searchItems: (defaultItem | dateReangeItem)[];
  columns: { header: string; name: string }[];
} = {
  searchItems: [
    {
      id: 'login_date',
      type: 'daterange',
      label: '접속기간',
      ids: ['start_date', 'end_date'],
      default: '',
      defaults: [getToday(-7), getToday()],
    },
    {
      id: 'user_id',
      label: '사용자ID',
      type: 'text',
      default: '',
    },
    {
      id: 'user_nm',
      label: '사용자명',
      type: 'text',
      default: '',
    },
  ],
  columns: [
    {
      header: '사용자ID',
      name: 'userId',
    },
    {
      header: '사용자명',
      name: 'userName',
    },
    {
      header: '접속일시',
      name: 'accessDateTime',
    },
  ],
};

export const PgStdLoginHistory = () => {
  const [loginHistoryData, setHistory] = useState<UserLoginHistory[]>([]);

  return (
    <>
      <Searchbox
        id="searchbox"
        searchItems={store.searchItems}
        onSearch={async (values: LoginHistoryRequestQueryString) =>
          setHistory(await fetchLoginHistory(values))
        }
        boxShadow={false}
      />
      <Container>
        <Datagrid data={loginHistoryData} columns={store.columns} />
      </Container>
    </>
  );
};
