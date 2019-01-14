const isActivePeriodQuery = (fromKey, toKey) => {
  return { $and: [{ [fromKey]: { $lte: new Date() } }, { [toKey]: { $gte: new Date() } }] };
};

module.exports = {
  isActivePeriodQuery,
};
