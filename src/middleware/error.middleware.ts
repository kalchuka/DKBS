import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import * as fs from 'fs';
import * as path from 'path';

const logsDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const logFilePath = path.join(logsDir, `errors-${dateStr}.log`);
  
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: (req as any).userDetail?.email || 'unauthenticated',
    errorMessage: err.message || 'Unknown error',
    errorStack: err.stack,
    errorName: err.name,
    statusCode: err.statusCode || 500
  };
  
  const logEntry = `
==================================
TIME: ${timestamp}
URL: ${req.method} ${req.originalUrl}
IP: ${req.ip}
USER: ${(req as any).userDetail?.id || 'unauthenticated'}
ERROR: ${err.message || 'Unknown error'}
STATUS: ${err.statusCode || 500}
STACK: ${err.stack || 'No stack trace'}
=============================================================================================================
  `;
  
  fs.appendFile(logFilePath, logEntry, (writeErr) => {
    if (writeErr) {
      console.error('Failed to write to error log:', writeErr);
    }
  });
  
  if (err.statusCode && err.message) {
    return ApiResponse.error(
      res, 
      err.message, 
      err.statusCode, 
      err.errors || null
    );
  }
    return ApiResponse.error(res, 'Internal Server Error', 500, err);
}