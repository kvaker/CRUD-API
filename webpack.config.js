import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: "./src/app.ts",
  target: "node",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
  filename: "bundle.js",
  path: path.resolve(__dirname, "dist"),
  module: true,
  environment: {
    module: true,
  },
},
experiments: {
  outputModule: true,
},

};
