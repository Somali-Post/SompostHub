import { NextResponse } from 'next/server';
import { getEventInfo, parsePTTDate } from '@/lib/tracking-utils';

const UPU_TOKEN = process.env.UPU_PTT_TOKEN;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // FIX: Type as Promise
) {
  // FIX: Await the params
  const { id } = await params;
  const cleanId = id.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (!UPU_TOKEN) {
    return NextResponse.json({ error: 'API Configuration Error: Missing Token' }, { status: 500 });
  }

  try {
    // 1. Call Upstream PTT API
    const url = `https://ptt.ptc.post/PTT.API/Service.svc/rest/itemTTExt/${cleanId}/${UPU_TOKEN}`;
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'User-Agent': 'SomaliPost/1.0' },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Tracking provider error (${res.status})` },
        { status: 502 }
      );
    }

    const rawText = await res.text();
    if (!rawText.trim()) {
      return NextResponse.json({
        found: false,
        trackingId: cleanId,
        message: 'No tracking data returned.',
      });
    }

    let rawData: unknown;
    try {
      rawData = JSON.parse(rawText);
    } catch (parseError) {
      return NextResponse.json({
        found: false,
        trackingId: cleanId,
        message: 'Tracking response format not supported.',
      });
    }

    // 2. Handle "Not Found" (API returns literal "1")
    if (rawData === '1' || rawData === 1 || !rawData) {
      return NextResponse.json({ 
        found: false, 
        trackingId: cleanId,
        message: 'Item not found in global network.' 
      });
    }

    if (typeof rawData !== 'object') {
      return NextResponse.json({
        found: false,
        trackingId: cleanId,
        message: 'Tracking response format not supported.',
      });
    }

    // 3. Normalize Data
    const records = Array.isArray(rawData) ? rawData : [rawData];
    const originCode = cleanId.slice(-2);

    const eventsSource = records.flatMap((record: any) =>
      Array.isArray(record?.Events) ? record.Events : [record]
    );

    const destinationCode =
      typeof (records[0] as any)?.DestinationCountryCd === 'string'
        ? (records[0] as any).DestinationCountryCd
        : cleanId.slice(-2);

    const events = (eventsSource as any[])
      .map((record: any) => {
        const eventCode = record.EventCode || record.EventCd || 'UNKNOWN';
        const eventDate = record.EventDate || record.EventDT;
        const location =
          record.EventOfficeName ||
          record.EventOfficeCode ||
          record.EventLocation ||
          record.EventOffice ||
          'Unknown';

        const date = parsePTTDate(eventDate);
        const info = getEventInfo(eventCode);
        const eventLabel = record.EventNm || info.label;
        const eventDescription = record.EventNm
          ? record.EventNm
          : info.label === 'Processing'
            ? `Unknown event code: ${eventCode}`
            : info.description;
        const locationCountry = /^[A-Z]{2}/.test(location)
          ? location.slice(0, 2)
          : destinationCode;

        return {
          code: eventCode,
          location,
          timestamp: date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          rawDate: date,
          status: eventLabel === 'Processing' ? `Event ${eventCode}` : eventLabel,
          explanation: eventDescription,
          countryCode: locationCountry,
        };
      })
      .sort((a: any, b: any) => b.rawDate - a.rawDate);

    if (events.length === 0) {
      return NextResponse.json({ found: false, trackingId: cleanId });
    }

    const latest = events[0];
    const first = events[events.length - 1];

    const destCode = destinationCode;

    let originName = (records[0] as any)?.OriginCountryNm || originCode;
    let destName = (records[0] as any)?.DestinationCountryNm || destCode;
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      if (originName === originCode) {
        originName = regionNames.of(originCode) || originCode;
      }
      if (destName === destCode) {
        destName = regionNames.of(destCode) || destCode;
      }
    } catch (error) {
      originName = originCode;
      destName = destCode;
    }

    return NextResponse.json({
      found: true,
      trackingId: cleanId,
      status: latest.status,
      latestEventCode: latest.code,
      origin: originName,
      originCode: originCode,
      destination: destName,
      destinationCode: destCode,
      history: events
    });

  } catch (error) {
    console.error('TRACKING API ERROR:', error);
    return NextResponse.json({ error: 'Tracking Service Unavailable' }, { status: 500 });
  }
}
