import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignDriverToBooking } from '../redux/driverSlice';
import { updateBookingStatus } from '../redux/bookingSlice';
import { addToast } from '../redux/notificationSlice';

/**
 * Hook that auto-assigns a driver after payment and runs the
 * Confirmed → On The Way → Arrived → Completed lifecycle.
 */
export default function useAutoAssignDriver() {
  const dispatch = useDispatch();
  const { drivers } = useSelector((s) => s.driver);

  const assignAndSimulate = useCallback(
    (booking) => {
      if (!booking?.id) return;

      /* Pick a random available driver */
      const available = drivers.filter((d) => d.status === 'available');
      const driver = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : drivers[0];

      if (!driver) return;

      /* Assign driver */
      dispatch(
        assignDriverToBooking({
          bookingId: booking.id,
          driverId: driver.id,
          bookingDetails: {
            from: booking.from,
            to: booking.to,
            carType: booking.carType,
            distance: booking.distance,
            tripType: booking.tripType,
          },
        })
      );

      /* Mark confirmed (already done in payment, but ensure) */
      dispatch(updateBookingStatus({ id: booking.id, status: 'confirmed' }));
      dispatch(addToast({ message: 'Booking confirmed! Driver assigned.', type: 'booking' }));

      /* Simulate auto-progression */
      setTimeout(() => {
        dispatch(addToast({ message: `${driver.name} is on the way!`, type: 'driver' }));
      }, 5000);

      setTimeout(() => {
        dispatch(addToast({ message: `${driver.name} has arrived!`, type: 'driver' }));
      }, 10000);

      setTimeout(() => {
        dispatch(addToast({ message: 'Ride completed! Rate your experience.', type: 'ride' }));
      }, 15000);
    },
    [dispatch, drivers]
  );

  return assignAndSimulate;
}
