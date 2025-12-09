import dotenv from "dotenv";

dotenv.config({
  quiet: true,
  override: true,
  path: ".env",
  debug: process.env.NODE_ENV === "development",
});

const secret = {
  node_env: process.env.NODE_ENV,
  port: +process.env.PORT!,
  client_url: process.env.CLIENT_URL!,
  white_listed_domains: process.env.WHITE_LISTED_DOMAINS!.split(","),
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: +process.env.JWT_EXPIRES_IN!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    refreshExpiresIn: +process.env.JWT_REFRESH_EXPIRES_IN!,
  },
  mongo_uri: process.env.MONGO_URI!,
};

export default secret;
