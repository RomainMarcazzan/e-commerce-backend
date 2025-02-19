import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "js-yaml";
import { Express } from "express";

const pathToYaml = __dirname + "/swagger.yaml";
const swaggerDocument = yaml.load(
  fs.readFileSync(pathToYaml, "utf8")
) as Record<string, any>;

export const setupSwagger = (app: Express) => {
  app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
