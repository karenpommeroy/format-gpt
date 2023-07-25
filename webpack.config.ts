import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import {Configuration, ProgressPlugin} from "webpack";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
      interface ProcessEnv {
          NODE_ENV?: "none" | "development" | "production"
      }
  }
}

const isDevelopment = process.env.NODE_ENV !== "production";

const config: Configuration = {
    entry: "./src/index.ts",
    mode: process.env.NODE_ENV,
    optimization: {
        minimize: !isDevelopment,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false
                    }
                },
                extractComments: false,
            }),
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        globalObject: "this",
        library: {
            name: "format-gpt",
            type: "umd",
        },
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "json"],
    },
    plugins: [
        new ProgressPlugin()
    ]
};

export default config;
