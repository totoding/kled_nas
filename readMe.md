> 一个基于Nodejs 计划使用Koa2 + Typescript + typeorm + socketIo的一个简易nas服务系统。

[Vue3+Typescript的PC浏览器端在这](#)
[基于electron的PC客户端在这](#)
[基于Flutter的移动客户端在这](#)

#### 计划实现功能  

- [ ] 用户登录
- [ ] 文件存取管理 断点上传下载
- [ ] 音频播放器
- [ ] 视频播放器
- [ ] 远程下载

#### 写代码的过程日记  

##### 2022.04.08 
很早就有这个想法, 之前要了公网ip, 现在封城在家无聊开整吧。算是对nodejs的一个练习。今天硬件准备已到货, 老电脑, bios限制cpu功耗35w, 换上静音电源加猫扇。刷好centos 配置好ssh smb文件共享, 开发机连上, 配置服务器环境完成。

##### 2022.09.06
文件断点上传思路 

```flow
开始=>start: 选择文件
结束=>end: 结束
输入=>inputoutput: 解析文件
输入=>inputoutput: 解析2文件s
条件1=>condition: n能否被4整除？
条件2=>condition: n能被100整除？
条件3=>condition: n能被400整除？
输出1=>inputoutput: 输出闰年
输出2=>inputoutput: 输出非闰年

开始->输入->输入
条件1(no)->输出2->结束
条件2(no,left)->输出1
条件3(no)->输出2 
```
```mermaid
graph LR
	选择文件 --> 解析文件
  解析文件 --> 数据分片并标记索引
  数据分片并标记索引 --> 上传分片至服务端建立临时文件夹储存分片
graph TD
  上传分片至服务端建立临时文件夹储存分片 ---> a123
```