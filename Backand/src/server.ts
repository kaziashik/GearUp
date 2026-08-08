import app from "./app";
import { config } from "./config";

const startServer = () => {
  const port = config.port || 5000;
  app.listen(port, () => {
    console.log(`🏋️ GearUp API running on port ${port}`);
    console.log(`Environment: ${config.env}`);
  });
};

// For local development
if (process.env.NODE_ENV !== "production") {
  startServer();
}

// Export for Vercel serverless
export default app;
