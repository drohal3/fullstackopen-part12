// The tests could be written more efficiently - many of them are redundant.
// The aim was to learn how to write them, not to optimize them

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [{
  "title": "test blog 1", "author": "Test1 Test1", "url": "http://test1.com", "likes": 84
}, {
  "title": "test blog 2", "author": "Test2 Test2", "url": "http://test2.com", "likes": 27
},]

beforeEach(async () => {
  await User.deleteMany({})

  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

afterAll(() => {
  mongoose.connection.close()
})

describe('blog api', () => {
  let header
  beforeEach(async () => {
    console.log("beforeEach")
    const userData = {username: "test", name: "test", password: "test"}
    console.log("beforeEach after")

    await api
      .post('/api/users')
      .send(userData)

    console.log("/api/users")


    const login = await api
      .post('/api/login')
      .send({username: userData.username, password: userData.password})

    header = {
      'Authorization': `bearer ${login.body.token}`
    }
  })

  test('return status 401 if token not provided', async () => {
    const newBlog = {
      "title": "new blog",
      "author": "test new blog",
      "url": "http://newblog.com",
      "likes": 12
    }

    await api.post('/api/blogs').send(newBlog).expect(401)

  })

  test('blogs are returned as json', async () => {
    // const token = getToken()
    await api
      .get('/api/blogs')
      .expect(200)
      .set(header)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs').set(header)
    expect(response.body).toHaveLength(initialBlogs.length)
  })


  test('id is the identifier', async () => {
    const response = await api.get('/api/blogs').set(header)
    expect(response.body[0].id).toBeDefined()
  })

  test('a new blog is successfully saved in database', async () => {
    const initialBlogs = await api.get('/api/blogs').set(header)

    const newBlog = {
      "title": "new blog",
      "author": "test new blog",
      "url": "http://newblog.com",
      "likes": 12
    }

    // let blogObject = new Blog(newBlog)
    await api.post('/api/blogs').send(newBlog).set(header).expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs').set(header)
    expect(response.body).toHaveLength(initialBlogs.body.length + 1)
    const mappedResponse = response.body.map(({title, author, url, likes}) => ({title, author, url, likes}))
    expect(mappedResponse).toContainEqual(newBlog)
  })

  test('missing likes property fallbacks to 0', async () => {
    const blogToAdd = {
      "title": "new blog",
      "author": "test new blog",
      "url": "http://newblog.com"
    }

    await api.post('/api/blogs').send(blogToAdd).set(header)
    const response = await api.get('/api/blogs').set(header)
    const mappedResponse = response.body.map(({title, author, url, likes}) => ({title, author, url, likes}))
    blogToAdd.likes = 0;
    expect(mappedResponse).toContainEqual(blogToAdd)
  })

  test('missing title and url results in 400 error code', async () => {
    const blogToAdd = {
      "author": "test new blog",
      "likes": 2
    }
    await api.post('/api/blogs').send(blogToAdd).set(header).expect(400)
  })

  test('Deleted blog is deleted.', async () => {
    const newBlog = {
      "title": "new blog",
      "author": "test new blog",
      "url": "http://newblog.com",
      "likes": 12
    }

    const addedBlog = await api.post('/api/blogs').send(newBlog).set(header)

    const initDbResponse = await api.get('/api/blogs').set(header)
    await api.delete(`/api/blogs/${addedBlog.body.id}`).set(header)
    const response = await api.get('/api/blogs').set(header)
    expect(response.body).toHaveLength(initDbResponse.body.length - 1)
    expect(response.body).not.toContainEqual(addedBlog.body)
  })

  test('updated likes are saved', async () => {
    const initDbResponse = await api.get('/api/blogs').set(header)
    const blogToUpdate = initDbResponse.body[0]
    const newLikes = blogToUpdate.likes + 10
    await api.put(`/api/blogs/${blogToUpdate.id}`).send({likes: newLikes}).set(header)
    blogToUpdate.likes = newLikes
    const response = await api.get('/api/blogs').set(header)
    expect(response.body).toHaveLength(initDbResponse.body.length)
    expect(response.body).toContainEqual(blogToUpdate)
  })

  test('blog is indeed updated', async () => {
    const initDbResponse = await api.get('/api/blogs').set(header)
    const blogToUpdate = initDbResponse.body[0]
    const newValues = {
      title: blogToUpdate.title + ' updated',
      author: blogToUpdate.author + ' updated',
      url: blogToUpdate.url + '/updated',
      likes: blogToUpdate.likes + 10
    }
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(newValues).set(header)
    newValues.id = blogToUpdate.id
    const response = await api.get('/api/blogs').set(header)
    expect(response.body).toHaveLength(initDbResponse.body.length)
    expect(response.body).toContainEqual(newValues)
  })
})

