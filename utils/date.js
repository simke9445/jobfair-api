const { format, parse, isWithinRange } = require('date-fns');

const isTimeWithinRange = (date, fromTime, toTime) => {
  const tmpDate = '2014-02-11T';
  const currentTime = format(date, 'HH:mm:ss');
  const currentDate = parse(`${tmpDate}${currentTime}`);
  const fromDate = parse(`${tmpDate}${fromTime}`);
  const toDate = parse(`${tmpDate}${toTime}`);

  if (isWithinRange(currentDate, fromDate, toDate)) {
    return true;
  }

  return false;
};

module.exports = {
  isTimeWithinRange,
};
