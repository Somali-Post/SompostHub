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

    const events = (records as any[]).map((record: any) => {
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

    const originCode =
      typeof first.countryCode === 'string' && first.countryCode.length === 2
        ? first.countryCode
        : cleanId.slice(-2);
    const destCode = cleanId.slice(-2);

    let originName = originCode;
    let destName = destCode;
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      originName = regionNames.of(originCode) || originCode;
      destName = regionNames.of(destCode) || destCode;
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
