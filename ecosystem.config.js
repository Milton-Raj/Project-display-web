module.exports = {
    apps: [
        {
            name: "project-showcase",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 3000
            }
        }
    ]
};
