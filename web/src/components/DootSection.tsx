import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useVotePostMutation } from '../generated/graphql';

interface DootSectionProps {
  points: number;
  postId: number;
}

export const DootSection: React.FC<DootSectionProps> = ({ points, postId }) => {
  const [, vote] = useVotePostMutation();
  const [loading, setLoading] = useState<
    'updoot-loading' | 'downdoot-loading' | 'no-loading'
  >('no-loading');
  return (
    <Flex flexDirection="column" alignItems="center">
      <Box>
        <IconButton
          onClick={async () => {
            setLoading('updoot-loading');
            await vote({ input: { postId, value: 1 } });
            setLoading('no-loading');
          }}
          isLoading={loading === 'updoot-loading'}
          aria-label="updoot post"
          icon={<ChevronUpIcon />}
        />
      </Box>
      <Box>{points}</Box>
      <Box>
        <IconButton
          onClick={async () => {
            setLoading('downdoot-loading');
            await vote({ input: { postId, value: -1 } });
            setLoading('no-loading');
          }}
          isLoading={loading === 'downdoot-loading'}
          aria-label="downdoot post"
          icon={<ChevronDownIcon />}
        />
      </Box>
    </Flex>
  );
};
