import { name } from "../../package.json";

const PREFIX = `[${name}]\n`;
export const log = (...data: unknown[]) => console.log(PREFIX, ...data);
export const warn = (...data: unknown[]) => console.warn(PREFIX, ...data);
export const err = (...data: unknown[]) => console.error(PREFIX, ...data);
