
import { DataSource } from "typeorm"
import databaseInfo from './dbconfig'
import entities from './index'

export const AppDataSource = new DataSource({
  type: "mysql",
  database: "nas",
  host: databaseInfo.host,
  port: databaseInfo.port,
  username: databaseInfo.username,
  password: databaseInfo.password,
  synchronize: true,
  logging: true,
  entities
})

AppDataSource.initialize()
  .then(() => { console.log("链接数据库成功") })
  .catch(err => console.log(err))
