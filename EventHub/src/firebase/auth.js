import { app } from "./base";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

export { auth };
