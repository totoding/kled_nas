import { Context } from 'koa';
import { Common } from 'src/utils/common';
import { User } from '../entites/user/User';



export default class UserService extends Common {

  static async getAllUser() {
    return await User.find()
  }

  static async addUser(ctx: Context) {
    const { userName, password, nickName, avatar } = ctx.request.body
    const userInfo = super.baseTransform(User, { userName, password, nickName, avatar })
    const errors = await userInfo.validateThis(true)
    if (errors.length > 0) return errors
    return await User.add(userInfo)
  }
}