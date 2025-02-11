// generate-swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import { options } from "./swagger";
import fs from "fs";

const swaggerSpec = swaggerJsdoc(options);

// Write swagger.json
fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));
