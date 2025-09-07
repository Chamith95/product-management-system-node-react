import path from 'path';
import swaggerUi from 'swagger-ui-express';
import express, { Express } from 'express';

export function setupSwagger(app: Express) {
  const specDir = path.resolve(__dirname, '../../..', 'openApiSpec');

  // Serve the OpenAPI spec directory for resolving external $refs
  app.use('/openapi', express.static(specDir));

  // Optional: also expose the root spec at /openapi.yaml
  app.get('/openapi.yaml', (_req, res) => {
    res.sendFile(path.join(specDir, 'openapi.yaml'));
  });

  // Point Swagger UI to the served YAML so $refs work client-side
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: { url: '/openapi/openapi.yaml' }
    })
  );
}