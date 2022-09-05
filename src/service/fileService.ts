import * as fs from 'node:fs/promises'

export class FileService {

  static async mkdir(path: string) {
    const createDir = await fs.mkdir(path, { recursive: true });

    console.log(`created ${createDir}`);

  }

}

const fileService = new FileService()

FileService.mkdir("/music")