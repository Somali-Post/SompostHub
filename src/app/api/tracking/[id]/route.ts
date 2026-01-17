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
      headers: { 'User-Agent': 'SomaliPost/1.0' }
    });

    if (!res.ok) {
      throw new Error(`Upstream API Error: ${res.status}`);
    }

    const rawData = await res.json();

    // 2. Handle "Not Found" (API returns literal "1")
    if (rawData === '1' || !rawData) {
      return NextResponse.json({ 
        found: false, 
        trackingId: cleanId,
        message: 'Item not found in global network.' 
      });
    }

    // 3. Normalize Data
    const records = Array.isArray(rawData) ? rawData : [rawData];
    
    const events = records.map((record: any) => {
      const date = parsePTTDate(record.EventDate);
      const info = getEventInfo(record.EventCode);
      
      return {
        code: record.EventCode,
        location: record.EventOfficeName || record.EventOfficeCode,
        timestamp: date.toLocaleString('en-GB', { 
          day: '2-digit', month: 'short', year: 'numeric', 
          hour: '2-digit', minute: '2-digit' 
        }),
        rawDate: date,
        status: info.label,
        explanation: info.description,
        countryCode: record.EventCountryCode
      };
    }).sort((a: any, b: any) => b.rawDate - a.rawDate);

    if (events.length === 0) {
      return NextResponse.json({ found: false, trackingId: cleanId });
    }

    const latest = events[0];
    const first = events[events.length - 1];

    const originCode = first.countryCode;
    const destCode = cleanId.slice(-2);
    
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const originName = regionNames.of(originCode) || originCode;
    const destName = regionNames.of(destCode) || destCode;

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
