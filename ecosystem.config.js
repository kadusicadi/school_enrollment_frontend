module.exports = {
  apps: [
    {
      name: 'school_enrollment_frontend',
      cwd: '/srv/school_enrollment_frontend/current',
      script: 'dist/index.js',
      instances: '2',
      exec_mode: 'cluster',
    },
  ],
};
