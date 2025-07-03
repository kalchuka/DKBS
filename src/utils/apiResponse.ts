
export class ApiResponse {
    static success(res: any, data: any, message = 'Success', code = 200) {
      return res.status(code).json({
        success: true,
        message,
        data,
      });
    }
  
    static error(res: any, message = 'Error', code = 500, errors: any = null) {
      return res.status(code).json({
        success: false,
        message,
      });
    }
  }