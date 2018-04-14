const gql = (strings, ...values) =>
  strings
    .map((string, index) => string || `${values[index]}` || '')
    .join()
    .replace(
      // TODO: Make it so that the Schemas are compressed
      // /( {2} +)|\t|(\n)/g
      ' ',
      ' '
    );

const typeDefs = /* GraphQL */ gql`
  directive @lower on FIELD_DEFINITION

  directive @date(defaultFormat: String = "mmmm d, yyyy") on FIELD_DEFINITION

  directive @auth(requires: [Role] = [ADMIN]) on OBJECT | FIELD_DEFINITION

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

  type Attachment implements Node {
    id: ID!
    filename: String!
    type: String!
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

export const internalTypeDefs = gql`
  directive @lower on FIELD_DEFINITION

  directive @date(defaultFormat: String = "mmmm d, yyyy") on FIELD_DEFINITION

  directive @auth(requires: [Role] = [ADMIN]) on OBJECT | FIELD_DEFINITION

  interface Node {
    id: ID!
  }

  interface StripeList {
    object: String
    url: String
    has_more: Boolean
  }

  type SourcesListObjectType implements StripeList {
    object: String
    data: [CardType]
    has_more: Boolean
    total_count: Int
    url: String
  }

  type SubscriptionItemListObjectType implements StripeList {
    object: String
    data: [SubscriptionItemType]
    has_more: Boolean
    total_count: Int
    url: String
  }

  type SubscriptionItemType {
    id: ID!
    object: String
    created: Int
    quantity: Int
    subscription: ID
  }

  type PlanType {
    id: ID!
    object: String
    amount: Int
    billing_scheme: String
    created: Int
    currency: Currency
    interval: String
    interval_count: Int
    livemode: Boolean
    nickname: String
    product: ID
    trial_period_days: Int
    usage_type: String
  }

  type SubscriptionListObjectType implements StripeList {
    object: String
    data: [SubscriptionType]
    has_more: String
    total_count: Int
    url: String
  }

  type SubscriptionType {
    id: ID!
    object: String
    livemode: Boolean
    quantity: Int
    start: Int
    status: String
    billing: String
    billing_cycle_anchor: Int
    cancel_at_period_end: Boolean
    created: Int
    current_period_end: Int
    current_period_start: Int
    customer: ID
  }

  type CustomerType {
    id: ID!
    object: String
    account_balance: Int
    created: Int
    currency: Currency
    default_source: ID!
    delinquent: Boolean
    description: String
    # discount: null,
    email: String
    invoice_prefix: String
    livemode: Boolean
    shipping: ShippingType
    sources: SourcesListObjectType
  }

  type BankAccountType {
    id: ID!
    object: String
    account: String!
    account_holder_name: String
    account_holder_type: String
    bank_name: String
    country: String
    currency: Currency
    default_for_currency: Boolean
    fingerprint: String
    last4: String
    routing_number: String
    status: String
  }

  input AttachmentInput {
    content: String!
    contentId: ID!
    filename: String!
    disposition: String!
    type: String!
  }

  scalar Date

  enum Role {
    ADMIN
    REVIEWER
    USER
    UNKNOWN
  }

  enum Currency {
    USD
  }

  type DimensionsType {
    height: Float
    length: Float
    weight: Float
    width: Float
  }

  type SkuType {
    id: ID!
    object: String
    active: Boolean
    created: Int
    currency: Currency
    image: String
    inventory: SkuInventoryType
    livemode: Boolean
    package_dimensions: DimensionsType
    price: Int
    product: String
    updated: Int
  }

  type SkuInventoryType {
    quantity: Int
    type: String
    value: String
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
    currency: Currency
    customer: String
    email: String
    items: [OrderItemInput]
    shipping: OrderShippingInput
  }

  type OrderReturnType {
    object: String
    has_more: Boolean
    data: [ReturnType]
    url: String
  }

  type ReturnType {
    id: ID!
    object: String
    amount: Int
    created: Int
    currency: Currency
    items: [OrderItemType]
    livemode: Boolean
    order: String
    refund: String
    has_more: Boolean
    url: String
  }

  type OrderType {
    id: ID!
    object: String
    amount: Int
    amount_returned: Int
    application: ID
    application_fee: Int
    charge: ID
    created: Int
    currency: Currency
    customer: String
    email: String
    external_coupon_code: String
    items: [OrderItemType]
    livemode: Boolean
    returns: OrderReturnType
    selected_shipping_method: String
    shipping: ShippingType
    shipping_methods: ShippingMethodType
    status: String
    status_transitions: StatusTransitionType
    updated: Int
    upstream_id: ID
  }

  type StatusTransitionType {
    canceled: Int
    fulfilled: Int
    paid: Int
    returned: Int
  }

  type AddressType {
    city: String
    country: String
    line1: String
    line2: String
    postal_code: String
    state: String
  }

  type ShippingType {
    address: AddressType
    carrier: String
    name: String
    phone: String
    tracking_number: String
  }

  type ShippingMethodType {
    id: ID!
    amount: Int
    currency: Currency
    description: String
    delivery_estimate: String
  }

  type DeliveryEstimate {
    date: Date
    earliest: Date
    latest: Date
    type: String
  }

  type ChargeOutcomeType {
    network_status: String
    reason: String
    risk_level: String
    rule: String
    seller_message: String
    type: String
  }

  input DestinationInput {
    account: ID!
    amount: Int
  }

  type CardType {
    id: ID!
    object: String
    account: String
    address_city: String
    address_country: String
    address_line1: String
    address_line1_check: String
    address_line2: String
    address_state: String
    address_zip: String
    address_zip_check: String
    brand: String
    country: String
    currency: Currency
    customer: ID
    cvc_check: String
    default_for_currency: Boolean
    dynamic_last4: String
    exp_month: Int
    exp_year: Int
    fingerprint: String
    funding: String
    last4: String
    name: String
    recipient: String
    tokenization_method: String
  }

  input CardInput {
    exp_month: String!
    exp_year: String!
    number: String!
    object: String!
    cvc: String!
    address_city: String
    address_county: String
    address_line1: String
    address_line2: String
    name: String
    address_state: String
    address_zip: String
  }

  input ChargeInput {
    amount: Int!
    currency: Currency!
    application_fee: Int
    capture: Boolean
    description: String
    destination: DestinationInput
    transfer_group: String
    on_behalf_of: String
    receipt_email: String
    shipping: OrderShippingInput
    customer: ID
    source: CardInput
    statement_descriptor: String
  }

  type ChargeType {
    id: ID!
    object: String
    amount: Int
    amount_refunded: Int
    application: String
    application_fee: String
    balance_transaction: String
    captured: Boolean
    created: Int
    currency: Currency
    customer: String
    description: String
    destination: String
    dispute: String
    failure_code: String
    failure_message: String
    invoice: ID!
    livemode: Boolean
    on_behalf_of: String
    order: String
    outcome: ChargeOutcomeType
    paid: Boolean
    receipt_email: String
    receipt_number: String
    refunded: Boolean
    # refunds: List
    review: String
    shipping: ShippingType
    source: CardType
    # fraud_details: Hash
    source_transfer: String
    statement_descriptor: String
    status: String!
    transfer: String
    transfer_group: String!
  }

  type SubstitutionsType {
    name: String
    city: String
    state: String
    phone: String
    gender: String
  }

  input MailInput {
    text: String
    html: String
    to: String
    from: String
    cc: String
    bcc: String
    subject: String
    templateId: String
    attachments: [AttachmentInput]
    substitutions: SubstitutionsType
    categories: [String!]
    replyTo: String
  }

  input SmsInput {
    body: String!
    to: String!
    from: String
  }

  input SourceInput {
    id: ID
    card: CardInput
  }

  input CustomerInput {
    account_balance: Int
    business_vat_id: String
    coupon: String
    default_source: String
    description: String
    email: String
    invoice_prefix: String
    shipping: ShippingType
    source: SourceInput
  }

  input SubscriptionInput {
    customer: ID
    application_fee_percent: Float
    billing: String
    billing_cycle_anchor: String
    coupon: String
    days_until_due: Int
    prorate: Boolean
    items: [SubscriptionItemInput]
    source: SourceInput
    tax_percent: Float
    trial_end: Float
    trail_from_plan: Boolean
    trial_period_days: Int
  }

  input SubscriptionItemInput {
    plan: ID!
    quantity: Int
  }

  type OrderItemType {
    object: String
    amount: Int
    currency: Currency
    description: String
    parent: String
    quantity: Int
    type: String
  }

  type Query {
    string: String
  }

  type Mutation {
    createCharge(input: ChargeInput): ChargeType
    updateCharge(id: ID!, input: ChargeInput): ChargeType
    createCustomer(input: CustomerInput): CustomerType
    updateCustomer(id: ID!, input: CustomerInput): CustomerType
    createSubscription(input: SubscriptionInput): SubscriptionType
    updateSubscription(id: ID!, input: SubscriptionInput): SubscriptionType
    # createProduct(input: ProductInput): ProductType
    # updateProduct(id: ID!, input: ProductInput): ProductType
    createOrder(input: OrderInput): OrderType
    updateOrder(id: ID!, input: OrderInput): OrderType
    # createPlan()
    # updatePlan()
    # createInvoice(input: InvoiceInput): InvoiceType
    # updateInvoice(id: ID!, input: InvoiceInput): InvoiceType
    # createCoupon(input: CouponInput): CouponType
    # updateCoupon(id: ID!, input: CouponInput): CouponType
    # createDiscount(input: DiscountInput): DiscountType
    # updateDiscount(id: ID!, input: DiscountInput): DiscountType
    sendSms(message: SmsInput): String
    sendEmail(message: MailInput): String
  }
`;
