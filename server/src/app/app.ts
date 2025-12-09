import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";
import { setupSwagger } from "../config/swagger";
import router from "../routes/router";
import secret from "./secret";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// cors
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (secret.white_listed_domains.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.set("port", secret.port);

// Setup Swagger API Documentation
setupSwagger(app);

app.use(router);

export default app;
