"use strict";
//https://github.com/theodybrothers/webpack-bootstrap/
var webpack = require("webpack"),
        path = require("path");

module.exports = {
    entry: {
        "dashboard": path.join(__dirname, "src/client/dashboard.js"),
    },
    output: {
        publicPath: "assets/bundle/",
        path: path.join(__dirname, 'public/assets/bundle'),
        filename: "[name].js",
    },
    module: {
        loaders: [
            {test: /\.css$/, loader:  'style-loader!css-loader'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.(woff|woff2)$/, loader: "url?prefix=font/&limit=5000"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
        ]
    }
};