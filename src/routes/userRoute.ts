import userController from '../controller/userController'

export default [
  {
    path: "/user",
    method: "get",
    action: userController.getAllUser
  },
  {
    path: "/user",
    method: "post",
    action: userController.addUser
  }
]