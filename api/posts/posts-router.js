// posts için gerekli routerları buraya yazın
const express = require("express");
const Posts = require("./posts-model");

const router = express.Router();

// GET

router.get("/", (req, res) => {
  Posts.find()
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      res.status(500).json({ message: "Gönderiler alınamadı" });
    });
});

// GET

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((findPost) => {
      if (!findPost) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      } else {
        res.json(findPost);
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    });
});

// POST

router.post("/", async (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({
      message: "Lütfen gönderi için bir title ve contents sağlayın",
    });
  } else {
    try {
      let { id } = await Posts.insert({ title, contents });
      let addedPost = await Posts.findById(id);
      res.status(201).json(addedPost);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  }
});

// PUT

router.put("/:id", async (req, res) => {
  try {
    let existingPost = await Posts.findById(req.params.id);
    if (!existingPost) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      let { title, contents } = req.body;
      if (!title || !contents) {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      } else {
        let updatedPostId = await Posts.update(req.params.id, req.body);
        let updatedPost = await Posts.findById(updatedPostId);
        res.status(200).json(updatedPost);
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

// DELETE

router.delete("/:id", async (req, res) => {
  try {
    let existingPost = await Posts.findById(req.params.id);
    if (!existingPost) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      await Posts.remove(req.params.id);
      res.status(200).json(existingPost);
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

// GET

router.get("/:id/comments", async (req, res) => {
  try {
    let existingPost = await Posts.findById(req.params.id);
    if (!existingPost) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      let comments = await Posts.findPostComments(req.params.id);
      res.status(200).json(comments);
    }
  } catch (err) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
