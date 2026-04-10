/**
 * Carbon footprint calculator for road travel.
 * Average CO₂ emission: ~120g/km for petrol cars.
 */

const EMISSIONS_PER_KM = {
  mini: 110,      // grams CO₂ per km
  sedan: 130,
  suv: 170,
  'premium-suv': 185,
  luxury: 200,
};

export function calculateCarbonFootprint(distanceKm, carType = 'sedan') {
  const gPerKm = EMISSIONS_PER_KM[carType] || 130;
  const totalGrams = distanceKm * gPerKm;
  const totalKg = totalGrams / 1000;

  // Comparisons
  const treesNeeded = (totalKg / 22).toFixed(1); // 1 tree absorbs ~22kg CO₂/year
  const flightEquivalent = (totalKg / 0.255).toFixed(0); // 255g CO₂ per flight-km
  const trainSaved = Math.round(totalKg * 0.6); // Train emits ~40% less

  return {
    totalGrams: Math.round(totalGrams),
    totalKg: parseFloat(totalKg.toFixed(2)),
    treesNeeded: parseFloat(treesNeeded),
    flightEquivalentKm: parseInt(flightEquivalent),
    trainSavedGrams: trainSaved,
    rating: totalKg < 5 ? 'green' : totalKg < 15 ? 'yellow' : 'red',
    ratingLabel: totalKg < 5 ? 'Eco-Friendly' : totalKg < 15 ? 'Moderate' : 'High Impact',
  };
}

export const ECO_TIPS = [
  'Share your ride to reduce per-person emissions',
  'Choose a Mini or Sedan for shorter trips',
  'Schedule morning rides to avoid traffic congestion',
  'Round trips save more CO₂ than separate one-ways',
  'Electric vehicles coming soon to RajMarg fleet!',
];
