import gql from './gql';

const typeDefs = /* GraphQL */ gql`
  directive @lower on FIELD_DEFINITION

  directive @date(defaultFormat: String = "mmmm d, yyyy") on FIELD_DEFINITION

  directive @auth(requires: [Role] = [ADMIN]) on OBJECT | FIELD_DEFINITION

  scalar Date

  scalar Email

  enum Role {
    ADMIN
    REVIEWER
    USER
    UNKNOWN
  }

  scalar Upload

  interface Node {
    id: ID!
  }

  type Image {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
    height: Int!
    width: Int!
  }

  type ImageAsset {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
    dataUri: String! # inline image in png format
    height: Int!
    width: Int!
    images: [Image]!
  }

  type File implements Node {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Attachment implements Node {
    id: ID!
    filename: String!
    type: String!
  }

  type Post implements Node {
    id: ID!
    slug: String!
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
    slug: String!
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
    singleImage(file: Upload): ImageAsset
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

export default typeDefs;
export { default as internalTypeDefs } from './internal';
