import configDev from './config.dev';
import configProd from './config.prod';

const development = process.env.NODE_ENV !== 'production';

console.log(`Running in ${development ? 'development' : 'production'} environment`);

const conf = development ? configDev : configProd;

export default conf;
