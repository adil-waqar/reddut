import { Heading, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/Layout';
import { useGetPostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import getPostIdFromUrl from '../../utils/getPostIdFromUrl';

const Post: React.FC = () => {
  const router = useRouter();
  const id = getPostIdFromUrl(router);

  const [{ data }] = useGetPostQuery({
    variables: { id: id ? id : -1 }
  });
  return (
    <Layout>
      <Heading>{data?.post?.title}</Heading>
      <Text mt={2}>{data?.post?.text}</Text>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
