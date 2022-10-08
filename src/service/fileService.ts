
import { promises as fs, createReadStream, createWriteStream } from 'fs'
import * as path from 'path'

const TEMP_PATH = path.join(path.resolve(), "src/tmp")
const STATIC_PATH = path.join(path.resolve(), "src/static")

export class FileService {

  /**
   * 检查目标路径/文件是否存在
   * @param src 
   * @param isTemp 是否为临时文件
   */
  static async checkFileExist(src: string, isTemp = true) {
    const fullPath = isTemp ? path.join(TEMP_PATH, src) : path.join(STATIC_PATH, src)
    try {
      await fs.access(fullPath)
      return fullPath
    } catch (err) {
      return null
    }
  }
  // 创建文件夹
  static async mkdir(src: string) {
    try {
      const result = await fs.mkdir(src, { recursive: true })
      return result as unknown as string | undefined || src
    } catch (error) {
      return error
    }
  }
  // 删除文件夹（待改进）
  static async deleteFile(src) {
    try {
      return await fs.rmdir(src, { recursive: true })
    } catch (error) {
      return error
    }
  }
  /**
   * 添加单个临时文件切片
   * @param chunk 
   * @param filename
   * @param force 强制删除所有重新上传 
   */
  static async createTempChunk(chunk, filename: string, force = false) {
    // 判断是否存在临时文件夹 不存在且suffix为0则创建文件夹
    const [hash, suffix] = filename.split('_')
    const index = suffix.split(".")[0]
    let existPath = await this.checkFileExist(hash)
    if (!existPath && index === "0") {
      existPath = await this.mkdir(path.join(TEMP_PATH,hash))
    }
    const fullPath = existPath + "/" + filename
    const existFile = await this.checkFileExist(hash + "/" + filename)
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
  // 合并切片
  static async mergeChunk(hash: string, type = "common") {
    const fullPath = path.join(TEMP_PATH, hash)
    if (!await this.checkFileExist(hash)) {
      return {
        code: 0,
        msg: "合并失败， 未找到临时文件"
      }
    }
    const chunkList = await fs.readdir(fullPath)
    const sortedChunklist = chunkList.sort((a, b) => {
      let reg = /_(\d+)/
      return Number(reg.exec(a)[1]) - Number(reg.exec(b)[1])
    })
    for (const item of sortedChunklist) {
      const suffix = /\.([0-9a-zA-Z]+)$/.exec(item)[1] || null
      const data = await fs.readFile(`${fullPath}/${item}`)
      await fs.appendFile(`${path.join(STATIC_PATH, `/${type}/`)}${hash}.${suffix}`, data)
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

  // 查询某临时文件已上传多少切片
  static async searchUploadedIndex(hash: string) {
    if (!await this.checkFileExist(hash)){
      return { code: 2, count: 0 }
    }
    const fullPath = path.join(TEMP_PATH, hash)
    const list = await fs.readdir(fullPath)
    return { code: 1, count: list.length }
  }
}

FileService.searchUploadedIndex("1d62766e7d1b66d006959851b33579f8")
.then(r => console.log(r))

