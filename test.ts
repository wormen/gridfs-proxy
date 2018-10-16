import Proxy from './src';
import * as path from 'path';

(async ()=>{
  const proxy = new Proxy({
    database: 'testDatabase',
    checkFiles: true,
    rootFiles: path.resolve(__dirname, 'cdn-store')
  });

  await proxy.init()
})();