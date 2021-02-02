import { cacheExchange } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { dedupExchange, Exchange, fetchExchange } from 'urql';
import { pipe, tap } from 'wonka';
import {
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { isServerSideRendered } from './isServerSideRendered';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('not authenticated')) {
        Router.replace('/login');
      }
      if (error?.message.includes('Failed to fetch')) {
        Router.replace('/network-error');
      }
    })
  );
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = '';
  if (isServerSideRendered()) {
    cookie = ctx?.req?.headers?.cookie;
  }

  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include',
      headers: cookie
        ? {
            cookie
          }
        : undefined
    } as const,
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPost: () => null
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, _) => {
              cache.invalidate({
                __typename: 'Post',
                id: (args as DeletePostMutationVariables).id
              });
            },
            createPost: (_result, _, cache, __) => {
              cache.invalidate('Query', 'posts', {
                limit: 10
              });
            },
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
      errorExchange,
      ssrExchange,
      fetchExchange
    ]
  };
};
