import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
  override: process.env.NODE_ENV !== "production"
});

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI || "",
  sessionSecret: process.env.SESSION_SECRET || "dev-session-secret",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  serverUrl: process.env.SERVER_URL || "http://localhost:5000",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  mailFrom: process.env.MAIL_FROM || "Library App <no-reply@library-app.local>",
  adminEmail: process.env.ADMIN_EMAIL || "admin@library.local",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin12345!",
  demoUserEmail: process.env.DEMO_USER_EMAIL || "user@library.local",
  demoUserPassword: process.env.DEMO_USER_PASSWORD || "User12345!"
};

export const isProd = env.nodeEnv === "production";
