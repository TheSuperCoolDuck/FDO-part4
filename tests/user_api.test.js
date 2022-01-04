const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    username: 'first',
    name: 'the first user',
    passwordHash: 'ewofjwehiofjwef2e2'
  }
]


beforeEach(async ()=>{
  await User.deleteMany({})

  for(let user of initialUsers){
    let userObject = new User(user)
    await userObject.save()
  }
})

test('users are returned as json', async ()=>{
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 10000)

test('valid user can be added', async ()=>{
  const newUser={
    username: 'anotherUser',
    name: 'a user',
    password: 'Password123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(initialUsers.length+1)

  const usernames = usersAtEnd.map(b=>b.username)
  expect(usernames).toContain(
    "anotherUser"
  )
})

test('sends appropriate status code when username is too short', async ()=>{
  const newUser = {
    username: 'ba',
    name: 'short username',
    password: 'Password123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(initialUsers.length)
})

test('sends appropriate status code when password is too short', async ()=>{
  const newUser = {
    username: 'user',
    name: 'short username',
    password: 'Pa'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(initialUsers.length)
})

afterAll(() => {
  mongoose.connection.close()
})