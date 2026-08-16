// Logger.js file
function success(msg) {
    console.log("\x1b[32m%s\x1b[0m", "✅ " + msg);
}

function error(msg) {
    console.log("\x1b[31m%s\x1b[0m", "❌ " + msg);
}

function info(msg) {
    console.log("\x1b[36m%s\x1b[0m", "ℹ️ " + msg);
}

function request(req) {
    console.log(
        "\x1b[33m%s\x1b[0m",
        `➡ ${req.method} ${req.originalUrl}`
    );
}

module.exports = {
    success,
    error,
    info,
    request
};