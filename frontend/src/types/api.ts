// API types
// `message` is the field the backend always sends and the only one safe to show a user.
// `error` is optional because it is deliberately ABSENT from whole classes of response:
// PR #93 removed it from every 5xx body (Open Finding F-19) and PR #103 removed it from
// every 404 body (Open Finding F-41), since it carried raw driver text -- `sql: no rows
// in result set`, and on a pool failure the driver's dial string with host and port.
// Where it survives (request-parse 400s and errors.Is-guarded sentinels) it is developer
// detail, not user-facing copy.
export interface APIError {
  message?: string;
  error?: string;
  code?: number;
}

export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

