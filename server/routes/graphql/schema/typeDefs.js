const typeDefs = `
interface Node {
  id: ID!
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
  posts(first: Int = 10, after: String, last: Int, before: String): PostConnection
  post(id:ID!): Post
  user(id:ID!): Person
  users(first: Int = 10, after: String, last: Int, before: String): PersonConnection
}
type Mutation {
  signOnJwt(email: String password: String): JwtResponse
  signOn(email: String password: String): Person
}
schema {
  query: Query
  mutation: Mutation
}
`;

export default typeDefs;
