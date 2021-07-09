createBlogPost = (req, res, next) => {
  const title = req.body.title;
  // const image = req.body.image;
  const body = req.body.body;

  const result = {
    message: "Create blog post success",
    data: {
      post_id: 1,
      title,
      body,
      created_at: "12/06/2020",
      author: {
        uid: 1,
        name: "Esto",
      },
    },
  };
  res.status(201).json(result);
  next();
};

module.exports = {
  createBlogPost,
};
