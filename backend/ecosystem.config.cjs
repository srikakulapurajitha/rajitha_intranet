module.exports = {
    apps: [{
        name: "Intranet backend",
        script: "./server.js",
        watch: true,
        ignore_watch: ["uploads", "views", "public"]

    }]
}