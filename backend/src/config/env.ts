import dotenv from "dotenv";
import path from "path";

export const loadEnv = () => {
  dotenv.config({
    path: path.resolve(__dirname, "../.env"),
  });
};
