import { Box, Button, Link, Text, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const [, login] = useLoginMutation();
  const toast = useToast();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else {
            toast({
              position: 'bottom',
              title: 'Success',
              description: "You've logged in",
              status: 'success',
              duration: 5000,
              isClosable: true
            });
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else router.push('/');
          }
        }}
        initialValues={{ usernameOrEmail: '', password: '' }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputField
                name="usernameOrEmail"
                placeholder="username or email"
                type="text"
                label="Username/Email"
              />
              <Box mt="5px">
                <InputField
                  name="password"
                  placeholder="password"
                  type="password"
                  label="Password"
                />
              </Box>
              <Text mt="5px">
                Forgot password? Click{' '}
                {
                  <NextLink href="/forgotPassword">
                    <Link fontWeight="500" href="#">
                      here
                    </Link>
                  </NextLink>
                }{' '}
                to reset
              </Text>
              <Button
                isLoading={isSubmitting}
                mt="10px"
                type="submit"
                colorScheme="teal"
                isFullWidth
              >
                Login
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
