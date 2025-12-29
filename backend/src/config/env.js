export function loadEnv() {
  if (!process.env.DB_HOST) {
    import("dotenv").then((dotenv) => dotenv.config());
  }
}
