import { Box } from '@chakra-ui/react';
import React from 'react';

export type WrapperVariant = 'regular' | 'small';

interface WrapperProps {
  variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
  return (
    <Box
      mt="10px"
      mx="auto"
      maxWidth={variant === 'regular' ? '800px' : '400px'}
      w="100%"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
