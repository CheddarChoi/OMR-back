const db = require("../../models");
const User = db.users;

const jwt = require("jsonwebtoken");

/*
    POST /api/auth/register
    {
        username,
        password
    }
*/
exports.register = async (ctx) => {
  console.log(ctx.request);
  const { name, username, password } = ctx.request.body;
  let newUser = null;

  // create a new user if does not exist
  const create = (user) => {
    if (user) {
      throw new Error("username exists");
    } else {
      return User.create({
        name: name,
        username: username,
        password: password,
      });
    }
  };

  // respond to the client
  const respond = () => {
    ctx.response.json({
      message: "Registered successfully",
    });
    ctx.response.body = newUser;
  };

  // run when there is an error (username exists)
  const onError = (error) => {
    ctx.response.status(409).json({
      message: error.message,
    });
  };

  // check username duplication
  User.findOne({
    where: { username },
  })
    .then(create)
    .then(respond)
    .catch(onError);
};

/*
    POST /api/auth/login
    {
        username,
        password
    }
*/

exports.login = (req, res) => {
  const { username, password } = req.body;
  const secret = req.app.get("jwt-secret");

  // Check user info & generate jwt
  const check = (user) => {
    if (!user) {
      throw new Error("No user!");
    } else {
      if (user.password === password) {
        const p = new Promise((resolve, reject) => {
          jwt.sign(
            {
              _id: user._id,
              username: user.username,
              admin: user.admin,
            },
            secret,
            {
              expiresIn: "7d",
            },
            (err, token) => {
              if (err) reject(err);
              resolve(token);
            }
          );
        });
        return p;
      } else {
        throw new Error("Login Failed!");
      }
    }
  };

  const respond = (token) => {
    res.json({
      message: "Logged in successfully",
      token,
    });
    ctx.cookies.set(process.env.ACCESS_TOKEN, token, {
      maxAge: 1000 * 60 * 60 * 24,
      overwrite: true,
    });
    ctx.status = 204;
  };

  // error occured
  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  // find the user
  User.findOne({
    where: { username },
    attributes: { include: ["name", "password", "salt"] },
  })
    .then((res) => check(res))
    .then(respond)
    .catch(onError);
};

/*
    GET /api/auth/check
*/

exports.check = async (ctx) => {
  ctx.assert(ctx.request.user, 401, "401: Unauthorized user");
  const { id } = ctx.request.user;
  const user = await models.User.findOne({
    where: { id },
    attributes: { include: ["email", "password", "salt"] },
  });
  ctx.assert(user, 401, "401: Unauthorized user");
  ctx.body = { id, name: user.name };
};

exports.logout = async (ctx) => {
  ctx.cookies.set(process.env.ACCESS_TOKEN, null);
  ctx.status = 204;
};
