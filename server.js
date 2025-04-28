// server.js
const { createServer } = require('http');
const { join } = require('path');
const { pathToFileURL } = require('url');

// Cargar el index.js como módulo ES
(async () => {
  const appModule = await import(pathToFileURL(join(__dirname, 'src', 'index.js')).href);
  const app = appModule.default;

  const PORT = process.env.PORT || 4000;

  createServer(app).listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  });
})();