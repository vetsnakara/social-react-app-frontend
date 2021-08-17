config = {
    target: "node",
    entry: "./generateHtml.es6.js",
    output: {
        path: __dirname,
        filename: "generateHtml.js",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-react",
                            ["@babel/preset-env", { targets: { node: "12" } }],
                        ],
                    },
                },
            },
        ],
    },
}

module.exports = config
