import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from 'urql';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  } as const,
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, _, cache, __) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (mutationResult, queryResult) => {
                if (mutationResult.login.errors) return queryResult;
                else return { me: mutationResult.login.user };
              }
            );
          },
          register: (_result, _, cache, __) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (mutationResult, queryResult) => {
                if (mutationResult.register.errors) return queryResult;
                else return { me: mutationResult.register.user };
              }
            );
          },
          logout: (_result, _, cache, __) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (mutationResult, queryResult) => {
                if (mutationResult.logout)
                  return {
                    me: null
                  };
                return { me: queryResult.me };
              }
            );
          }
        }
      }
    }),
    ssrExchange,
    fetchExchange
  ]
});
