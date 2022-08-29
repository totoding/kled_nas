import testController from './controller/testController'

export default [
  {
    path: "/test",
    method: "get",
    action: testController.test
  }
]