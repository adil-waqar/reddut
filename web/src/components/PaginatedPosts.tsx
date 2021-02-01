import { Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import Posts from './Posts';

type PageVariables = {
  limit: number;
  cursor: string | null;
}[];

const PAGINATION_LIMIT = 10;

const PaginatedPosts: React.FC = () => {
  const [pageVariables, setPageVariables] = useState<PageVariables>([
    { limit: PAGINATION_LIMIT, cursor: null }
  ]);
  return (
    <Stack spacing={6} mt="15px">
      {pageVariables.map((pageVariable, i) => (
        <Posts
          key={'' + pageVariable.cursor}
          cursor={pageVariable.cursor}
          limit={pageVariable.limit}
          isLastPage={i === pageVariables.length - 1}
          onLoadMore={(cursor: string | null) =>
            setPageVariables([
              ...pageVariables,
              { limit: PAGINATION_LIMIT, cursor }
            ])
          }
        />
      ))}
    </Stack>
  );
};

export default PaginatedPosts;
