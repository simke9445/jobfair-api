const convertToQuery = (filter) => {
  if (!filter || Object.keys(filter).length === 0) {
    return {};
  }

  let query = { '$and': [] };

  for (let prop of Object.keys(filter)) {
    if (typeof filter[prop] === 'string') {
      query.$and = [...query.$and, { [prop]: { $regex: '.*' + filter[prop] + '.*' } }];
    }
  }

  return query;
};

module.exports = {
  convertToQuery,
};
