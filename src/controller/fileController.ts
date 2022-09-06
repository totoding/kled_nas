import { Context } from 'koa'
import { FileService } from 'src/service/fileService' 


class FileController {

  async addFileChunk(ctx: Context) {
    const chunk = ctx.request.files.chunk
    const { file } = ctx.request.body
    const result = await FileService.createTempChunk(chunk, file)
    ctx.body = result
  }
  
}

export default new FileController()