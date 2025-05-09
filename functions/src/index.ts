import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

/** Callable ping for local testing */
export const helloWorld = onCall(async () => {
  logger.info("Hello from Cloud Functions v2!");
  return { message: "pong" };
});
