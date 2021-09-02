import { ResponseType } from './response-type.enum';

export interface SuccessResponse {
  status: ResponseType;
  data: any;
}
