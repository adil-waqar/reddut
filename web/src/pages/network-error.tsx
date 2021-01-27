import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle
} from '@chakra-ui/react';
import React from 'react';
import Wrapper from '../components/Wrapper';

export const NetworkError: React.FC = () => {
  return (
    <Wrapper variant="small">
      <Alert status="error" borderRadius="10px">
        <AlertIcon />
        <AlertTitle mr={2}>Network Error</AlertTitle>
        <AlertDescription>Cannot talk to the server :(</AlertDescription>
      </Alert>
    </Wrapper>
  );
};

export default NetworkError;
