import gql from 'graphql-tag';

export const createUserMutation = gql`
  mutation createUser(
    $user: UserInput!
  ) {
    createUser(
      user: $user
    ) {
      id
    }
  }
`;

export const ignore = null;
