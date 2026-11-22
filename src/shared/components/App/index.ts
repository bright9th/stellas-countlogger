import init from "./init";
import { App } from "./class";

export async function NewApp(): Promise<App> {
  const app = new App();
  await init(app);
  return app;
}
