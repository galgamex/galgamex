module.exports = {
  apps: [
    {
      name: 'kun-galgamex-next',
      cwd: '/www/galgamex',
      script: 'node',
      args: '.next/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}