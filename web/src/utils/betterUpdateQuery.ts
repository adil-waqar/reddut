import { Cache, QueryInput } from '@urql/exchange-graphcache';

/*
Result --> ResultType (E.g LoginMutationType)
Query --> QueryType (E.g MeQueryType)
qi --> The actual query itself (Document) , not the type
fn => 
*/
export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
