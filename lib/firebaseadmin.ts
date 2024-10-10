import admin from "firebase-admin";

import serviceAccount from "../solnoti.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as never),
});

export default admin;
