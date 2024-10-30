# Attribute-Based Access Control project

API description

## Users

```bash
/api/users
```

### POST:

- JSON:

```
  {
  "email": "Test1@gmail.com",
  "password": "Test1@gmail.com",
  "name": "Test1@gmail.com",
  "genderId": 1,
  "phoneNumber": "0123456789",
  "address": "new address",
  "companyId": 2,
  "roleId": 1
  }
```

- Summary:

  - Admin creates new user

- Description:

  - Only Admin can use this API

### GET

- Summary:

  - Admin get all users

- Description:

  - Only Admin can use this API

- Parameters

  | Name    | Located in | Description | Required | Schema |
  | ------- | ---------- | ----------- | -------- | ------ |
  | current | query      |             | Yes      | number |
  | total   | query      |             | Yes      | number |

```bash
/api/users/{id}
```

### GET

- Summary:

  - Admin get specific user by id

- Description:

  - Only Admin can use this API

### PATCH

- JSON:

```
{
  "name": "Test1@gmail.com",
  "genderId": 1,
  "phoneNumber": "0123456789",
  "address": "new address",
  "companyId": 2,
  "roleId": 1
}
```

- Summary:

  - Admin update user information

- Description:

  - Only Admin can use this API

### DELETE

- Summary:

  - Admin delete user permanently (\*USE WITH CAUTION)

- Description:

  - Only Admin can use this API
  - CAUTION: this API will delete user permanently, use it carefully

## ROLES

```batch
/api/roles
```

### POST

- JSON:

```
{
  "name": "string",
  "description": "string"
}
```

### GET

```batch
/api/roles/{id}
```

### PATCH

- JSON:

```
{
  "name": "string",
  "description": "string"
}
```

### DELETE

```batch
/api/roles/grant-permissions
```

### POST

- JSON:

```
{
  "roleId": "string",
  "permissionIds": ["string"]
}
```

## AUTH

```batch
/api/auth/login
```

### POST

- JSON:

```
{
  "email": "Test1@gmail.com",
  "password": "Test1@gmail.com"
}
```

```batch
/api/auth/refresh
```

### POST

- JSON:

```
{}
```

## PERMISSIONS

```batch
/api/permissions
```

### POST

- JSON:

```
{
  "action": "manage",
  "subjectId": 0,
  "condition": {},
  "inverted": true
}
```

### GET

```batch
/api/permissions/{id}
```

### PATCH

- JSON:

```
{
  "action": "manage",
  "subjectId": 0,
  "condition": {},
  "inverted": true
}
```

### DELETE

## SUBJECTS

```batch
/api/subjects
```

### POST

- JSON:

```
{
  "name": "Customer"
}
```

### GET

```batch
/api/subjects/{id}
```

### PATCH

- JSON:

```
{
  "name": "Customer"
}
```

### DELETE

## CUSTOMERS

```batch
/api/customers
```

### POST

- JSON:

```
{
  "taxCode": "string",
  "fullName": "string",
  "address": "string"
}
```

### GET

```batch
/api/customers/{id}
```

### GET
