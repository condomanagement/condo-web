module.exports = {
  apps: [{
    name: 'condo-web',
    script: './server-dist/server.js',
    env_production: {
      NODE_ENV: 'production',
      PORT: '8080',
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: '4000',
    },
  }],
};
