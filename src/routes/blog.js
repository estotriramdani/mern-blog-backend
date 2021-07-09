const express = require("express");
const { createBlogPost } = require("../controllers/blog");
const router = express.Router();

router.post("/post", createBlogPost);

module.exports = router;
