const { validationResult } = require("express-validator");
const BlogPost = require("../models/blog");
const path = require("path");
const fs = require("fs");

createBlogPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Gambar wajib diisi");
    err.errorStatus = 422;
    throw err;
  }

  const title = req.body.title;
  const image = req.file.path;
  const body = req.body.body;

  const Posting = new BlogPost({
    title,
    body,
    image,
    author: {
      uid: 1,
      name: "Esto Triramdani N",
    },
  });

  Posting.save()
    .then((result) => {
      res.status(201).json({
        message: "Create blog post success",
        data: result,
      });
    })
    .catch((err) => console.log(err));
};

getAllBlogPosts = (req, res, next) => {
  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 5;
  let totalItems;

  BlogPost.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return BlogPost.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((result) => {
      if (result.length === 0) {
        result = "Tidak ada data post";
      }
      res.status(201).json({
        message: "Blog post berhasil diambil",
        total_data: totalItems,
        per_page: perPage,
        currentPage: currentPage,
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

getBlogPostById = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((result) => {
      if (!result) {
        const error = new Error(
          `Blog post dengan id ${postId} tidak ditemukan`
        );
        error.errorStatus = 404;
        throw error;
      } else {
        res.status(201).json({
          message: "Data berhasil diambil",
          data: result,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

updateBlogPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Gambar wajib diisi");
    err.errorStatus = 422;
    throw err;
  }

  const title = req.body.title;
  const image = req.file.path;
  const body = req.body.body;
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error(
          `Blog post dengan ID ${postId} tidak ditemukan.`
        );
        error.errorStatus = 404;
        throw error;
      }
      post.title = title;
      post.body = body;
      post.image = image;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Update berhasil",
        data: result,
      });
    })
    .catch((error) => {
      next(error);
    });
};

deleteBlogPost = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error(
          `Blog post dengan ID ${postId} tidak ditemukan.`
        );
        error.errorStatus = 404;
        throw error;
      }

      removeImage(post.image);

      return BlogPost.findByIdAndRemove(postId);
    })
    .then((result) => {
      res.status(200).json({
        message: "Hapus blog post berhasil",
        data: result,
      });
    })
    .catch((err) => next(err));
};

const removeImage = (filePath) => {
  filePath = path.join(__dirname, "../..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
};
