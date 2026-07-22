# Deploy EDU-PAY on Render

The Render service builds the React frontend and serves it through the Node.js backend. This keeps the frontend and API on one domain, so student, fee, and payment data can be saved to MongoDB.

1. Push this repository to GitHub.
2. In [Render](https://render.com), create a new **Blueprint** and select this repository. Render reads `render.yaml` automatically.
3. Enter the `MONGODB_URI` value from `backend/.env` when prompted. Do not commit that secret to GitHub.
4. Set `CLIENT_URL` to the URL Render provides for the new service, for example `https://edu-pay.onrender.com`.
5. Deploy. After the health check at `/api/health` succeeds, use the Render URL as the live website address.

GitHub Pages can remain as a static demo, but use the Render URL for the working application because it includes the API required for MongoDB storage.
