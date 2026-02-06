---
name: API Design Reviewer
description: 审查 RESTful/GraphQL API 设计，确保一致性、安全性和最佳实践。 Invoke when 用户设计新 API、修改接口定义或请求 API 审查时。
---

# API Design Reviewer

## Description
审查 API 接口设计，确保符合 RESTful 最佳实践、安全规范和一致性要求。

## When to use
- 设计新的 API 接口时
- 修改现有 API 定义时
- 编写或审查 OpenAPI/Swagger 文档时

## Review Checklist

### 1. Resource Naming (REST)
- 使用名词而非动词 (e.g., `/users` not `/getUsers`).
- 使用复数名词表示资源集合.
- URL 结构层级清晰 (e.g., `/users/{id}/orders`).
- 使用连字符 `-` 分隔单词 (kebab-case).

### 2. HTTP Methods
- **GET**: 获取资源 (幂等, 无副作用).
- **POST**: 创建资源.
- **PUT**: 全量更新资源 (幂等).
- **PATCH**: 部分更新资源.
- **DELETE**: 删除资源.

### 3. Status Codes
- **2xx**: 成功 (200 OK, 201 Created, 204 No Content).
- **4xx**: 客户端错误 (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found).
- **5xx**: 服务器错误 (500 Internal Server Error).

### 4. Payload & Response
- 使用 JSON 作为默认格式.
- 字段命名风格统一 (通常为 camelCase 或 snake_case).
- 包含分页信息 (Pagination) 对于列表接口.
- 包含错误详情 (Error details) 对于失败响应.

### 5. Security
- 强制使用 HTTPS.
- 验证 Authentication (JWT, OAuth).
- 检查 Authorization (RBAC).
- 防止敏感数据泄露.

## Instructions
1. 检查 URL 路径和 HTTP 方法是否匹配语义。
2. 验证请求和响应体结构是否合理。
3. 确认状态码使用是否准确。
4. 提出具体的改进建议和修正后的示例。
