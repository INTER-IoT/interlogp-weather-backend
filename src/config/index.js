import config from './config';

const development = process.env.NODE_ENV !== 'production';

console.log(`Running in ${development ? 'development' : 'production'} environment`);

const conf = development ? config.dev : config.prod;

export default conf;
