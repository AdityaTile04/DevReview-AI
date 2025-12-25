import "dotenv/config";
import app from "./app";
import { signToken } from "./utils/jwt";

const PORT = process.env.PORT || 3001;

console.log(
  "TEST JWT: ",
  signToken({ userId: "demo", email: "demo@gmail.com" })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
