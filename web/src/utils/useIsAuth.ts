import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

const useIsAuth = () => {
  const [{ fetching, data }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.push('/login?next=' + router.pathname);
    }
  }, [fetching, data, router]);
};

export default useIsAuth;
