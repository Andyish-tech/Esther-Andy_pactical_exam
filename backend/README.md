# Backend — CRPMS API

Express 5 + MySQL2 server for the Car Repair & Payment Management System.

See the [root README](../README.md) for full setup instructions.

### Environment Variables

Create `.env` in this directory:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=crpms
JWT_SECRET=your_jwt_secret_key
```

### Scripts

```bash
npm run dev    # Start with nodemon (hot reload)
npm start      # Start with node
```
