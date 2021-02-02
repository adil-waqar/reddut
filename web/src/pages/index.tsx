import { Button, Flex, Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React from 'react';
import { Layout } from '../components/Layout';
import PaginatedPosts from '../components/PaginatedPosts';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  return (
    <Layout>
      <Flex align="center">
        <Heading>Posts</Heading>
        <NextLink href="create-post">
          <Button colorScheme="teal" ml="auto" size="sm">
            Create Post
          </Button>
        </NextLink>
      </Flex>
      <PaginatedPosts />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
