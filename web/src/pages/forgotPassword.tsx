import { Box, Button, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface forgotPasswordProps {}

const ForgotPassword: React.FC<forgotPasswordProps> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const toast = useToast();
  return (
    <Wrapper variant="small">
      <Formik
        onSubmit={async (values) => {
          const response = await forgotPassword(values);
          if (response.data?.forgotPassword) {
            toast({
              position: 'bottom',
              title: 'Success!',
              description:
                'A link has been sent to your email address, if you are a registered user',
              status: 'success',
              duration: 5000,
              isClosable: true
            });
          } else {
            toast({
              position: 'bottom',
              title: 'An error occurred',
              description:
                'Something went wrong while reseting password, please try later',
              status: 'error',
              duration: 5000,
              isClosable: true
            });
          }
        }}
        initialValues={{ email: '' }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <Box mb="5px">
                <InputField
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  label="Email"
                />
              </Box>
              <Button
                isLoading={isSubmitting}
                mt="10px"
                type="submit"
                colorScheme="teal"
                isFullWidth
              >
                Reset Password
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
