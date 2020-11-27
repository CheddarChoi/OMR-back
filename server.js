require("dotenv").config();
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const logger = require("koa-logger");
const router = require("./app/routes");
const helmet = require("koa-helmet");
const { jwtMiddleware } = require("./app/utils/jwt");

const PORT = 8081;

const run = async () => {
  const app = new Koa();

  app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
  app.use(helmet());
  app.use(logger());
  app.use(bodyParser());
  app.use(jwtMiddleware);
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(PORT);
};

run();

// Database Settings
const db = require("./app/models");
db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
