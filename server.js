require('dotenv').config();
const app = require('./src/app');
const { connectPostgres } = require('./src/config/postgres');
const { connectMongo } = require('./src/config/mongodb');

const PORT = process.env.PORT || 3000;

(async () => {
  await connectPostgres();
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();