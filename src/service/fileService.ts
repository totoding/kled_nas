
import { promises as fs, createReadStream, createWriteStream } from 'fs'
import * as path from 'path'
import * as SparkMD5 from 'spark-md5'
const TEMP_PATH = path.join(path.resolve(), "src/tmp")
export class FileService {

  /**
   * 检查临时目标路径/文件是否存在
   * @param src 
   */
  static async checkTempFileExist(src: string) {
    const fullPath = path.join(TEMP_PATH, src)
    try {
      await fs.access(fullPath)
      return fullPath
    } catch (err) {
      return null
    }
  }

  static async mkdir(src: string) {
    try {
      const fullsrc = path.join(path.resolve(), "src/tmp", src)
      const result = await fs.mkdir(fullsrc, { recursive: true })
      return result as unknown as string | undefined || fullsrc
    } catch (error) {
      return error
    }
  }
  /**
   * 添加临时文件切片
   * @param chunk 
   * @param filename
   * @param force 强制删除所有重新上传 
   */
  static async createTempChunk(chunk, filename: string, force = false) {
    // 判断是否存在临时文件夹 不存在且suffix为0则创建文件夹
    const [hash, suffix] = filename.split('_')
    const index = suffix.split(".")[0]
    let existPath = await this.checkTempFileExist(hash)
    if (!existPath && index === "0") {
      existPath = await this.mkdir(hash)
    }
    const fullPath = existPath + "/" + filename
    const existFile = await this.checkTempFileExist(hash + "/" + filename)
    if (existFile) {
      return {
        code: 2,
        index,
        message: "已存在切片" + hash
      }
    }
    const reader = createReadStream(chunk.filepath)
    const upStream = createWriteStream(fullPath)
    reader.pipe(upStream)
    return await new Promise((resolve, reject) => {
      reader.on("error", () => {
        reject({
          code: 0,
          index,
          message: "上传失败"
        })
      })
      reader.on("close", () => {
        resolve({
          code: 1,
          index,
          message: "上传成功"
        })
      })
    })
  }

  static async mergeChunk(hash: string) {
    const fullPath = path.join(TEMP_PATH, hash)
    const chunkList = await fs.readdir(fullPath)
    const sortedChunklist = chunkList.sort((a, b) => {
      let reg = /_(\d+)/
      return Number(reg.exec(a)[1]) - Number(reg.exec(b)[1])
    })
    for (const item of sortedChunklist) {
      const suffix = /\.([0-9a-zA-Z]+)$/.exec(item)[1] || null
      const data = await fs.readFile(`${fullPath}/${item}`)
      await fs.appendFile(`${path.join(__dirname, '../test/a/')}${hash}.${suffix}`, data)
      if (item === sortedChunklist[sortedChunklist.length - 1]) {
        try {
          await fs.access(`${path.join(__dirname, '../test/a/')}${hash}.${suffix}`)
          await this.deleteFile(path.join(TEMP_PATH, hash))
          return { code: 1, message: "合并成功" }
        } catch (err) {
          return { code: 0, message: err }
        }
      }
    }
    return { code: 0, message: "合并失败" }
  }

  static async deleteFile(src) {
    console.log(src, 1)
    try {
      const data = await fs.rmdir(src, { recursive: true })
      console.log(data)
      return data
    } catch (error) {
      return error
    }
  }
}


FileService.mergeChunk("13859e941b5254a9c0d0cf999d314f8b")
  .then(r => console.log(r))
