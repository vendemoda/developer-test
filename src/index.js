import { app } from "./app";
import dotenv from "dotenv";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? process.env.PWD + "/.env"
      : process.env.PWD + "/.dev.env",
});

app.server.listen(process.env.PORT || 1337, () => {
  console.log("Server listening on " + app.server.address().port);
});
