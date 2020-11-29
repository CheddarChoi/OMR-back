const moment = require("moment");

// return true if time1 is later than time2
exports.timeLater = (time1, time2) => {
  time1_moment = moment(time1, "HH:mm:ss");
  time2_moment = moment(time2, "HH:mm:ss");
  return time2_moment.diff(time1_moment) < 0;
};
