const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ScholarGuide API",
      version: "1.0.0",
      description: "API documentation for ScholarGuide authentication and user management",
    },
    servers: [
      {
        url: "http://localhost:8081",
        description: "Local development server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Load all routes for documentation
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger Docs available at http://localhost:8081/api-docs");
};

module.exports = swaggerDocs;
