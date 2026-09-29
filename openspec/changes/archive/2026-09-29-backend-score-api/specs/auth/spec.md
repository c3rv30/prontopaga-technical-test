# Spec Delta

## Purpose

Authenticates users against a fixed set of mock credentials and protects API routes with signed, expiring JWTs.

## ADDED Requirements

### Requirement: Login with mock credentials

The system SHALL expose `POST /login` accepting `{ "username": string, "password": string }`. On valid credentials it SHALL respond `200` with `{ "token": string }`, a signed JWT whose payload contains `sub` (user id), `role` (`admin` or `user`) and, only when the role is `user`, `rut`. The token SHALL have an expiration.

#### Scenario: Valid user credentials

- **WHEN** a mock user with role `user` logs in with correct credentials
- **THEN** the response is `200` with a token whose payload has `sub`, `role: "user"`, `rut` and `exp`

#### Scenario: Valid admin credentials

- **WHEN** a mock user with role `admin` logs in with correct credentials
- **THEN** the response is `200` with a token whose payload has `sub`, `role: "admin"`, `exp` and no `rut`

#### Scenario: Invalid credentials

- **WHEN** the username does not exist or the password is wrong
- **THEN** the response is `401` with the same generic error in both cases

#### Scenario: Malformed body

- **WHEN** the body is missing `username` or `password`
- **THEN** the response is `400`

### Requirement: Authenticated requests

Protected routes SHALL require an `Authorization: Bearer <token>` header with a JWT signed by the server and not expired.

#### Scenario: Missing token

- **WHEN** a protected route is called without a bearer token
- **THEN** the response is `401`

#### Scenario: Invalid or expired token

- **WHEN** the token has a bad signature, is malformed or is expired
- **THEN** the response is `401`
