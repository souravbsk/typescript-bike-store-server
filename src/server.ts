import app from './app';
import mongoose from 'mongoose';
import config from './app/config';

console.log(config.database_url);
const port = config.port || 3000;

async function main() {
  await mongoose.connect(config.database_url as string);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main();
