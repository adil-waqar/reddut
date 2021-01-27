import { useToast } from '@chakra-ui/react';
import { OperationResult } from 'urql';

const handleUnhandledRejections = (response: OperationResult) => {
  {
    const toast = useToast();
    toast({
      position: 'bottom',
      title: 'An error occured',
      description: response.error!.message,
      status: 'error',
      duration: 5000,
      isClosable: true
    });
  }
};

export default handleUnhandledRejections;
