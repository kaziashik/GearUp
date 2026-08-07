import app from "./app";
import { config } from "./config";

const startServer = () => {
  app.listen(config.port, () => {
    console.log(`🏋️ GearUp API running on port ${config.port}`);
    console.log(`Environment: ${config.env}`);
  });
};

startServer();
