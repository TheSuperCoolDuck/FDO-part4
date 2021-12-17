const listHelper = require('../utils/list_helper')

test('dummy returns one', ()=>{
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithNoBlogs=[

  ]

  test('of empty list of zero', () => {
    const result = listHelper.totalLikes(listWithNoBlogs)
    expect(result).toBe(0)
  })

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  const listWithMultipleBlog = [
    {
      _id: '78hgjk926347whsyd7uas8e5',
      title:  'TOP 5 BEST AQW CLASSES',
      author: 'aqw dude',
      url: 'youtube/video/hoiw233j',
      likes: 20000,
      __v: 0
    },
    {
      _id: '78hgjk926347whsyd7uas8e5',
      title:  'Why cant penguins fly',
      author: 'steven c',
      url: 'medium.com/wiudww',
      likes: 8,
      __v: 0
    },
    {
      _id: '78hgjk926347whsyd7uas8e5',
      title:  'AITA for being a overall bad person',
      author: 'fuzzslayer',
      url: 'reddit.com/28y7wude2u',
      likes: 2,
      __v: 0
    }
  ]

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMultipleBlog)
    expect(result).toBe(20010)
  })
})