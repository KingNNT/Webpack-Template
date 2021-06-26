require("dotenv").config();

const WebpackHelper = require("./app/helper/webpack.entry");

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require("postcss-preset-env");

const env = "production";

console.log(`Run file: webpack.development.js`);
console.log(`Enviroment = ${env}`);
console.log(`\n---\n`);

if (env != "production") process.exit();

/* ------------------------------------------------------------ */
let entryCSS = ["./resources/scss/app.scss"].concat(
    WebpackHelper.entry("./resources/scss/libraries/**.scss")
);
let entryJS = ["./resources/js/app.js"].concat(
    WebpackHelper.entry("./resources/js/libraries/**.js")
);
let entryImage = WebpackHelper.entry("./resources/js/libraries/*");
let entryFont = WebpackHelper.entry("./resources/fonts/Roboto/*");

/* ------------------------------------------------------------ */
/*                      CONFIG FOR WEBPACK                      */
/* ------------------------------------------------------------ */

const config = {
    mode: env,
    entry: {
        css: entryCSS,
        js: entryJS,
        images: entryImage,
        fonts: entryFont,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].bundle.js",
        sourceMapFilename: "[name].map",
        library: {
            name: "MyLibrary",
            type: "var",
        },
    },
    module: {
        rules: [
            /* SETING FOR SCSS */
            {
                test: /\.(sa|sc)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: "sass-loader",
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {
                                            ident: "postcss",
                                            plugins:
                                                env == "development"
                                                    ? () => []
                                                    : () => [
                                                          postcssPresetEnv({
                                                              browsers: [">1%"],
                                                          }),
                                                          require("cssnano")(),
                                                      ],
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                ],
            },
            /* SETTING FOR IMAGES */
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "./images",
                            publicPath: "auto",
                            emitFile: true,
                        },
                    },
                ],
            },
            /* FONT TEXT */
            {
                test: /\.(eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "./fonts",
                        publicPath: "auto",
                        emitFile: true,
                    },
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: env == "development" ? "css/app.css" : "css/app.min.css",
        }),
    ],
};

module.exports = config;
