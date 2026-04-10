import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateBookingStatus } from '../redux/bookingSlice';

/**
 * Simulates booking status progression:
 * pending → confirmed (after 5s) → completed (after 90s)
 */
export default function useBookingStatusSimulation(bookingId, currentStatus) {
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!bookingId) return;

    if (currentStatus === 'pending') {
      timerRef.current = setTimeout(() => {
        dispatch(updateBookingStatus({ id: bookingId, status: 'confirmed' }));
      }, 5000);
    } else if (currentStatus === 'confirmed') {
      timerRef.current = setTimeout(() => {
        dispatch(updateBookingStatus({ id: bookingId, status: 'completed' }));
      }, 90000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [bookingId, currentStatus, dispatch]);
}
