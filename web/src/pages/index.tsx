import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { PostFragment, useGetPostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [posts, setPosts] = useState<PostFragment[]>([]);
  const [{ data }] = useGetPostsQuery({
    variables: {
      limit: 10,
      cursor: cursor ? cursor : null
    }
  });

  useEffect(() => {
    if (data) setPosts([...posts, ...data?.posts]);
  }, [data?.posts]);

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
        <Button
          onClick={() => {
            setCursor(data?.posts[data.posts.length - 1].createdAt);
          }}
          colorScheme="teal"
          mb="25px"
        >
          Load More
        </Button>
      </Stack>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
