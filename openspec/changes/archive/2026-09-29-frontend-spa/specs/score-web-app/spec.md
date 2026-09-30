# Spec Delta

## Purpose

Browser interface that lets admins and users sign in and look up the financial score of a RUT, with clear feedback when access is denied or the session is no longer valid.

## ADDED Requirements

### Requirement: Login

The app SHALL show a login form (username, password) and, on success, keep the session and show the score view. On failure it SHALL show an error message without clearing the username.

#### Scenario: Successful login

- **WHEN** the user submits valid credentials
- **THEN** the score view is shown

#### Scenario: Wrong credentials

- **WHEN** the API answers `401` to the login
- **THEN** the form shows "Invalid username or password"

### Requirement: Score lookup

The score view SHALL let the user enter a RUT and display the returned RUT, score and date. For the `user` role the RUT field SHALL be prefilled with their own RUT.

#### Scenario: Successful lookup

- **WHEN** a RUT the user may access is submitted
- **THEN** the normalized RUT, the score (0–100) and the query date are displayed

#### Scenario: Invalid RUT

- **WHEN** the API answers `400`
- **THEN** a message explains the RUT is invalid

#### Scenario: Forbidden RUT

- **WHEN** the API answers `403`
- **THEN** a message explains the user can only query their own RUT

### Requirement: Session handling

The app SHALL keep the session only for the browser tab, allow logging out, and return to the login view when the token is rejected.

#### Scenario: Expired session

- **WHEN** the API answers `401` to a score lookup
- **THEN** the session is cleared and the login view shows that the session expired

#### Scenario: Logout

- **WHEN** the user clicks "Log out"
- **THEN** the session is cleared and the login view is shown
