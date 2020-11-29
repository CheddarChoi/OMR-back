const db = require("../../models");
const User = db.User;

const { generateToken } = require("../../utils/jwt");
const { hashed, getRandomString } = require("../../utils/crypto");

/*
    POST /api/auth/register
    {
        username,
        password
    }
*/
exports.register = async (ctx) => {
  const { name, username, password, key } = ctx.request.body;
  const res = await User.findOne({
    where: { username },
    attributes: ["name", "password", "salt"],
  });
  ctx.assert(!res, 400, "The username is already taken.");
  // Generate random string of length 16
  const salt = getRandomString(16);
  const value = hashed(password, salt);
  const newUser = await User.create({
    name,
    username,
    salt,
    password: value,
    public: false,
  });

  ctx.response.body = newUser;
};

/*
    POST /api/auth/login
    {
        username,
        password
    }
*/

exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;
  const res = await User.findOne({
    where: { username },
    attributes: { include: ["username", "password", "salt"] },
  });
  ctx.assert(res, 400, "The account does not exist.");
  const value = hashed(password, res.salt);
  ctx.assert(value === res.password, 401, "The password is incorrect.");
  const token = await generateToken({ id: res.id });
  ctx.cookies.set(process.env.ACCESS_TOKEN, token, {
    maxAge: 1000 * 60 * 60 * 24,
    overwrite: true,
  });
  ctx.status = 204;
};

/*
    GET /api/auth/check
*/

exports.check = async (ctx) => {
  ctx.assert(ctx.request.user, 401, "401: Unauthorized user");
  const { id } = ctx.request.user;
  const user = await User.findOne({
    where: { id },
    attributes: { include: ["username", "password", "salt"] },
  });
  ctx.assert(user, 401, "401: Unauthorized user");
  ctx.body = { id, name: user.name };
};

exports.logout = async (ctx) => {
  ctx.cookies.set(process.env.ACCESS_TOKEN, null);
  ctx.status = 204;
};

exports.public = async (ctx) => {
  ctx.assert(ctx.request.user, 401, "401: Unauthorized user");
  const { id } = ctx.request.user;
  console.log(id);
  const user = await User.findOne({
    where: { id },
  });
  user.public = true;
  await user.save();
  ctx.status = 204;
};

exports.private = async (ctx) => {
  ctx.assert(ctx.request.user, 401, "401: Unauthorized user");
  const { id } = ctx.request.user;
  console.log(id);
  const user = await User.findOne({
    where: { id },
  });
  user.public = false;
  await user.save();
  ctx.status = 204;
};

exports.checkPublicity = async (ctx) => {
  ctx.assert(ctx.request.user, 401, "401: Unauthorized user");
  const { id } = ctx.request.user;
  const user = await User.findOne({
    where: { id },
  });
  ctx.body = user.public;
};

exports.allPublicUser = async (ctx) => {
  // ctx.assert(ctx.request.user, 401, "401: Unauthorized user");

  const data = await User.findAll({
    where: { public: true },
    attributes: { include: ["username", "id"] },
    include: db.Schedule,
  });

  ctx.body = data;

  // data.map((user) => {
  //   await db.schedule.findAll({ where: { UserId: user.id } })
  //   .then((data) => {
  //     console.log(data);
  //     ctx.body = data;
  //   })
  //   .catch((err) => {
  //     ctx.status = 500;
  //     ctx.body = {
  //       message:
  //         err.message || "Some error occurred while retrieving schedules.",
  //     };
  // })
};
