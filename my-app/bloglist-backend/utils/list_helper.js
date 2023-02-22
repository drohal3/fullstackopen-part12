const lodash = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((prev, next) => prev + next.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((mostPopular, blog) =>
    blog.likes > mostPopular.likes ? blog : mostPopular
  );
};

const mostBlogs = (blogs) => {
  let grouped = lodash.groupBy(blogs, (blog) => blog.author);
  return lodash.reduce(
    grouped,
    (result, value, key) =>
      result.blogs > value.length
        ? result
        : {
            name: key,
            blogs: value.length,
          },
    {}
  );
};

const mostLikes = (blogs) => {
  let grouped = lodash.groupBy(blogs, (blog) => blog.author);
  return lodash.reduce(
    grouped,
    (result, value, key) => {
      let likes = value.reduce((prev, val) => prev + val.likes, 0);
      return result.likes > likes
        ? result
        : {
            author: key,
            likes: likes,
          };
    },
    {}
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
