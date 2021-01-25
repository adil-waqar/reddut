import { withUrqlClient } from 'next-urql';
import React from 'react';
import { Navbar } from '../components/Navbar';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  return <Navbar />;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
