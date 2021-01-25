import { Box, Button, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const toast = useToast();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else {
            toast({
              position: 'bottom',
              title: 'Account created.',
              description: "We've created your account for you.",
              status: 'success',
              duration: 5000,
              isClosable: true
            });
            router.push('/');
          }
        }}
        initialValues={{ username: '', email: '', password: '' }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                type="text"
                label="Username"
              />
              <Box mt="5px">
                <InputField
                  name="email"
                  placeholder="email"
                  type="email"
                  label="Email"
                />
              </Box>
              <Box mt="5px">
                <InputField
                  name="password"
                  placeholder="password"
                  type="password"
                  label="Password"
                />
              </Box>
              <Button
                isLoading={isSubmitting}
                mt="10px"
                type="submit"
                colorScheme="teal"
                isFullWidth
              >
                Register
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
