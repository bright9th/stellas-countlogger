import { fetchManifest, validateManifest } from "../../database/manifest";
import type { App } from "../class";

export default async function (app: App): Promise<void> {
  const manifest = await fetchManifest();
  app.manifest = validateManifest(manifest) ? manifest : null;
}
