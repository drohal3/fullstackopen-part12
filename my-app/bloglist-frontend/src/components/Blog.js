import { useState } from "react";
import PropTypes from "prop-types";
import { likeBlog, removeBlog } from "../reducers/blogReducer";
import { setNotification, MessageTypes } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";

const Blog = ({ blog, loggedInUser }) => {
  const [isShown, setIsShown] = useState(false);
  const dispatch = useDispatch();

  const handleRemoveBlog = () => {
    try {
      dispatch(removeBlog(blog));
      dispatch(
        setNotification(
          `Blog ${blog.title} successfully removed`,
          MessageTypes.Success,
          5
        )
      );
    } catch (e) {
      dispatch(
        setNotification(
          `Could not remove blog ${blog.title}`,
          MessageTypes.Error,
          5
        )
      );
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const detailStyle = {
    display: isShown ? "" : "none",
  };

  return (
    <div className="blog" style={blogStyle}>
      <div className="blogTitle">
        {blog.title} {blog.author}
        <button className="showHide" onClick={() => setIsShown(!isShown)}>
          {isShown ? "hide" : "show"}
        </button>
      </div>
      <div className="blogDetail" style={detailStyle}>
        {blog.url} <br />
        likes: {blog.likes}
        <button className="likeBtn" onClick={() => dispatch(likeBlog(blog))}>
          like
        </button>
        <br />
        {blog.user && blog.user.name ? blog.user.name : ""}
        {blog.user &&
          blog.user.username &&
          loggedInUser &&
          loggedInUser.username === blog.user.username && (
            <>
              <br />
              <button onClick={handleRemoveBlog}>remove</button>
            </>
          )}
      </div>
    </div>
  );
};

// blog, loggedInUser, updateBlog, removeBlog
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

export default Blog;
