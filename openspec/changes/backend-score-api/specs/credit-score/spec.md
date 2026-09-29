# Spec Delta

## Purpose

Returns the financial risk score of a person or company identified by RUT, restricted by the caller's role.

## ADDED Requirements

### Requirement: Deterministic score by RUT

The system SHALL expose `GET /score/:rut` (protected) returning `200` with `{ "rut": string, "score": number, "fecha": string }`, where `rut` is the normalized RUT (`12.345.678-5` format), `score` is an integer between 0 and 100, and `fecha` is the ISO 8601 UTC timestamp of the query. The same RUT SHALL always produce the same score, regardless of its input format.

#### Scenario: Same RUT, same score

- **WHEN** the same RUT is queried twice, once as `12.345.678-5` and once as `123456785`
- **THEN** both responses return the same `score` and the same normalized `rut`

#### Scenario: Different RUTs

- **WHEN** two different valid RUTs are queried
- **THEN** the scores are computed independently (they are not a constant value)

### Requirement: RUT validation

The system SHALL reject RUTs with an invalid format or check digit.

#### Scenario: Invalid check digit

- **WHEN** `GET /score/12.345.678-0` is called with a valid token
- **THEN** the response is `400`

### Requirement: Role-based access to scores

A `user` SHALL only query the RUT contained in their token; an `admin` SHALL query any RUT.

#### Scenario: User queries own RUT

- **WHEN** a `user` queries the RUT in their token
- **THEN** the response is `200`

#### Scenario: User queries another RUT

- **WHEN** a `user` queries a RUT different from the one in their token
- **THEN** the response is `403`

#### Scenario: Admin queries any RUT

- **WHEN** an `admin` queries any valid RUT
- **THEN** the response is `200`
