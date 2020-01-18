const common = require("./webpack.common");
const merge = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    output: {
        filename: "main.js",
        path: path.join(__dirname, "dist"),
    },
    devServer: {
        // historyApiFallback: true,
        // hot: true,
        // inline: true,
        // host: "localhost",
        open: true,
        port: 3000,
        proxy: {
            "/": {
                target: "http://localhost:8080",
            }
        }
    }
})