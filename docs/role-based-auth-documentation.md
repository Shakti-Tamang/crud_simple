# Role-Based Authentication and Authorization Documentation

## Overview
This NestJS app uses JWT-based authentication and role-based authorization. A user first registers, then logs in with email and password. On successful login, the app returns a signed JWT token. Protected routes require that token, and some routes also require a matching role.

## Main Dependencies
- `@nestjs/jwt`: creates and signs JWT tokens.
- `@nestjs/passport`: integrates Passport with NestJS guards.
- `passport-jwt`: reads and validates Bearer tokens from requests.
- `bcryptjs`: hashes passwords during registration and compares passwords during login.
- `@nestjs/swagger`: documents protected endpoints with bearer auth in Swagger.
- `typeorm`: stores and reads users from the database.
- `pg`: PostgreSQL driver used by TypeORM.

## Core Files Involved
- `src/app.controller.ts`
- `src/app.service.ts`
- `src/jwt.strategy.ts`
- `src/jwt-auth.guard.ts`
- `src/roles.guard.ts`
- `src/roles.decorator.ts`
- `src/role.enum.ts`
- `src/payload.interface.ts`
- `src/auth-request.interface.ts`
- `src/shakti.entity.ts`
- `src/constants.ts`
- `src/main.ts`
- `src/app.module.ts`

## Roles Used in the App
The app defines three roles in `src/role.enum.ts`:
- `admin`
- `user`
- `editor`

The `Student` entity stores the role in the database, and the default role is `user`.

## Step-by-Step Flow

### 1. User registers
The registration endpoint is `POST /student/register`.

What happens:
- The controller sends the request body to `AppService.register()`.
- The service checks whether the email already exists.
- If the email already exists, it throws `ConflictException('User already exists')`.
- If not, the password is hashed with `bcrypt.hash(password, 12)`.
- The user is saved with a role. If no role is sent, the app sets `Role.User` by default.
- The app then calls `login(user)` and returns a JWT token immediately after registration.

### 2. User logs in
The login endpoint is `POST /student/login`.

What happens:
- The controller calls `AppService.validateUser(email, password)`.
- The service finds the user by email.
- It compares the plain password with the stored hashed password using `bcrypt.compare()`.
- If the credentials are invalid, the controller throws `UnauthorizedException('Invalid credentials')`.
- If the credentials are valid, the service calls `login(user)`.

### 3. JWT token is created
The `login(user)` method builds the token payload.

Payload fields:
- `sub`: user id
- `name`: user name
- `email`: user email
- `role`: user role

Then `JwtService.sign(payload)` creates the access token.
The response contains:
- `access_token`
- user profile data

### 4. Token is sent on protected requests
For protected endpoints, the client must send:
- `Authorization: Bearer <token>`

Swagger is also configured with bearer auth in `src/main.ts`, so the token can be entered in Swagger UI.

### 5. JWT is verified by the strategy
The JWT strategy is defined in `src/jwt.strategy.ts`.

What it does:
- Extracts the token from the Bearer header using `ExtractJwt.fromAuthHeaderAsBearerToken()`.
- Verifies the token signature using `jwtConstants.secret`.
- Checks expiration.
- Reads `payload.sub` and looks up the user again with `validateUserById()`.
- If the user no longer exists, it throws `UnauthorizedException('User not found')`.
- If the user is valid, it returns a cleaned payload object that becomes `req.user`.

### 6. Authentication guard blocks requests without a valid token
`src/jwt-auth.guard.ts` is a simple wrapper around `AuthGuard('jwt')`.

This guard:
- rejects requests without a token
- rejects requests with an invalid token
- allows the request to continue only after JWT validation succeeds

### 7. Role guard checks authorization
`src/roles.guard.ts` handles role-based access.

What it does:
- Reads the required roles from route metadata using `Reflector`.
- If no role metadata exists, it allows the request.
- If roles are required, it reads `req.user.role`.
- It returns `true` only when the user role matches one of the required roles.

### 8. Route metadata is set with the decorator
`src/roles.decorator.ts` defines the `@Roles(...)` decorator.

Example:
- `@Roles(Role.Editor)` attaches role metadata to a route.
- The guard later reads that metadata and enforces it.

## Where the Guards Are Used
In `src/app.controller.ts`:

- `@UseGuards(JwtAuthGuard, RolesGuard)` on `GET /student/getAdmin/admin`
- `@Roles(Role.Editor)` on the same route
- `@UseGuards(JwtAuthGuard)` on `GET /student/getLoggedInUser`

This means:
- `GET /student/getAdmin/admin` requires a valid JWT token and the `editor` role.
- `GET /student/getLoggedInUser` requires only a valid JWT token.

## Dependency Chain Summary
The complete chain is:

1. User registers or logs in.
2. Password is hashed or verified with `bcryptjs`.
3. `JwtService` creates a signed token.
4. Client sends the token in the Bearer header.
5. `JwtAuthGuard` checks the token.
6. `JwtStrategy` validates the token and loads the user.
7. `RolesGuard` checks whether the user role matches the route requirement.
8. The controller method runs only if both authentication and authorization succeed.

## Important Config Values
`src/constants.ts` defines:
- `JWT_SECRET` from environment variables, or a fallback secret
- token expiry of 24 hours

## Swagger Support
`src/main.ts` configures Swagger with `addBearerAuth()`, so protected endpoints are documented as token-based endpoints.

## Example Request Flow
1. `POST /student/register` with name, email, password, and optional role.
2. Receive `access_token` in the response.
3. Send `Authorization: Bearer <access_token>` to protected routes.
4. If the route has `@Roles(...)`, the user must also have the matching role.

## Notes About the Current Implementation
- The admin-only route currently uses `@Roles(Role.Editor)`, so the code treats `editor` as the allowed role for that route.
- If the intended business rule is true admin access, this route should likely use `Role.Admin` instead.
- The app returns JWT immediately after registration, so a newly registered user is logged in automatically.

## Quick File Map
- `src/app.controller.ts`: login, register, and protected routes
- `src/app.service.ts`: password hashing, token creation, user lookup
- `src/jwt.strategy.ts`: token validation and user lookup
- `src/roles.guard.ts`: role authorization logic
- `src/roles.decorator.ts`: role metadata declaration
- `src/shakti.entity.ts`: user entity and stored role
- `src/main.ts`: Swagger bearer auth setup
- `src/app.module.ts`: JWT, Passport, and guard wiring

## One-Line Summary
This app uses JWT for authentication and a custom roles guard for authorization, with roles stored on the user entity and enforced per route through metadata and guards.
