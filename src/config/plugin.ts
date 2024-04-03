import { EggPlugin } from 'egg';
export default {
  // static: false,
  cros: {
    enable: true,
    package: 'egg-cors',
  },
} as EggPlugin;
