import { Button, Flex, Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import PaginatedPosts from '../components/PaginatedPosts';
import { Post, PostFragment, useGetPostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [posts, setPosts] = useState<PostFragment[]>([]);
  const [{ data, fetching }] = useGetPostsQuery({
    variables: {
      limit: 10,
      cursor: cursor ? cursor : null
    }
  });

  useEffect(() => {
    if (data) {
      setPosts([...(data.posts.posts as Post[])]);
    }
  }, [data?.posts.posts]);

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

export default withUrqlClient(createUrqlClient)(Index);
