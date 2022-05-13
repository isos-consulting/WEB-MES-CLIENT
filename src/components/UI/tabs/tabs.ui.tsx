import React from 'react';
import { Tabs as AntTabs } from 'antd';
import Props from './tabs.ui.type';

/** 탭 UI */
const BaseTabs: React.FC<Props> = props => {
  return (
    <AntTabs
      defaultActiveKey={props.defaultActiveKey}
      onChange={props.onChange}
      type={props.type}
      tabPosition={props.tabPosition}
    >
      {props.panels?.map(pane => {
        return (
          <AntTabs.TabPane
            tab={pane.tab}
            key={pane.tabKey}
            disabled={pane.disabled}
            style={{ marginTop: -18 }}
          >
            {pane.content}
          </AntTabs.TabPane>
        );
      })}
    </AntTabs>
  );
};

const Tabs = React.memo(BaseTabs);

export default Tabs;
