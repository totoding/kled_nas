import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Common } from "src/utils/common";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Like, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AppDataSource } from "../db";

interface UserParams extends Common{
  userName: string
  password: string
  nickName: string
  avatar: string
}

@Entity()
export class User extends Common{
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  @Type(() => String)
  @IsNotEmpty({ message: "用户名不能为空" })
  userName: string

  @Column({ length: 100 })
  @Type(() => String)
  @IsNotEmpty({ message: "密码不能为空" })
  password: string

  @Column({ length: 255, nullable: true })
  @Type(() => String)
  nickName?: string

  @Column({ length: 100, nullable: true })
  @Type(() => String)
  avatar?: string

  @CreateDateColumn()
  createTime?: string

  @UpdateDateColumn()
  updateTime?: string

  @DeleteDateColumn()
  @Type(() => String)
  deteleTime?: string

  static add({ userName, nickName, password, avatar }: User) {
    return AppDataSource.getRepository(this)
      .insert({ userName, nickName, password, avatar })
  }

  static getUsersBySearchCondition(condition: any): Promise<[User[], number]> {
		const where: any[] = []
		if (condition.keywords) {
			const nickName = Like(`%${condition.keywords}%`)
			where.push({ nickName })
		}
		return AppDataSource.getRepository(this).findAndCount({
			select: ["id", "nickName"],
			where,
			skip: (condition.page - 1) * condition.limit,
			take: condition.limit,
		})
	}

}