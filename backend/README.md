# College Fees API

Copy `.env.example` to `.env`, set the MongoDB password, then run `npm run server` from the project root.

## Endpoints

- `GET /api/health`
- `GET, POST /api/students`
- `GET, PATCH, DELETE /api/students/:id`
- `GET, POST /api/fees`
- `PATCH /api/fees/:id`
- `GET, POST /api/payments`

All `POST` and `PATCH` requests use JSON request bodies.
