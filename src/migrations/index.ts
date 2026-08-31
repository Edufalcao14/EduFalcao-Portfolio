import * as migration_20260727_205642_initial from './20260727_205642_initial';
import * as migration_20260826_181146_add_technology_layer from './20260826_181146_add_technology_layer';
import * as migration_20260826_194835_add_metrics_and_section_description from './20260826_194835_add_metrics_and_section_description';
import * as migration_20260831_165030_add_hero_role_tag from './20260831_165030_add_hero_role_tag';

export const migrations = [
  {
    up: migration_20260727_205642_initial.up,
    down: migration_20260727_205642_initial.down,
    name: '20260727_205642_initial',
  },
  {
    up: migration_20260826_181146_add_technology_layer.up,
    down: migration_20260826_181146_add_technology_layer.down,
    name: '20260826_181146_add_technology_layer',
  },
  {
    up: migration_20260826_194835_add_metrics_and_section_description.up,
    down: migration_20260826_194835_add_metrics_and_section_description.down,
    name: '20260826_194835_add_metrics_and_section_description',
  },
  {
    up: migration_20260831_165030_add_hero_role_tag.up,
    down: migration_20260831_165030_add_hero_role_tag.down,
    name: '20260831_165030_add_hero_role_tag'
  },
];
