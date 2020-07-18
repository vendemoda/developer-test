import express from "express";

import hello from "./controllers/hello";

const router = express();

router.use("/hello", hello());

export default router;
