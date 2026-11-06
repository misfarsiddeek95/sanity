// pm2 process file: `pm2 start deploy/ecosystem.config.cjs && pm2 save`
module.exports = {
  apps: [{
    name: "scentify",
    cwd: "/var/www/scentify/.next/standalone",
    script: "server.js",
    instances: 1, // the in-memory rate limiter is per process; use Redis (or edge limits) before scaling out
    exec_mode: "fork",
    max_memory_restart: "400M",
    env: { NODE_ENV: "production", PORT: 3000, HOSTNAME: "127.0.0.1" },
  }],
};
