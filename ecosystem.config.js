module.exports = {
    apps: [{
        name: 'File Upload Server',
        script: 'index.js',
        instances: 4,
        exec_mode: "cluster",
        merge_logs: true,
        autorestart: false,
        watch: false,
        node_args: '--max-old-space-size=4072',
        max_memory_restart: '5G',
        log_date_format: 'DD-MM-YYYY HH:mm:ss.SSS',
        env: {
            NODE_ENV: 'production'
        },
        env_development: {
            NODE_ENV: 'development'
        }
    }],
    deploy: {
        production: {
            user: 'SSH_USERNAME',
            host: 'SSH_HOSTMACHINE',
            ref: 'origin/master',
            repo: 'GIT_REPOSITORY',
            path: 'DESTINATION_PATH',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};
