import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { PostFragment, useGetPostsQuery } from '../generated/graphql';
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
    if (data) setPosts([...posts, ...data?.posts.posts]);
  }, [data?.posts.posts]);

  return (
    <Layout>
      <Heading>Posts</Heading>
      <Stack spacing={6} mt="20px">
        {posts.map((post) => {
          return (
            <Box
              key={post.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="8px"
            >
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          );
        })}
        {data?.posts.hasMore ? (
          <Button
            isLoading={fetching}
            onClick={() => {
              setCursor(
                data?.posts.posts[data.posts.posts.length - 1].createdAt
              );
            }}
            colorScheme="teal"
            mb="25px"
          >
            Load More
          </Button>
        ) : null}
      </Stack>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
