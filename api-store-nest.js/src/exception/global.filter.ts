/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalException implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status = 500;
    let message = 'A critical error has occurred. Contact support';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      const exceptionResponse: any = exception.getResponse();
      message = exceptionResponse.message || exceptionResponse;
    } else {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timeStamp: new Date(),
      path: request.url,
    });
  }
}
