import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.post('/api/vi/signup',(c)=>{
  return c.text('Hello Hono!')
})
app.post('/api/v1/signin',(c)=>{
  return c.text("hello")

})
app.put('/api/v1/blog',(c)=>{
  return c.text("jk")
})
app.get('/api/v1/blog/:id',(c)=>{
  return c.text("jk")
})

export default app
