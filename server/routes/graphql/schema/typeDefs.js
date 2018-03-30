const typeDefs = `
type Post {
  id: ID!
  title: String!
  author: Person!
}
type Person {
  id: ID!
  name: String!
  posts: [Post]
}
type Query {
  posts: [Post]
  post(id:ID!): Post
}
`;

export default typeDefs;
