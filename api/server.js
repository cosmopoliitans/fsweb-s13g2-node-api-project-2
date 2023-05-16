// server için gerekli olanları burada ayarlayın

const express = require("express");
const server = express();
const postsRouter = require("./posts/posts-router");

server.use(express.json());

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send("Server is listening on port!");
});

module.exports = server;

// posts router'ını buraya require edin ve bağlayın
