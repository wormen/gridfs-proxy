import GridFsStore from 'gridfs-store';
import * as fastify from 'fastify';
import {EventEmitter} from 'events';
import * as fs from 'fs';
import * as path from 'path';

import {IOptions} from './interfaces';

const defaultOpts: IOptions = {
  port: 5000,
  checkFiles: false,
  database: 'default',
  ignore: ['/', '/robots.txt', '/favicon.ico']
};

export default class GridFsProxy extends EventEmitter {
  private _store;
  private _server;

  constructor(public opts: IOptions = defaultOpts) {
    super();

    this._store = new GridFsStore({
      database: this.opts.database || defaultOpts.database,
      hosts: this.opts.hosts,
      replicaSet: this.opts.replicaSet
    });

    if (this.opts.rootFiles) {
      this.opts.rootFiles = String(this.opts.rootFiles).replace(/\/$/, '');
    }
  }

  async init() {
    await this._store.connect();

    this._server = fastify();

    this._server.get('*', async (request, reply) => {
      if ((this.opts.ignore || defaultOpts.ignore).includes(request.raw.originalUrl)) {
        return reply.code(200).send('');
      } else {
        if (this.opts.checkFiles && this.opts.rootFiles) {
          let filePath = path.join(this.opts.rootFiles, request.raw.originalUrl);
          if (fs.existsSync(filePath)) {
            let stream = fs.createReadStream(filePath);
            return reply.send(stream);
          }
        }

        this._store.readFileStreamByPath(request.raw.originalUrl)
          .then(stream => {
            reply.send(stream);
          })
          .catch(e => {
            reply.code(404).send('');
          });
      }
    });

    this._server.listen(this.opts.port || defaultOpts.port, '0.0.0.0', (err, address) => {
      if (err) throw err;
      console.log(`server listening on ${address}`)
    });
  }
}