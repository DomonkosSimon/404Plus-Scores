import Dexie, { type Table } from 'dexie';
import type { Competition } from '../domain/types';

export class WeqDatabase extends Dexie {
  competitions!: Table<Competition, string>;

  constructor() {
    super('weq-db');
    this.version(1).stores({
      competitions: 'id, status, createdAt, finishedAt',
    });
  }
}

export const db = new WeqDatabase();
