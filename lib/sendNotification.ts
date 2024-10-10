import admin from "./firebaseadmin";

export type SendNotificationOptions = {
  fcmToken: string;
  title: string;
  body: string;
  image: string | undefined;
};

export default function sendNotification(options: SendNotificationOptions) {
  return admin.messaging().send({
    token: options.fcmToken,
    notification: {
      body: options.body,
      title: options.title,
      imageUrl: options?.image,
    },
    android: {
      notification: {
        color: "#7F00FF",
        imageUrl: options?.image,
      },
    },
  });
}
