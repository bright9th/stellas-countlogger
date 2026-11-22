import { EXPORT_URL, MANIFEST_ROUTE } from "../../../constants/api";
import projectConfig from "../../../../../project.manifest.json";
import { isManifestSchema, type ManifestSchema } from "./schema";
import { err } from "../../../log";

export async function fetchManifest(): Promise<unknown> {
  try {
    const response = await fetch(EXPORT_URL + MANIFEST_ROUTE);
    if (!response.ok) {
      err(
        "[DATABASE:MANIFEST:FETCH]",
        "API error:",
        response.status,
        await response.text()
      );
      return null;
    }
    return response.json();
  } catch (error) {
    err("[DATABASE:MANIFEST:FETCH]", "Error:", error);
    return null;
  }
}

export function validateManifest(
  manifest: unknown
): manifest is ManifestSchema {
  if (!manifest) {
    err("[DATABASE:MANIFEST:VALIDATE]", "Missing manifest.");
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const manifestVersion = manifest.version;
  if (!manifestVersion) {
    err("[DATABASE:MANIFEST:VALIDATE]", "Missing manifest version.");
    return false;
  }
  if (projectConfig.dataVersion !== manifestVersion) {
    err("[DATABASE:MANIFEST:VALIDATE]", "Mismatched manifest version.", {
      projectVersion: projectConfig.dataVersion,
      remoteVersion: manifestVersion,
    });
    return false;
  }
  if (!isManifestSchema(manifest)) {
    err(
      "[DATABASE:MANIFEST:VALIDATE]",
      "Invalid manifest schema with defined",
      { manifestVersion }
    );
    return false;
  }
  return true;
}
