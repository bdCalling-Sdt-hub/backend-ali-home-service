/* eslint-disable @typescript-eslint/no-explicit-any */
import admin from 'firebase-admin';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { IsendNotification } from './notification.inerface';
import Notification from './notification.model';

// import firebase from "../../../public/"
admin.initializeApp({
  credential: admin.credential.cert('./firebase.json'),
  // credential: admin.credential.cert(clinicaSericeAccountFile),
});

export const sendNotification = async (
  fcmToken: string[],
  payload: IsendNotification,
): Promise<unknown> => {
  console.log('token', fcmToken);
  console.log(payload);
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      apns: {
        headers: {
          'apns-push-type': 'alert',
        },
        payload: {
          aps: {
            badge: 1,
            sound: 'default',
          },
        },
      },
    });
    console.log('response', response);
    if (response?.successCount > 0) {
      console.log('response', response);
      fcmToken?.map(async (token) => {
        await Notification.create({
          receiver: payload?.data?.receiver,
          title: payload.title,
          message: payload?.body,
          date: new Date(),
          time: new Date().getTime,
          type: payload?.data?.type,
        });
      });
    }
    if (response?.failureCount > 0) {
      console.log('Some tokens failed:');
      response.responses.forEach((res, index) => {
        if (!res.success) {
          console.error(
            `Error for token at index ${index}: ${JSON.stringify(res.error)}`,
          );
        }
      });
    }
    return response;
  } catch (error: any) {
    console.dir('Error sending message:', error);
    if (error?.code === 'messaging/third-party-auth-error') {
      return null;
    } else {
      console.error('Error sending message:', error);
      throw new AppError(
        httpStatus.NOT_IMPLEMENTED,
        error.message || 'Failed to send notification',
      );
    }
  }
};
