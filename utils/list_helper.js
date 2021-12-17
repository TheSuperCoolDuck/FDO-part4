const _ = require('lodash')

const dummy = (blogs)=>{
  return 1
}

const totalLikes = (blogs)=>{
  return blogs.reduce((likes, blog)=>{
    return likes + blog.likes
  },0)
}

const favoriteBlog = (blogs)=>{
  return blogs.length === 0
    ? null
    : blogs.reduce((fav, blog)=>{
        return fav.likes>blog.likes
          ? fav
          : blog
      })
}

const mostBlogs = (blogs)=>{

  if(blogs.length===0){
    return null
  }

  const authorBlogCounts = _.countBy(blogs, (blog)=>{
    return blog.author
  })

  const authorMostBlog = Object.entries(authorBlogCounts).reduce((most,author)=>{
    return most[1] > author[1]
      ? most
      : author
  },0)

  const authorMostBlogObject = {
    author: authorMostBlog[0],
    blogs: authorMostBlog[1]
  }

  return authorMostBlogObject
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}