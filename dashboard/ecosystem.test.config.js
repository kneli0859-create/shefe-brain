// PM2 config for v2.1 living-dashboard SIDE-BY-SIDE test deploy.
//
// Port 3005 = brain-dashboard-v21 (test instance, NOT routed via nginx yet)
// Port 3004 = brain-dashboard      (production, untouched)
//
// Lifecycle:
//   1. Шефе: cd /root/brain/dashboard && pnpm install   (one-time after branch checkout)
//   2. Шефе: pnpm build                                  (forbidden without explicit OK)
//   3. Шефе: pm2 start /root/brain/dashboard/ecosystem.test.config.js
//   4. Smoke test:  curl -fsS http://127.0.0.1:3005/living | head -20
//   5. iPhone test on internal IP (port-forward via SSH tunnel if needed)
//   6. If healthy → ETAP 22 promotes 3005 → 3004
//
// Rollback:
//   pm2 delete brain-dashboard-v21

const path = require('node:path');
const dashCwd = __dirname;

module.exports = {
  apps: [
    {
      name: 'brain-dashboard-v21',
      script: path.join(dashCwd, 'node_modules/next/dist/bin/next'),
      args: 'start -p 3005 -H 127.0.0.1',
      cwd: dashCwd,
      env: { NODE_ENV: 'production' },
      max_memory_restart: '500M',
      autorestart: true,
      time: true,
      out_file: '/root/brain/logs/dashboard-v21-out.log',
      error_file: '/root/brain/logs/dashboard-v21-error.log',
    },
  ],
};
