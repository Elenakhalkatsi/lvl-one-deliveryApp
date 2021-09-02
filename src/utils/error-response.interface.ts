import { ResponseType } from './response-type.enum';

export interface ErrorResponse {
  status: ResponseType;
  error: any;
}
