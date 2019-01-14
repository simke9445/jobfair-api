const convertToQuery = (filter) => {
  if (!filter || Object.keys(filter).length === 0) {
    return {};
  }

  let query = { '$and': [] };

  const makeLikeComparator = (key, value) => ({
    [key]: { $regex: '.*' + value + '.*' },
  });

  for (let prop of Object.keys(filter)) {
    if (typeof filter[prop] === 'string') {
      query.$and = [...query.$and, makeLikeComparator(prop, filter[prop])];

      continue;
    }

    if (Array.isArray(filter[prop])) {
      const andQ = query.$and;

      if (filter[prop].length > 0) {
        delete query.$and;
        query.$or = [];
      }

      filter[prop].map(item => ({
        $and: [...andQ, makeLikeComparator(prop, item)],
      })).forEach(q => {
        query.$or.push(q);
      });
    }
  }

  return query;
}

const getActivePeriodQuery = (fromKey, toKey) => {
  return { $and: [{ [fromKey]: { $lte: new Date() } }, { [toKey]: { $gte: new Date() } }] };
};

const getFinishedPeriodQuery = (toKey) => {
  return {
    $and: [
      { [toKey]: { $lt: new Date() } },
    ],
  };
}

const getPersonalQuery = (personalKey, userId) => ({
  $and: [{ [personalKey]: userId }],
});


module.exports = {
  convertToQuery,
  getActivePeriodQuery,
  getFinishedPeriodQuery,
  getPersonalQuery,
};
