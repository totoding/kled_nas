import { Context } from "koa"

interface ResponesData {
	errors: object[] | ""
	data: object[]
	count: number 
}

export class ResponseHelper{

	static sendError(error: any, ctx: Context, code: number = 40001) {
		ctx.body = {
			error,
			data: null,
			code
		}
	}

	static sendData(data: any, ctx: Context, code: number = 0) {
		ctx.body = {
			error: "",
			data,
			code
		}
	}

	static sendPageData(result: ResponesData, ctx, code: number = 0) {
		if (result.errors.length > 0) {
			this.sendError(result.errors, ctx)
		} else {
			ctx.body.send({
				err: "",
				data: result.data,
				total: result.count
			})
		}
	}
}