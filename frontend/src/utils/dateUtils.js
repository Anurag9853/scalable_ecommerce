import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const IST_TZ = 'Asia/Kolkata';

export const formatISTDateTime = (isoString) =>
  dayjs(isoString).tz(IST_TZ).format('DD-MM-YYYY HH:mm');

export const formatISTDate = (isoString) =>
  dayjs(isoString).tz(IST_TZ).format('DD-MM-YYYY');

export const calculateDeliveryEstimate = (from = new Date()) => {
  const minDays = 3;
  const maxDays = 5;
  const start = dayjs(from).tz(IST_TZ).add(minDays, 'day');
  const end = dayjs(from).tz(IST_TZ).add(maxDays, 'day');
  return `${start.format('DD-MM-YYYY')} - ${end.format('DD-MM-YYYY')}`;
};

