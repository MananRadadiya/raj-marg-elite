/**
 * Gujarat Smart Distance Matrix
 * Realistic approximate road distances in km between major Gujarat cities.
 */

const DISTANCE_MATRIX = {
  'Ahmedabad-Surat': 265,
  'Ahmedabad-Vadodara': 111,
  'Ahmedabad-Rajkot': 216,
  'Ahmedabad-Gandhinagar': 29,
  'Ahmedabad-Bhavnagar': 198,
  'Ahmedabad-Jamnagar': 306,
  'Ahmedabad-Junagadh': 327,
  'Ahmedabad-Dwarka': 441,
  'Ahmedabad-Somnath': 412,
  'Ahmedabad-Kutch (Bhuj)': 333,
  'Ahmedabad-Anand': 68,
  'Ahmedabad-Nadiad': 52,
  'Ahmedabad-Morbi': 245,
  'Ahmedabad-Mehsana': 74,
  'Ahmedabad-Navsari': 323,
  'Ahmedabad-Valsad': 368,
  'Ahmedabad-Bharuch': 193,
  'Ahmedabad-Porbandar': 392,
  'Ahmedabad-Mount Abu': 222,
  'Ahmedabad-Statue of Unity': 200,
  'Ahmedabad-Mumbai': 524,
  'Surat-Vadodara': 161,
  'Surat-Rajkot': 460,
  'Surat-Gandhinagar': 292,
  'Surat-Bhavnagar': 378,
  'Surat-Jamnagar': 556,
  'Surat-Junagadh': 540,
  'Surat-Navsari': 38,
  'Surat-Valsad': 86,
  'Surat-Bharuch': 80,
  'Surat-Mumbai': 284,
  'Surat-Anand': 178,
  'Surat-Statue of Unity': 146,
  'Vadodara-Rajkot': 290,
  'Vadodara-Gandhinagar': 131,
  'Vadodara-Bhavnagar': 268,
  'Vadodara-Jamnagar': 420,
  'Vadodara-Junagadh': 435,
  'Vadodara-Bharuch': 72,
  'Vadodara-Anand': 42,
  'Vadodara-Nadiad': 58,
  'Vadodara-Statue of Unity': 90,
  'Vadodara-Mumbai': 392,
  'Rajkot-Gandhinagar': 245,
  'Rajkot-Bhavnagar': 170,
  'Rajkot-Jamnagar': 96,
  'Rajkot-Junagadh': 103,
  'Rajkot-Dwarka': 233,
  'Rajkot-Somnath': 219,
  'Rajkot-Morbi': 64,
  'Rajkot-Porbandar': 186,
  'Rajkot-Kutch (Bhuj)': 245,
  'Bhavnagar-Jamnagar': 280,
  'Bhavnagar-Junagadh': 188,
  'Bhavnagar-Somnath': 266,
  'Bhavnagar-Gandhinagar': 225,
  'Jamnagar-Junagadh': 148,
  'Jamnagar-Dwarka': 137,
  'Jamnagar-Porbandar': 112,
  'Jamnagar-Kutch (Bhuj)': 296,
  'Junagadh-Somnath': 84,
  'Junagadh-Dwarka': 232,
  'Gandhinagar-Mehsana': 52,
  'Gandhinagar-Nadiad': 75,
};

/**
 * Get distance between two cities.
 * Returns km or 0 if route not found.
 */
export function getDistance(from, to) {
  if (!from || !to || from === to) return 0;
  const key1 = `${from}-${to}`;
  const key2 = `${to}-${from}`;
  return DISTANCE_MATRIX[key1] || DISTANCE_MATRIX[key2] || 0;
}

/**
 * Estimate toll charges based on distance and route.
 */
export function estimateToll(distance) {
  if (distance <= 50) return 0;
  if (distance <= 150) return 80;
  if (distance <= 300) return 180;
  if (distance <= 500) return 320;
  return 450;
}

/**
 * Driver stay charge for long-distance round trips.
 */
export const DRIVER_STAY_CHARGE = 800;
export const DRIVER_STAY_THRESHOLD = 250;

export default DISTANCE_MATRIX;
