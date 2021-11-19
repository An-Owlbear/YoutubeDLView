import { styled, Tab, Tabs } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import GeneralAdminSettings from '../components/GeneralAdminSettings';
import SourceManager from '../components/SourceManager';
import TabContent from '../components/TabContent';
import UserManager from '../components/UserManager';
import { sessionAtom } from '../services/globalStore';

const Root = styled('div')(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '& > *': {
    width: '100%'
  }
}));

const StyledTabs = styled(Tabs)(() => ({
  maxWidth: '600px'
}));

const Divider = styled('div')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3)
}));

const ContentContainer = styled('div')(() => ({
  maxWidth: '600px'
}));

const AdminPage: React.FC = () => {
  const [session,] = useAtom(sessionAtom);
  const [tabValue, setTabValue] = useState('General');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  if (!session || session.role !== 'Administrator') return <Navigate to="/" />;
  return (
    <Root>
      <StyledTabs value={tabValue} onChange={handleTabChange}>
        <Tab label="General" value="General" />
        <Tab label="Sources" value="Sources" />
        <Tab label="Users" value="Users" />
      </StyledTabs>
      <Divider />
      <ContentContainer>
        <TabContent value={tabValue} index="General">
          <GeneralAdminSettings />
        </TabContent>
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