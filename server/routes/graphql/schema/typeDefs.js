const typeDefs = /* GraphQL */ `
directive @lower on FIELD_DEFINITION
directive @date(
  defaultFormat: String = "mmmm d, yyyy"
) on FIELD_DEFINITION
directive @auth(
  requires: [Role] = [ADMIN],
) on OBJECT | FIELD_DEFINITION

scalar Date

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

export const internalTypeDefs = /* GraphQL */ `
enum Currency {
  USD
}

input ChargeInput {
  amount: Float!,
  currency: Currency,
  source: String,
  receipt_email: String
}

input AddressInput {
  line1: String!
  city: String
  country: String
  line2: String
  postal_code: String
  state: String
}

input OrderShippingInput {
  address: AddressInput
  name: String
  phone: String
}

input OrderItemInput {
  amount: Float
  currency: Currency
  description: String
  parent: String # Sku of Product
  quantity: Int

}

input OrderInput {
  currency: Currency,
  customer: String,
  email: String
  items: [OrderItemInput]
  shipping: OrderShippingInput
}
type Query {
  string: String
}
type Mutation {
  createOrder(order: OrderInput): String
}
`;
