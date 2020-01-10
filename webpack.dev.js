const common = require("./webpack.common");
const merge = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/"
    },
    // devServer: {
    //     port: 3000,
    //     open: true,
    //     proxy: {
    //         "/": "http://localhost:8080"
    //     }
    // }
    devServer: {
        historyApiFallback: true
    }
})