import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";

import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs, createBlog } from "./reducers/blogReducer";
import { setNotification, MessageTypes } from "./reducers/notificationReducer";

const App = () => {
  const dispatch = useDispatch();

  // const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const blogs = useSelector((state) => {
    console.log("state.blogs", state.blogs);
    return state.blogs;
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem(
        "loggedBloglistappUser",
        JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(
        setNotification("Wrong username or password.", MessageTypes.Error, 5)
      );
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBloglistappUser");
    blogService.setToken(null);
    setUser(null);
  };

  const blogFormRef = useRef();

  const createNewBlog = async ({ title, author, url }) => {
    try {
      dispatch(createBlog({ title, author, url }));
    } catch (e) {
      dispatch(
        setNotification(
          `Error, new blog could not be added.`,
          MessageTypes.Error,
          5
        )
      );
    }

    dispatch(
      setNotification(
        `A new blog ${title} by ${author} added`,
        MessageTypes.Success,
        5
      )
    );
  };

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="loginBtn" type="submit">
          login
        </button>
      </form>
    </div>
  );

  const blogList = () => {
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createNewBlog={createNewBlog} />
        </Togglable>

        {[...blogs]
          .sort((blog1, blog2) => blog2.likes - blog1.likes)
          .map((blog) => (
            <Blog key={blog.id} blog={blog} loggedInUser={user} />
          ))}
      </div>
    );
  };

  return (
    <div>
      <Notification />
      {user === null ? loginForm() : blogList()}
    </div>
  );
};

export default App;
