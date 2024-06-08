export interface ServerResponse {
  response_status: string;
  response_code: number;
  error_type: string;
  stack_trace: string;
  timestamp: string;
  data: {};
  success: Boolean;
}
