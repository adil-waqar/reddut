const getServerUrl = () => {
  return process.env.GRAPHQL_SERVER_URL
    ? process.env.GRAPHQL_SERVER_URL
    : process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL;
};

export default getServerUrl;
