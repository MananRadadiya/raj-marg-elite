import { getDistance, estimateToll, DRIVER_STAY_CHARGE, DRIVER_STAY_THRESHOLD } from './distanceMatrix';

/**
 * Calculate total fare for a ride.
 * Formula: Total = (Distance × PerKmPrice × DriverMultiplier) + TollEstimate + DriverStayCharge
 */
export function calculateFare({
    distance,
    perKm,
    driverMultiplier = 1,
    tollCharges = 0,
    isRoundTrip = false,
    oneWayDistance = 0,
}) {
    const baseFare = distance * perKm;
    const driverAdjusted = baseFare * driverMultiplier;
    const driverSurcharge = driverAdjusted - baseFare;
    const tollEstimate = tollCharges > 0 ? tollCharges : estimateToll(distance);
    const driverStayCharge =
        isRoundTrip && oneWayDistance > DRIVER_STAY_THRESHOLD ? DRIVER_STAY_CHARGE : 0;
    const total = driverAdjusted + tollEstimate + driverStayCharge;

    return {
        baseFare: Math.round(baseFare),
        distanceFare: Math.round(baseFare),
        driverSurcharge: Math.round(driverSurcharge),
        driverMultiplierPercent: Math.round((driverMultiplier - 1) * 100),
        tollEstimate: Math.round(tollEstimate),
        tollCharges: Math.round(tollEstimate),
        driverStayCharge,
        isRoundTrip,
        oneWayDistance,
        totalDistance: distance,
        total: Math.round(total),
    };
}

/**
 * Format currency in INR.
 */
export function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Get smart distance between two Gujarat cities.
 */
export function getSmartDistance(from, to) {
    return getDistance(from, to);
}

/**
 * Popular Gujarat routes with approximate distances (km).
 */
export const gujaratRoutes = [
    { from: 'Ahmedabad', to: 'Surat', distance: 265 },
    { from: 'Ahmedabad', to: 'Vadodara', distance: 111 },
    { from: 'Ahmedabad', to: 'Rajkot', distance: 216 },
    { from: 'Ahmedabad', to: 'Gandhinagar', distance: 29 },
    { from: 'Ahmedabad', to: 'Bhavnagar', distance: 198 },
    { from: 'Ahmedabad', to: 'Jamnagar', distance: 306 },
    { from: 'Ahmedabad', to: 'Junagadh', distance: 327 },
    { from: 'Ahmedabad', to: 'Dwarka', distance: 441 },
    { from: 'Ahmedabad', to: 'Somnath', distance: 412 },
    { from: 'Ahmedabad', to: 'Kutch (Bhuj)', distance: 333 },
    { from: 'Surat', to: 'Vadodara', distance: 161 },
    { from: 'Surat', to: 'Mumbai', distance: 284 },
    { from: 'Rajkot', to: 'Dwarka', distance: 233 },
    { from: 'Vadodara', to: 'Statue of Unity', distance: 90 },
    { from: 'Ahmedabad', to: 'Mount Abu', distance: 222 },
];

export const gujaratCities = [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar',
    'Bhavnagar', 'Jamnagar', 'Junagadh', 'Dwarka', 'Somnath',
    'Kutch (Bhuj)', 'Anand', 'Nadiad', 'Morbi', 'Mehsana',
    'Navsari', 'Valsad', 'Bharuch', 'Porbandar', 'Mount Abu',
    'Statue of Unity', 'Mumbai',
];

export { DRIVER_STAY_CHARGE, DRIVER_STAY_THRESHOLD };
