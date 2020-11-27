const db = require("../../models");
const User = db.users;

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
