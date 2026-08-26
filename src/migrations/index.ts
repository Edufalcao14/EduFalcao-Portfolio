import * as migration_20260727_205642_initial from './20260727_205642_initial';
import * as migration_20260826_181146_add_technology_layer from './20260826_181146_add_technology_layer';

export const migrations = [
  {
    up: migration_20260727_205642_initial.up,
    down: migration_20260727_205642_initial.down,
    name: '20260727_205642_initial',
  },
  {
    up: migration_20260826_181146_add_technology_layer.up,
    down: migration_20260826_181146_add_technology_layer.down,
    name: '20260826_181146_add_technology_layer'
  },
];
