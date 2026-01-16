export type UPUData = {
  isValid: boolean;
  type: 'EMS' | 'PARCEL' | 'REGISTERED' | 'UNKNOWN';
  countryCode: string;
  countryName: string;
  serviceIndicator: string;
  serial: string;
};

export function parseS10(id: string): UPUData {
  const cleanId = id.toUpperCase().replace(/\s/g, '');

  const regex = /^([A-Z]{2})([0-9]{9})([A-Z]{2})$/;
  const match = cleanId.match(regex);

  if (!match) {
    return {
      isValid: false,
      type: 'UNKNOWN',
      countryCode: '',
      countryName: '',
      serviceIndicator: '',
      serial: '',
    };
  }

  const [, service, serialFull, country] = match;

  let type: UPUData['type'] = 'UNKNOWN';
  const indicator = service[0];
  if (indicator === 'E') type = 'EMS';
  else if (indicator === 'C') type = 'PARCEL';
  else if (indicator === 'R' || indicator === 'L' || indicator === 'U') type = 'REGISTERED';

  let countryName = country;
  try {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    countryName = regionNames.of(country) || country;
  } catch (e) {}

  const weights = [8, 6, 4, 2, 3, 5, 9, 7];
  const digits = serialFull.split('').map(Number);
  const checkDigit = digits.pop()!;

  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * weights[i];
  }

  let calculatedCheck = 11 - (sum % 11);
  if (calculatedCheck === 10) calculatedCheck = 0;
  if (calculatedCheck === 11) calculatedCheck = 5;

  return {
    isValid: calculatedCheck === checkDigit,
    type,
    countryCode: country,
    countryName,
    serviceIndicator: service,
    serial: serialFull,
  };
}
