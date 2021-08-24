import { useAtom } from 'jotai';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { sessionAtom } from '../services/globalStore';

const MainPage: React.FC = () => {
  const [session,] = useAtom(sessionAtom);

  // Redirects user to login if not logged in, otherwise returns main page content
  if (!session) return <Redirect to="/login"/>;
  return (
    <div />
  );
};

export default MainPage;
