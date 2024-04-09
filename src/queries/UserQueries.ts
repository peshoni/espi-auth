export const loginRequest = `
query Login($egn: String!,  $password: String) {
  users: login(args:{egn:$egn, pass: $password}){
    id
    name
    surname
    family 
    roleType{
      value
      description
    }
    secondRoleType{
      value
      description
    }
    voted
    eVoted
    votingSectionId
  } 
} 
`;
/**
 * Finds the user who matches all the submitted criteria
 */
export const findUser = `
query FindUser($egn: String!, $pin: String!, $email: String!) {
  users(
    where: {
      _and: [
        { egn: { _eq: $egn } }
        { pin: { _eq: $pin } }
        { email: { _eq: $email } }
      ]
    }
  ) {
    id
  }
}
`;
/**
 * Sets password onRegister call
 */
export const updateUserPassword = `
mutation UpdateUserPassword ($id:Int!, $password:String){
  update_users_by_pk(pk_columns:{id:$id},_set:{password:$password}) {
    id
  }
}
`;

export const findUserById = `
query GetUserById($userId:Int!) {
  users_by_pk(id:$userId){
    id
    name
    surname
    family 
    roleType{
      value
      description
    }
    secondRoleType{
      value
      description
    }
    voted
    eVoted
  }
}
`;
