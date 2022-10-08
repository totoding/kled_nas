import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Common } from "src/utils/common";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Like, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AppDataSource } from "../db";

@Entity()
export class File extends Common {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Type(() => String)
  @IsNotEmpty({ message: "文件名不能为空" })
  filename: string

  @Column()
  @Type(() => String)
  @IsNotEmpty({ message: "文件路径不能为空" })
  src: string

  @Column()
  @Type(() => Number)
  @IsNotEmpty({ message: "类型不能为空" })
  type: number

  @CreateDateColumn()
  createTime?: string

  @UpdateDateColumn()
  updateTime?: string

  @DeleteDateColumn()
  @Type(() => String)
  deteleTime?: string

  static async addFile(payload) {
    return AppDataSource.getRepository(this)
      .insert(payload)
  }
}