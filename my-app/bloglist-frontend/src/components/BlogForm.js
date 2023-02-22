import { useState } from "react";

const BlogForm = ({ createNewBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleNewBlog = (event) => {
    event.preventDefault();
    setNewAuthor("");
    setNewTitle("");
    setNewUrl("");

    createNewBlog({ title: newTitle, author: newAuthor, url: newUrl });
  };

  return (
    <form onSubmit={handleNewBlog}>
      <div>
        title{" "}
        <input
          id="newTitle"
          type="text"
          placeholder="new title"
          value={newTitle}
          name="newTitle"
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author{" "}
        <input
          id="newAuthor"
          type="text"
          placeholder="author"
          value={newAuthor}
          name="newAuthor"
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        url{" "}
        <input
          id="newUrl"
          type="text"
          placeholder="something.com"
          value={newUrl}
          name="newUrl"
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button id="createBlogBtn" type="submit">
        create
      </button>
    </form>
  );
};

export default BlogForm;
