import "reflect-metadata"
import './entites/db'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import AppRoutes from './routes'

const app = new Koa()
const router = new Router()


AppRoutes.forEach(route => router[route.method](route.path, route.action))

app.use(bodyParser())
app.use(router.routes())

app.listen(3000)

console.log(`服务启动成功 端口：${3000}`)