import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
let config;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  config = {
    headers: { Authorization: token },
  };
};

const getAll = async () => {
  const response = await axios.get(baseUrl, config);
  return response.data;
};

const create = async (blogData) => {
  const response = await axios.post(baseUrl, blogData, config);

  return response.data;
};

const update = async (blogData) => {
  const response = await axios.put(
    `${baseUrl}/${blogData.id}`,
    blogData,
    config
  );

  return response.data;
};

const remove = async (blogId) => {
  const response = await axios.delete(`${baseUrl}/${blogId}`, config);

  return response.data;
};

export default { getAll, setToken, create, update, remove };
