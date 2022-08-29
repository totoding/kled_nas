import { ParameterizedContext } from 'koa'

class TestController {
   async test(ctx: ParameterizedContext) {
    ctx.body = 1
  }
}

export default new TestController()