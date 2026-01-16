export const countryCodeToFlag = (isoCode: string) => {
  if (!isoCode) return '🏳️';
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
};

export const getEventInfo = (code: string) => {
  const map: Record<string, { label: string; description: string }> = {
    EMA: { label: 'Posted', description: 'Item posted at collection point' },
    EMB: { label: 'Arrival at Outward OE', description: 'Arrived at origin processing center' },
    EMC: { label: 'Departure from Outward OE', description: 'Departed origin country' },
    EMD: { label: 'Arrival at Inward OE', description: 'Arrived in destination country' },
    EME: { label: 'Held by Customs', description: 'Item held for customs inspection' },
    EMF: { label: 'Departure from Inward OE', description: 'Customs cleared, en route to delivery' },
    EMG: { label: 'Arrival at Delivery Office', description: 'At local post office' },
    EMH: { label: 'Attempted Delivery', description: 'Delivery attempted, recipient not home' },
    EMI: { label: 'Final Delivery', description: 'Item delivered to recipient' },
    EMJ: { label: 'Arrival at Transit OE', description: 'Arrived at transit country' },
    EMK: { label: 'Departure from Transit OE', description: 'Departed transit country' },
  };
  return map[code] || { label: 'Processing', description: 'Operational processing' };
};

export const parsePTTDate = (dateString: string) => {
  if (!dateString) return new Date();
  const timestamp = parseInt(dateString.replace(/\/Date\((.*?)\)\//, '$1'));
  return new Date(timestamp);
};
