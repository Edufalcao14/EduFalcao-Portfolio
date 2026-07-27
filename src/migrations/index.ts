import * as migration_20260727_205642_initial from './20260727_205642_initial';

export const migrations = [
  {
    up: migration_20260727_205642_initial.up,
    down: migration_20260727_205642_initial.down,
    name: '20260727_205642_initial'
  },
];
