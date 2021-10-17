import React from 'react';

interface TabContentProps {
  value: unknown;
  index: unknown;
  children?: React.ReactNode
}

const TabContent: React.FC<TabContentProps> = (props: TabContentProps) => {
  if (props.value === props.index) return <>{props.children}</>;
  else return null;
};

export default TabContent;
