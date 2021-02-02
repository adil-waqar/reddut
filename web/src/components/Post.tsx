import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  PostFragment,
  useDeletePostMutation,
  useMeQuery
} from '../generated/graphql';
import { DootSection } from './DootSection';

interface PostProps {
  post: PostFragment;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data }] = useMeQuery();
  const router = useRouter();
  return (
    <Flex p={5} shadow="md" borderWidth="1px" borderRadius="8px">
      <Box mr={4}>
        <DootSection postId={post.id} points={post.points} />
      </Box>
      <Box flex={1}>
        <NextLink href="/post/[id]" as={`/post/${post.id}`}>
          <Link>
            <Heading fontSize="xl">{post.title}</Heading>
          </Link>
        </NextLink>
        <Text fontSize="15px" color="grey">
          By {post.creator.username}
        </Text>
        <Flex align="center">
          <Text mt={5}>{post.textSnippet}</Text>
          {data?.me?.id === post.creator.id ? (
            <Flex ml="auto">
              <IconButton
                icon={<EditIcon />}
                aria-label="Edit a Post"
                onClick={() => {
                  router.push(`/post/edit/${post.id}`);
                }}
                mr={2}
                ml={2}
              />
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete a Post"
                onClick={async () => {
                  await deletePost({ id: post.id });
                }}
              />
            </Flex>
          ) : null}
        </Flex>
      </Box>
    </Flex>
  );
};

export default Post;
