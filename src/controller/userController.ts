import { Context } from 'koa'
import UserService from '../service/userService'


class UserController {

  async getAllUser(ctx: Context) {
    const result = await UserService.getAllUser()
    console.log(result)
    ctx.body = 1
  }

  async addUser(ctx: Context) {
    const result = await UserService.addUser(ctx)
    console.log(result)
    ctx.body = result
  }
}

export default new UserController()