const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const req = require('express/lib/request')

blogsRouter.get('/', async (request, response)=>{
  const blog = await Blog
  .find({}).populate('user', {username: 1, name: 1})
  response.json(blog)
})

blogsRouter.post('/', async (request, response)=>{
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({error: 'token missing or invaild'})
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
  title: body.title,
  author: body.author,
  url: body.url,
  likes: body.likes||0,
  user: user._id
  })

  const savedBlog = await blog.save()
  console.log(user.blogs)
  user.blogs = user.blogs.concat(savedBlog._id)
  console.log(user.blogs)
  await user.save()

  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async(request, response)=>{
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({error: 'token missing or invaild'})
  } 

  const blog = await Blog.findById(request.params.id)
  if(blog.user.toString() === decodedToken.id.toString()){
    console.log(blog)
    console.log(decodedToken)
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else{
    return response.status(401).json({error: 'cannot delete blog from different user'})
  }
})

blogsRouter.put('/:id', async(request, response)=>{
  const body = request.body
  
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes||0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
  response.json(updatedBlog)

})

module.exports=blogsRouter