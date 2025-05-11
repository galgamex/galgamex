module.exports = {
  apps: [
    {
      name: 'kun-galgamex-next',
      port: 3000,
      cwd: '.',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      script: 'node_modules/.bin/next',
      args: 'start'
    }
  ]
}
