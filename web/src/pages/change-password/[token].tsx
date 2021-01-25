import { Box, Button, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { token } = router.query;
  const [, changePassword] = useChangePasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            password: values.password,
            token: token as string
          });
          const errors = response.data?.changePassword.errors;
          if (errors) {
            // For field errors
            setErrors(toErrorMap(errors));
            // For generic errors
            errors.forEach((error) => {
              if (!error.field) {
                toast({
                  position: 'bottom',
                  title: 'An error occurred',
                  description: error.message,
                  status: 'error',
                  duration: 5000,
                  isClosable: true
                });
              }
            });
          } else {
            toast({
              position: 'bottom',
              title: 'Success!',
              description: 'Your password has been reset, try logging in now',
              status: 'success',
              duration: 5000,
              isClosable: true
            });
            router.push('/login');
          }
        }}
        initialValues={{ password: '' }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <Box mb="5px">
                <InputField
                  name="password"
                  placeholder="New Password"
                  type="password"
                  label="New Password"
                />
              </Box>
              <Button
                isLoading={isSubmitting}
                mt="10px"
                type="submit"
                colorScheme="teal"
                isFullWidth
              >
                Change password
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
