import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import RefParser from "@apidevtools/json-schema-ref-parser";

const pathToYaml = __dirname + "/swagger.yaml";

// Asynchronously load and dereference swagger.yaml before setting up swagger middleware
export const setupSwagger = async (app: Express) => {
  const swaggerDocument = await RefParser.dereference(pathToYaml);
  app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
