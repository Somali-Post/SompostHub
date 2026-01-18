export type S9Data = {
  isValid: boolean;
  id: string;
  origin: string;
  destination: string;
  category: string;
  year: string;
  serial: string;
  weightKg: number;
};

export function parseS9(id: string): S9Data {
  const clean = id.toUpperCase().replace(/\s/g, '');

  if (clean.length !== 29) {
    return {
      isValid: false,
      id: clean,
      origin: '',
      destination: '',
      category: '',
      year: '',
      serial: '',
      weightKg: 0,
    };
  }

  const origin = clean.substring(0, 6);
  const destination = clean.substring(6, 12);
  const category = clean.substring(12, 13);
  const year = clean.substring(15, 16);
  const serial = clean.substring(20, 23);

  const weightStr = clean.substring(25, 29);
  const weightKg = parseInt(weightStr, 10) / 10;

  return {
    isValid: true,
    id: clean,
    origin,
    destination,
    category,
    year,
    serial,
    weightKg,
  };
}
