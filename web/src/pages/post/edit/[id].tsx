import { Box, Button, Heading, Text, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import {
  useGetPostQuery,
  useUpdatePostMutation
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import getPostIdFromUrl from '../../../utils/getPostIdFromUrl';
import handleUnhandledRejections from '../../../utils/handleUnhandledRejections';
import { toErrorMap } from '../../../utils/toErrorMap';

const EditPost: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const id = getPostIdFromUrl(router);

  const [, editPost] = useUpdatePostMutation();
  const [{ data, fetching }] = useGetPostQuery({ variables: { id } });

  if (fetching) return <Text>Loading...</Text>;

  return (
    <Layout variant="small">
      <Formik
        onSubmit={async (values, { setErrors }) => {
          const response = await editPost({
            input: {
              id,
              ...values
            }
          });
          if (response.error) {
            handleUnhandledRejections(response);
            return;
          }
          if (!response.data?.updatePost?.errors) {
            toast({
              position: 'bottom',
              title: 'Success',
              description: 'Post updated',
              status: 'success',
              duration: 5000,
              isClosable: true
            });
            router.back();
          } else {
            setErrors(toErrorMap(response.data.updatePost.errors));
          }
        }}
        initialValues={{ title: data?.post?.title, text: data?.post?.text }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <Heading textAlign="center">Update post</Heading>
              <InputField
                name="title"
                placeholder="Type a title..."
                type="text"
                label="Title"
              />
              <Box mt="5px">
                <InputField
                  name="text"
                  placeholder="Type some text..."
                  label="Body"
                  type="text"
                  textarea
                />
              </Box>
              <Button
                isLoading={isSubmitting}
                mt="10px"
                type="submit"
                colorScheme="teal"
                isFullWidth
              >
                Update
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost);
