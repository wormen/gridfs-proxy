import Proxy from './src';
import * as path from 'path';

(async ()=>{
  const proxy = new Proxy({
    port: 5002,
    database: 'testDatabase',
    checkFiles: true,
    ignore: ['/', '/robots.txt', '/favicon.ico'],
    rootFiles: path.resolve(__dirname, 'cdn-store')
  });

  await proxy.init()
})();
