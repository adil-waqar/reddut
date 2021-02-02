import { NextRouter } from 'next/router';

const getPostIdFromUrl = (router: NextRouter) => {
  const id =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  return id;
};

export default getPostIdFromUrl;
