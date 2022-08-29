import { Column, Entity, PrimaryColumn } from "typeorm"


@Entity()
export class Test {
  @PrimaryColumn()
  id: number
  @Column()
  name: string
}