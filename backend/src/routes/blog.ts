import { Hono } from 'hono'
import {PrismaClient} from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate';
import {decode,sign,verify} from 'hono/jwt';

export const blogRouter=new Hono<{
    Bindings:{
        DATABASE_URL: string
        JWT_SECRET: string

    },
    Variables:{
        userid:string;
    }

}>();
//middleware
blogRouter.use('/*',async (c,next)=>{
    const authheader=c.req.header('Authorization')||"";
    const user= await verify(authheader,c.env.JWT_SECRET);

    if(user){
        c.set('userid', user.id as string);
        next();
    }else{
        c.status(403);
        return c.json({
            message:"you are not logged in "
        })
    }
    
    }
);

blogRouter.post('/' ,async (c)=>{
    const body=await c.req.json();
    const auhtorid=c.get('userid');
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blog=await prisma.blog.create({
        data:{
            title: body.title,
            content: body.content,
            authorId: Number(auhtorid)
        }
    })
    return c.json({
        id:blog.id
    })
})

blogRouter.put('/' ,async (c)=>{
    const body=await c.req.json();
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blog=await prisma.blog.update({
        where:{
            id: body.id
        },
        data:{
            title: body.title,
            content: body.content
        }
    })
    return c.json({
        id:blog.id
    })
})

blogRouter.get('/' ,async (c)=>{
    const body=await c.req.json();
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const blog=await prisma.blog.findFirst({
            where:{
                id: body.id
            }
        })
        return c.json({
            blog
        });
    }catch(e){
        c.status(404);
        return c.json({
            message:"Blog not found"
        });
    }
})

//pagination
blogRouter.get('/bulk',async (c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogs=await prisma.blog.findMany();
    return c.json({
        blogs
    });
})
