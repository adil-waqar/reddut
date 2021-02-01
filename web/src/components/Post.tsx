import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { PostFragment } from '../generated/graphql';
import { DootSection } from './DootSection';

interface PostProps {
  post: PostFragment;
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <Flex key={post.id} p={5} shadow="md" borderWidth="1px" borderRadius="8px">
      <Box mr={2}>
        <DootSection postId={post.id} points={post.points} />
      </Box>
      <Box>
        <Heading fontSize="xl">{post.title}</Heading>
        <Text fontSize="15px" color="grey">
          By {post.creator.username}
        </Text>
        <Text mt={5}>{post.textSnippet}</Text>
      </Box>
    </Flex>
  );
};

export default Post;
