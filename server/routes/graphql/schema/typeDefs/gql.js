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

export default gql;
