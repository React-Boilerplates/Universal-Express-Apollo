/**
 * Name: Basics of Building a Paginated Query
 * Alterations: Change the Create
 */

const createCursor = id => id;
const extractId = id => id;

const queryParams = {
  after: undefined,
  first: 10,
  before: undefined,
  last: undefined
};

const connectionBuilder = (list, hasNextPage, hasPrevPage) => ({
  edges: list.map(node => ({
    cursor: createCursor(node.get('id')),
    node: node.toJSON()
  })),
  pageInfo: {
    hasNextPage,
    hasPrevPage,
    endCursor: createCursor(list[list.length - 1].get('id')),
    startCursor: createCursor(list[0]).get('id')
  }
});

const connectionQuery = async (
  params,
  { first = queryParams.first, before, after, last } = queryParams,
  modelName,
  context
) => {
  let resolver;
  if (before) {
    // if using SQL could cache this query in the dataloader
    resolver = context.paginate[modelName].findBeforeId(
      extractId(before),
      params,
      last || queryParams.first
    );
  } else {
    // if using SQL could cache this query in the dataloader
    resolver = context.paginate[modelName].findAfterId(
      after ? extractId(after) : '',
      params,
      first || queryParams.first
    );
  }

  const list = await resolver;

  const [nextPage, prevPage] = await Promise.all([
    // if using SQL could cache this query in the dataloader
    context.paginate[modelName].hasNext(
      list[list.length - 1].get('id'),
      params
    ),
    context.paginate[modelName].hasPrev(list[0].get('id'), params)
  ]);

  return connectionBuilder(list, nextPage, prevPage);
};

module.exports = connectionQuery;
