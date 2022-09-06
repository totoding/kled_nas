import "reflect-metadata"
import './entites/db'
import * as path from 'path'
import * as Koa from 'koa'
import * as cors from 'koa-cors'
import * as Router from 'koa-router'
import AppRoutes from './routes/index'
import * as koaBody from "koa-body"
import * as serve from 'koa-static'

const app = new Koa()
app.use(cors())
app.use(koaBody({ multipart: true }))
const router = new Router()
AppRoutes.forEach(route => router[route.method](route.path, route.action))
app.use(router.routes())

app.use(serve(path.join(__dirname + '/public'),
  {
    index: "index",
    hidden: true,     
    defer: true,		  
  }
))


app.listen(3000)

console.log(`服务启动成功 端口：${3000}`)