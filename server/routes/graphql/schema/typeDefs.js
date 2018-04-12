const typeDefs = /* GraphQL */ `
  scalar Upload

  interface Node {
    id: ID!
  }

  type File implements Node {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Post implements Node {
    id: ID!
    title: String!
    description: String!
    author: Person!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type PostEdge {
    node: Post!
    cursor: ID!
  }

  type PostConnection {
    pageInfo: PageInfo
    edges: [PostEdge]
  }

  type PersonEdge {
    node: Person!
    cursor: ID!
  }

  type PersonConnection {
    pageInfo: PageInfo
    edges: [PersonEdge]
  }

  type JwtResponse {
    token: String
    user: Person
  }

  type Person implements Node {
    id: ID!
    name: String!
    posts: [Post]
  }

  type Query {
    uploads: [File]
    posts(
      first: Int = 10
      after: String
      last: Int
      before: String
    ): PostConnection
    post(id: ID!): Post
    user(id: ID!): Person
    users(
      first: Int = 10
      after: String
      last: Int
      before: String
    ): PersonConnection
  }

  type Mutation {
    signOnJwt(email: String, password: String): JwtResponse
    signOn(email: String, password: String): Person
    singleUpload(file: Upload!): File!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

export default typeDefs;
