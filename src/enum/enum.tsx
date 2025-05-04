export enum ErrorCode {
    UNCATEGORIZED_EXCEPTION = 9999,
    UNAUTHENTICATED = 1000,
    UNAUTHORIZED = 1001,
    TOKEN_EXPIRED = 1002,
  
    USER_EXISTED = 1010,
    EMAIL_EXITED = 1011,
    USER_NON_EXISTED = 1012,
    ANSWER_NON_EXISTED = 1014,
    FILE_TOO_LARGE = 1015,
    WRONG_FILE_FORMAT = 1016,
    IMAGE_NON_EXISTED = 1017,
    PASSWORD_NOT_MATCH = 1018,
  
    COMMENT_CONTENT_TOO_SHORT = 2002,
    COMMENT_NON_EXISTED = 2003,
  
    FIELD_NOT_FOUND = 5000,
  }
  
  export const ErrorMessage: Record<ErrorCode, string> = {
    [ErrorCode.UNCATEGORIZED_EXCEPTION]: "Lỗi chưa được phân loại",
    [ErrorCode.UNAUTHENTICATED]: "Không thể xác thực người dùng",
    [ErrorCode.UNAUTHORIZED]: "Bạn không có quyền truy cập",
    [ErrorCode.TOKEN_EXPIRED]: "Token đã hết hạn",
  
    [ErrorCode.USER_EXISTED]: "User đã tồn tại",
    [ErrorCode.EMAIL_EXITED]: "Email đã tồn tại",
    [ErrorCode.USER_NON_EXISTED]: "User không tồn tại",
    [ErrorCode.ANSWER_NON_EXISTED]: "Câu trả lời không tồn tại",
    [ErrorCode.FILE_TOO_LARGE]: "Kích thước file vượt quá 10MB",
    [ErrorCode.WRONG_FILE_FORMAT]: "Sai định dạng file",
    [ErrorCode.IMAGE_NON_EXISTED]: "Hình ảnh không tồn tại",
    [ErrorCode.PASSWORD_NOT_MATCH]: "Password và Retype password không trùng nhau",
  
    [ErrorCode.COMMENT_CONTENT_TOO_SHORT]: "Nội dung bình luận không được dưới 15 ký tự",
    [ErrorCode.COMMENT_NON_EXISTED]: "Bình luận không tồn tại",
  
    [ErrorCode.FIELD_NOT_FOUND]: "Không tồn tại sân"
  };
  