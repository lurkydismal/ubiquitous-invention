import { Logger } from "tslog";
import { isDev, needTrace } from "./stdvar";

const logLevel = needTrace ? 1 : isDev ? 2 : 3;

export const log = new Logger({
    type: "pretty",
    minLevel: logLevel,
    prettyLogTemplate: "{{logLevelName}}\t{{filePathWithLine}}\t",
});
