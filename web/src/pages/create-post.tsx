import { Box, Button, Heading, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import InputField from '../components/InputField';
import { Layout } from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import useIsAuth from '../utils/useIsAuth';

const CreatePost: React.FC = () => {
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  const toast = useToast();
  const router = useRouter();

  return (
    <Layout variant="small">
      <Formik
        onSubmit={async (values) => {
          const response = await createPost({ input: values });
          if (!response.error) {
            toast({
              position: 'bottom',
              title: 'Success',
              description: 'Post created',
              status: 'success',
              duration: 5000,
              isClosable: true
            });
            router.push('/');
          }
        }}
        initialValues={{ title: '', text: '' }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <Heading textAlign="center">Create post</Heading>
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
                Create
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
