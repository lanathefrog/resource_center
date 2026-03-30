import { buildApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { authService } from "./services/authService.js";

async function start() {
  await connectDb();
  await authService.ensureAdminExists({
    email: env.adminEmail,
    password: env.adminPassword
  });
  await authService.ensureDemoUserExists({
    email: env.demoUserEmail,
    password: env.demoUserPassword
  });

  const app = await buildApp();

  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
