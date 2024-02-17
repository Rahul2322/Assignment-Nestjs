// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cluster from 'cluster';
import * as os from 'os';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    console.log(process.env.PORT)
    await app.listen(process.env.PORT || 8000);
    console.log(`Worker ${process.pid} started`);
  }
}
bootstrap();