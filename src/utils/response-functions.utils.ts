import { ErrorResponse } from './error-response.interface';
import { ResponseType } from './response-type.enum';
import { SuccessResponse } from './success-response.interface';

export function getSuccessMessage(data): SuccessResponse {
  return {
    status: ResponseType.success,
    data,
  };
}

export function getErrorMessage(message): ErrorResponse {
  return {
    status: ResponseType.error,
    error: message,
  };
}
