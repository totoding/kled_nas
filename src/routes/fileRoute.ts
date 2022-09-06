import fileController from 'src/controller/fileController'

export default [
  {
    path: "/file/upload",
    method: "post",
    action: fileController.addFileChunk
  },
]