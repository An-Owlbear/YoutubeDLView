import { styled, Tab, Tabs } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import SourceManager from '../components/SourceManager';
import TabContent from '../components/TabContent';
import UserManager from '../components/UserManager';
import { sessionAtom } from '../services/globalStore';

const Root = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  width: '100%'
}));

const ContentContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(1)
}));

const AdminPage: React.FC = () => {
  const [session,] = useAtom(sessionAtom);
  const [tabValue, setTabValue] = useState('Sources');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  if (!session || session.role !== 'Administrator') return <Redirect to="/" />;
  return (
    <Root>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Sources" value="Sources" />
        <Tab label="Users" value="Users" />
      </Tabs>
      <ContentContainer>
        <TabContent value={tabValue} index="Sources">
          <SourceManager />
        </TabContent>
        <TabContent value={tabValue} index="Users">
          <UserManager />
        </TabContent>
      </ContentContainer>
    </Root>
  );
};

export default AdminPage;