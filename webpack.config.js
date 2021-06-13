require("dotenv").config();

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require("postcss-preset-env");

const env = process.env.ENV || "development";

console.log(`Run file: webpack.config.js`);
console.log(`Enviroment = ${env}`);
console.log(`\n---\n`);

const config = {
	mode: env,
	entry: {
		css: [
			"./resources/scss/app.scss",
			"./resources/scss/libraries/font-awesome.scss",
		],
		js: ["./resources/js/app.js"],
		images: ["./resources/images/New_Logo.png"],
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
	devtool: "source-map",
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
																browsers: [
																	">1%",
																],
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
				test: /\.(ico|png|jpe?g|gif)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "./images",
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
						name: "[path][name].[ext]",
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
