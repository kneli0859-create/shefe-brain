// PM2 process definitions for Brain v2.
// Run:  pm2 start /root/brain/ecosystem.config.js
//
// Port mapping:
//   3004 = brain.svd-clean.de  (Next.js dashboard)
//
// SVD Clean Pro's processes are managed via /root/svd-clean-pro/ecosystem.config.js
// — kept separate so the two systems can be restarted independently.

const path = require('node:path');
const dashCwd = path.join(__dirname, 'dashboard');

module.exports = {
  apps: [
    {
      name: 'brain-dashboard',
      script: path.join(dashCwd, 'node_modules/next/dist/bin/next'),
      args: 'start -p 3004 -H 127.0.0.1',
      cwd: dashCwd,
      env: { NODE_ENV: 'production' },
      max_memory_restart: '500M',
      autorestart: true,
      time: true,
    },
  ],
};
