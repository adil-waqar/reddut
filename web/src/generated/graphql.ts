import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  posts: PaginatedPost;
  post?: Maybe<Post>;
  me?: Maybe<User>;
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};

export type PaginatedPost = {
  __typename?: 'PaginatedPost';
  posts?: Maybe<Array<Post>>;
  errors?: Maybe<Array<Error>>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  text: Scalars['String'];
  points: Scalars['Float'];
  creatorId: Scalars['Float'];
  textSnippet: Scalars['String'];
  creator: User;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
};

export type Error = {
  __typename?: 'Error';
  field?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  vote: PostResponse;
  createPost: PostResponse;
  updatePost?: Maybe<PostResponse>;
  deletePost: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationVoteArgs = {
  input: VoteInput;
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationUpdatePostArgs = {
  input?: Maybe<EditPostInput>;
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationLoginArgs = {
  options: LoginInput;
};

export type PostResponse = {
  __typename?: 'PostResponse';
  post?: Maybe<Post>;
  errors?: Maybe<Array<Error>>;
};

export type VoteInput = {
  postId: Scalars['Float'];
  value: Scalars['Float'];
};

export type PostInput = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type EditPostInput = {
  id: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<User>;
  errors?: Maybe<Array<Error>>;
};

export type RegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type _UserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'email'>
);

export type ErrorFragment = (
  { __typename?: 'Error' }
  & Pick<Error, 'field' | 'message'>
);

export type PostFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'title' | 'textSnippet' | 'createdAt' | 'points'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars['String'];
  token: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'Error' }
      & Pick<Error, 'field' | 'message'>
    )>> }
  ) }
);

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'PostResponse' }
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'title' | 'text'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'Error' }
      & ErrorFragment
    )>> }
  ) }
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  options: LoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & _UserFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'Error' }
      & ErrorFragment
    )>> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: RegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & _UserFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'Error' }
      & ErrorFragment
    )>> }
  ) }
);

export type UpdatePostMutationVariables = Exact<{
  input: EditPostInput;
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost?: Maybe<(
    { __typename?: 'PostResponse' }
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'title' | 'textSnippet' | 'text'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'Error' }
      & ErrorFragment
    )>> }
  )> }
);

export type VotePostMutationVariables = Exact<{
  input: VoteInput;
}>;


export type VotePostMutation = (
  { __typename?: 'Mutation' }
  & { vote: (
    { __typename?: 'PostResponse' }
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'title' | 'text' | 'points'>
    )> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & _UserFragment
  )> }
);

export type GetPostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetPostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'text' | 'createdAt' | 'points'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type GetPostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type GetPostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPost' }
    & Pick<PaginatedPost, 'hasMore'>
    & { posts?: Maybe<Array<(
      { __typename?: 'Post' }
      & PostFragment
    )>>, errors?: Maybe<Array<(
      { __typename?: 'Error' }
      & ErrorFragment
    )>> }
  ) }
);

export const _UserFragmentDoc = gql`
    fragment _user on User {
  id
  username
  email
}
    `;
export const ErrorFragmentDoc = gql`
    fragment error on Error {
  field
  message
}
    `;
export const PostFragmentDoc = gql`
    fragment post on Post {
  id
  title
  textSnippet
  createdAt
  points
  creator {
    id
    username
  }
}
    `;
export const ChangePasswordDocument = gql`
    mutation changePassword($password: String!, $token: String!) {
  changePassword(password: $password, token: $token) {
    errors {
      field
      message
    }
  }
}
    `;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePostDocument = gql`
    mutation createPost($input: PostInput!) {
  createPost(input: $input) {
    post {
      id
      title
      text
    }
    errors {
      ...error
    }
  }
}
    ${ErrorFragmentDoc}`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation deletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation forgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation login($options: LoginInput!) {
  login(options: $options) {
    user {
      ..._user
    }
    errors {
      ...error
    }
  }
}
    ${_UserFragmentDoc}
${ErrorFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation register($options: RegisterInput!) {
  register(options: $options) {
    user {
      ..._user
    }
    errors {
      ...error
    }
  }
}
    ${_UserFragmentDoc}
${ErrorFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdatePostDocument = gql`
    mutation updatePost($input: EditPostInput!) {
  updatePost(input: $input) {
    post {
      id
      title
      textSnippet
      text
    }
    errors {
      ...error
    }
  }
}
    ${ErrorFragmentDoc}`;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VotePostDocument = gql`
    mutation votePost($input: VoteInput!) {
  vote(input: $input) {
    post {
      id
      title
      text
      points
    }
  }
}
    `;

export function useVotePostMutation() {
  return Urql.useMutation<VotePostMutation, VotePostMutationVariables>(VotePostDocument);
};
export const MeDocument = gql`
    query me {
  me {
    ..._user
  }
}
    ${_UserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const GetPostDocument = gql`
    query getPost($id: Int!) {
  post(id: $id) {
    id
    title
    text
    createdAt
    points
    creator {
      id
      username
    }
  }
}
    `;

export function useGetPostQuery(options: Omit<Urql.UseQueryArgs<GetPostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetPostQuery>({ query: GetPostDocument, ...options });
};
export const GetPostsDocument = gql`
    query getPosts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    posts {
      ...post
    }
    hasMore
    errors {
      ...error
    }
  }
}
    ${PostFragmentDoc}
${ErrorFragmentDoc}`;

export function useGetPostsQuery(options: Omit<Urql.UseQueryArgs<GetPostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetPostsQuery>({ query: GetPostsDocument, ...options });
};