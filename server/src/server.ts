import http from "http";
import app from "./app/app";
import { connectDB } from "./config/db";
const server = http.createServer(app);

const port = app.get("port");

server.listen(port, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${port}`);
});
