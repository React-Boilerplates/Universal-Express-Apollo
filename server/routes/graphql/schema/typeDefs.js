const typeDefs = `
interface Node {
  id: ID!
}
type Post implements Node {
  id: ID!
  title: String!
  author: Person!
}
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
type PostEdge {
  node: Post!
  cursor: ID!
}
type PostConnection {
  pageInfo: PageInfo
  edges: [PostEdge]
}
type Person implements Node {
  id: ID!
  name: String!
  posts: [Post]
}
type Query {
  posts(next:Int = 10 last:Int after: String, before: String): PostConnection
  post(id:ID!): Post
}
schema {
  query: Query
}
`;

export default typeDefs;
