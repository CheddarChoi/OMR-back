const db = require("../models");
const User = db.users;

exports.checkAndGetUserId = async (ctx) => {
  console.log(ctx.request.user);
  ctx.assert(ctx.request.user, 401, "401: Unauthorized user");
  const { id } = ctx.request.user;
  const user = await User.findOne({
    where: { id },
    attributes: { include: ["email", "password", "salt"] },
  });
  ctx.assert(user, 401, "401: Unauthorized user");
  return user.id;
};
