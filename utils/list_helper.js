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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}