import React, { useState } from 'react';
import { Container, Datagrid, Searchbox } from '~/components/UI';
import { getData, getToday } from '~/functions';

interface LoginHistoryRequestQueryString {
  userId: string;
  start_date: string;
  end_date: string;
}

interface LoginHistoryApiResponse {
  user_id: string;
  user_nm: string;
  logged_at: string;
}

class UserLoginHistory {
  private readonly userId: string;
  private readonly userName: string;
  private readonly accessDateTime: string;

  constructor({ user_id, user_nm, logged_at }: LoginHistoryApiResponse) {
    this.userId = user_id;
    this.userName = user_nm;
    this.accessDateTime = logged_at;
  }

  info(): LoginHistoryApiResponse {
    return {
      user_id: this.userId,
      user_nm: this.userName,
      logged_at: this.accessDateTime,
    };
  }
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
  userId,
  start_date,
  end_date,
}: LoginHistoryRequestQueryString): Promise<UserLoginHistory[]> => {
  const fetchHistoryStore = await getData<LoginHistoryApiResponse[]>(
    [{ userId: userId, start_date: start_date, end_date: end_date }],
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
      id: 'userId',
      label: '사용자ID',
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
