import { Timestamp } from 'firebase/firestore';

export const timestampToDate = (timestamp: Timestamp) => {
  const dateObject = timestamp?.toDate();
  const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(dateObject);
  return formattedDate;
};
