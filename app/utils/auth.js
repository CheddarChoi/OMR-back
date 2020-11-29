const db = require("../models");
const User = db.User;

exports.checkAndGetUserId = async (ctx) => {
  console.log(ctx.request.user);
  ctx.assert(ctx.request.user, 401, "401: Unauthorized user");
  const { id } = ctx.request.user;
  const user = await User.findOne({
    where: { id },
    attributes: { include: ["username", "password", "salt"] },
  });
  ctx.assert(user, 401, "401: Unauthorized user");
  return user.id;
};
