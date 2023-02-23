import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs: (state, action) => {
      console.log("setBlogs in reducer", action.payload);
      return action.payload;
    },
    appendBlog: (state, action) => {
      state.push(action.payload);
    },
    updateBlog: (state, action) => {
      const blogId = action.payload.id;

      return state.map((blog) => (blog.id !== blogId ? blog : action.payload));
    },
    remove: (state, action) => {
      const blogId = action.payload.id;

      return state.filter((blog) => blog.id.localeCompare(blogId));
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, remove } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogToCreate) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogToCreate);
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const changedBlog = { ...blog, likes: blog.likes + 1 };
    const response = await blogService.update(changedBlog);
    dispatch(updateBlog(response));
  };
};

export const modifyBlog = (blog) => {
  return async (dispatch) => {
    const response = await blogService.update(blog.id, blog);
    dispatch(updateBlog(response));
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id);
    dispatch(remove(blog));
  };
};

export default blogSlice.reducer;
