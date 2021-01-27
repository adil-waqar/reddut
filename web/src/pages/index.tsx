import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
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
    if (data) setPosts([...posts, ...(data.posts.posts as Post[])]);
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
      <Stack spacing={6} mt="15px">
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
              // Getting the "createAt" field of the last post below
              const cursor = (data?.posts.posts as Post[])[
                (data.posts.posts as Post[]).length - 1
              ].createdAt;
              setCursor(cursor);
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
