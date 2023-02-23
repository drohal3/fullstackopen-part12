//Also, implement tests which check that
// invalid users are not created
// and invalid add user operation returns a suitable status code and error message.

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    "username": "test1",
    "name": "Test Test1",
    "passwordHash": "$2b$10$T7Mm0e9ZuIqZMLH99vjEQ.YDjcpZ73a7GYBaslr6ooy918MDKKb3y"
  },
  {
    "username": "test2",
    "name": "Test Test2",
    "passwordHash": "$2b$10$N2uC7Qcqm/GoMimyIk21GO7cGiGdIPHyWMbHKLndKQzuEojCL1jt2"
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  let userObject = new User(initialUsers[0])
  await userObject.save()
  userObject = new User(initialUsers[1])
  await userObject.save()
})

afterAll(() => {
  mongoose.connection.close()
})

describe('user api', () => {
  test('user with no password is not created and returns 400 status code', async () => {
    const userToAdd = {username: "test3", name: "Test Test3"}

    const errResponse = await api
      .post('/api/users').send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(errResponse.error).toBeDefined() // tests whether error message is returned
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUsers.length)

  })

  test('user with too short (length < 3) password is not created and returns 400 status code', async () => {
    const userToAdd = {username: "test3", name: "Test Test3", password: "12"}

    const errResponse = await api
      .post('/api/users').send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(errResponse.error).toBeDefined() // tests whether error message is returned
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUsers.length)
  })

  test('user with no username is not created and returns 400 status code', async () => {
    const userToAdd = {name: "Test Test3", password: "test3"}

    const errResponse = await api
      .post('/api/users').send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(errResponse.error).toBeDefined() // tests whether error message is returned
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUsers.length)
  })

  test('user with too short (length < 3) username is not created and returns 400 status code', async () => {
    const userToAdd = {username: "12", name: "Test Test3", password: "test3"}

    const errResponse = await api
      .post('/api/users').send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(errResponse.error).toBeDefined() // tests whether error message is returned
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUsers.length)
  })

  test('duplicate username causes 422 error and user is not created', async () => {
    const userToAdd = {username: "test2", name: "Duplicate User", password: "duplicate"}
    const errResponse = await api
      .post('/api/users').send(userToAdd)
      .expect(422)
      .expect('Content-Type', /application\/json/)
    expect(errResponse.error).toBeDefined() // tests whether error message is returned
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUsers.length)
  })
})
