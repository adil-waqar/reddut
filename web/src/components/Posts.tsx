import { Button } from '@chakra-ui/react';
import React from 'react';
import { Post as PostType, useGetPostsQuery } from '../generated/graphql';
import Post from './Post';

interface PostsProps {
  limit: number;
  cursor: string | null;
  isLastPage: boolean;
  onLoadMore: Function;
}

const Posts: React.FC<PostsProps> = ({
  limit,
  cursor,
  isLastPage,
  onLoadMore
}) => {
  const [{ data, fetching }] = useGetPostsQuery({
    variables: { limit, cursor }
  });
  return (
    <>
      {data?.posts?.posts?.map((post) => (
        <Post post={post} key={post.id} />
      ))}

      {data?.posts.hasMore && isLastPage ? (
        <Button
          isLoading={fetching}
          onClick={() => {
            // Getting the "createAt" field of the last post below
            const cursor = (data?.posts.posts as PostType[])[
              (data.posts.posts as PostType[]).length - 1
            ].createdAt;
            onLoadMore(cursor);
          }}
          colorScheme="teal"
          mb="25px"
        >
          Load More
        </Button>
      ) : null}
    </>
  );
};

export default Posts;
