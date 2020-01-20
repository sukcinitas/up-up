const common = require("./webpack.common");
const merge = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    output: {
        filename: "main.js",
        path: path.join(__dirname, "dist"),
        publicPath: "/"
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        open: true,
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:8080/",
                secure: false
            }
        }
    }
})