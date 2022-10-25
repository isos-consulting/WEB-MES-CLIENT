import { TabsProps, TabPaneProps } from 'antd';
import React from 'react';

/** 탭 속성 인터페이스 */
export default interface ITabsProps extends TabsProps {
  panels: ITabsPane[];
}

/** 탭 판넬 속성 인터페이스 */
interface ITabsPane extends TabPaneProps {
  content: React.ReactNode;
}
