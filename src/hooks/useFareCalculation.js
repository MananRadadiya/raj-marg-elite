import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getSmartDistance } from '../utils/fareCalculator';
import { estimateToll } from '../utils/distanceMatrix';
import { calculateFare } from '../utils/fareCalculator';
import cars from '../data/cars';
import driverTiers from '../data/drivers';

export default function useFareCalculation({ from, to, tripType, carType, driverTier }) {
  const prices = useSelector((s) => s.fare.prices);

  const selectedCar = useMemo(() => cars.find((c) => c.id === carType), [carType]);
  const selectedDriver = useMemo(() => driverTiers.find((d) => d.id === driverTier), [driverTier]);

  const oneWayDistance = useMemo(() => getSmartDistance(from, to), [from, to]);
  const totalDistance = useMemo(
    () => (tripType === 'round-trip' ? oneWayDistance * 2 : oneWayDistance),
    [oneWayDistance, tripType]
  );
  const tollEstimate = useMemo(() => estimateToll(totalDistance), [totalDistance]);

  const fare = useMemo(() => {
    if (!oneWayDistance || !selectedCar || !selectedDriver) return null;
    return calculateFare({
      distance: totalDistance,
      perKm: prices[carType] || selectedCar.perKm,
      driverMultiplier: selectedDriver.multiplier,
      tollCharges: tollEstimate,
      isRoundTrip: tripType === 'round-trip',
      oneWayDistance,
    });
  }, [totalDistance, carType, selectedCar, selectedDriver, prices, tollEstimate, tripType, oneWayDistance]);

  return {
    selectedCar,
    selectedDriver,
    oneWayDistance,
    totalDistance,
    tollEstimate,
    fare,
  };
}
