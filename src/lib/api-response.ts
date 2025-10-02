// src/lib/api-response.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export const ApiErrors = {
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "غير مصرح لك بالوصول",
    status: 401,
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    message: "غير مسموح لك بهذا الإجراء",
    status: 403,
  },
  NOT_FOUND: {
    code: "NOT_FOUND",
    message: "الموارد المطلوبة غير موجودة",
    status: 404,
  },
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    message: "البيانات المرسلة غير صحيحة",
    status: 400,
  },
  DUPLICATE_ERROR: {
    code: "DUPLICATE_ERROR",
    message: "البيانات مكررة",
    status: 409,
  },
  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    message: "حدث خطأ داخلي في الخادم",
    status: 500,
  },
} as const;

export const API_ERROR_CODES = {
  PAYMENT_GATEWAY_ERROR: "PAYMENT_GATEWAY_ERROR",
  WEBHOOK_PAYLOAD_INVALID: "WEBHOOK_PAYLOAD_INVALID",
  WEBHOOK_SIGNATURE_INVALID: "WEBHOOK_SIGNATURE_INVALID",
} as const;

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  if (message) {
    response.error = undefined; // Ensure error is not present in success responses
  }

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function createErrorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getErrorMessage(code: string): string {
  switch (code) {
    case API_ERROR_CODES.PAYMENT_GATEWAY_ERROR:
      return "حدث خطأ في نظام الدفع. يرجى المحاولة مرة أخرى";
    case API_ERROR_CODES.WEBHOOK_PAYLOAD_INVALID:
      return "بيانات الدفع غير صحيحة";
    case API_ERROR_CODES.WEBHOOK_SIGNATURE_INVALID:
      return "توقيع الدفع غير صحيح";
    default:
      return "حدث خطأ غير متوقع";
  }
}