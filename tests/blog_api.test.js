const bcrypt = require('bcrypt')
const { request } = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }  
]

const initialUsers = [
  {
    username: 'first',
    name: 'the first user',
    password: 'password1'
  },
  {
    username: 'second',
    name: 'the second user',
    password: 'password2'
  }
]


beforeEach(async ()=>{
  await Blog.deleteMany({})
  for(let blog of initialBlogs){
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  await User.deleteMany({})
  const saltRounds = 10
  for(let user of initialUsers){
    user.passwordHash = await bcrypt.hash(user.password, saltRounds)
    let userObject = new User(user)
    await userObject.save()
  }
})

test('login', async ()=>{
  const login = {
    username: 'first',
    password: 'password1'
  }

  const response = await api.post('/api/login').send(login)
  token = JSON.parse(response.text).token
  expect(token).toBeDefined()
})

test('blogs are returned as json', async ()=>{
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 10000)

test('all blogs are returned', async ()=>{
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs have a unique indentifier property', async ()=>{
  const blogsInDB = await Blog.find({})
  const blogToView = blogsInDB[0]
  expect(blogToView.id).toBeDefined();
})

test('valid blog can be added', async ()=>{
  const newBlog = {
    "title": "I BEAT MINECRAFT WHILE 3 PEOPLE TRIED TO STOP ME (it was hard)",
    "author": "The Mincrafting Guy",
    "url": "youtube.com/channel/wJuw7Isj91G",
    "likes": 267390
  }

  const login = {
    username: 'first',
    password: 'password1'
  }

  const response = await api.post('/api/login').send(login)
  token = JSON.parse(response.text).token
  
  await api
    .post('/api/blogs')
    .auth(token, {type: 'bearer'})
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length+1)

  const titles = blogsAtEnd.map(b=>b.title)
  expect(titles).toContain(
    "I BEAT MINECRAFT WHILE 3 PEOPLE TRIED TO STOP ME (it was hard)"
  )
})

test('approprate status code is given when no token is used to add blog', async ()=>{
  const newBlog = {
    "title": "I BEAT MINECRAFT WHILE 3 PEOPLE TRIED TO STOP ME (it was hard)",
    "author": "The Mincrafting Guy",
    "url": "youtube.com/channel/wJuw7Isj91G",
    "likes": 267390
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('when a blog with its `like` property is missing will have it default to 0', async ()=>{
  const newBlog = {
    "title": "10 SUB SPECIAL",
    "author": "The Mincrafting Guy",
    "url": "youtube.com/channel/wJuw7Isj91G",
  }

  const login = {
    username: 'first',
    password: 'password1'
  }

  const response = await api.post('/api/login').send(login)
  token = JSON.parse(response.text).token

  await api
    .post('/api/blogs')
    .auth(token, {type: 'bearer'})
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  const blogToView = blogsAtEnd[blogsAtEnd.length-1]
  
  expect(blogToView.likes).toBeDefined();
  expect(blogToView.likes).toBe(0);
})

test('sends appropriate status code when title and url is missing from blog', async ()=>{
  const newBlog = {
    "author": "Guy Person",
    "likes": 1
  }

  const login = {
    username: 'first',
    password: 'password1'
  }

  const response = await api.post('/api/login').send(login)
  token = JSON.parse(response.text).token

  await api
  .post('/api/blogs')
  .auth(token, {type: 'bearer'})
  .send(newBlog)
  .expect(400)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length)
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