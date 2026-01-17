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
    // Export (Leaving Origin)
    EMA: { label: 'Posted / Collected', description: 'Sender has dropped off the package. Tracking begun.' },
    EMB: {
      label: 'Arrived at Export Center',
      description: 'Package at international mail center, preparing for export.',
    },
    EXA: {
      label: 'Export Customs Check',
      description: 'Package being checked by security/customs before leaving.',
    },
    EXB: { label: 'Held by Export Customs', description: 'Stopped by security/customs for inspection.' },
    EXC: {
      label: 'Released by Export Customs',
      description: 'Inspection complete. Released back to postal operator.',
    },
    EXD: {
      label: 'Held at Export Center',
      description: 'Delayed at international mail center (e.g. waiting for flight).',
    },
    EMC: { label: 'Departed Origin Country', description: 'Package has left the country and is en route.' },
    EXX: { label: 'Export Cancelled', description: 'Shipment cancelled (prohibited goods or sender request).' },

    // Transit (Intermediate)
    EMJ: { label: 'Arrived at Transit Country', description: 'Landed in a third country (layover) en route.' },
    EMK: { label: 'Departed Transit Country', description: 'Left transit country, continuing to destination.' },

    // Import (Arrival)
    EMD: { label: 'Arrived in Destination Country', description: 'Package has physically arrived.' },
    EDA: {
      label: 'Held at Import Center',
      description: 'Held at incoming center (damaged label, missing docs, etc).',
    },
    EDB: { label: 'Presented to Customs', description: 'Handed over to local customs for inspection/tax.' },
    EME: { label: 'Held by Customs', description: 'Held by customs (duties unpaid or investigation).' },
    EDC: { label: 'Customs Cleared', description: 'Released by customs. Handed back to local post.' },
    EMF: {
      label: 'Departed Import Center',
      description: 'Finished international processing. En route to local delivery area.',
    },

    // Domestic & Delivery
    EDD: { label: 'Entered Sorting Center', description: 'At domestic sorting facility for routing.' },
    EDE: {
      label: 'Departed Sorting Center',
      description: 'Sorting complete. Moving closer to delivery address.',
    },
    EMG: { label: 'Arrived at Local Post Office', description: 'At the final depot responsible for delivery.' },
    EDF: {
      label: 'Held at Delivery Depot',
      description: 'Sitting at local depot (waiting for payment or customer request).',
    },
    EDG: { label: 'Out for Delivery', description: 'On the truck/bike with courier. Arriving today.' },
    EDH: { label: 'Ready for Pickup', description: 'Available at collection point (PO Box / Counter).' },
    EMH: {
      label: 'Delivery Attempted',
      description: 'Courier tried to deliver but failed (recipient not home/closed).',
    },
    EMI: { label: 'Delivered', description: 'Successfully delivered to recipient.' },
    EDX: { label: 'Import Terminated', description: 'Delivery stopped permanently (seized/abandoned/returned).' },
  };
  return map[code] || { label: `Event ${code}`, description: 'Operational processing update.' };
};

export const parsePTTDate = (dateString: string) => {
  if (!dateString) return new Date();
  const timestamp = parseInt(dateString.replace(/\/Date\((.*?)\)\//, '$1'));
  return new Date(timestamp);
};
