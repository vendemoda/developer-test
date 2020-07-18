import { Router } from "express";

export default () => {
  const api = Router();

  api.get("/", async (req, res) => {
    // Our responses are always JSON with the format like the examples bellow
    // {ok: true, products: []}
    // {ok: false, message: "error-getting-products", userMessage: "Erro ao obter produtos"}
    return res.send({ ok: true, message: "Hello dev" });
  });

  return api;
};
