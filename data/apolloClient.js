import ApolloClient, { addTypename } from 'apollo-client';

const client = new ApolloClient({
  queryTransformer: addTypename
});

export default client;
