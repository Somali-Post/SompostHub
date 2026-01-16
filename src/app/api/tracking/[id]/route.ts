import { NextResponse } from "next/server";
import { parseS10 } from "@/lib/upu";

const UPU_API_URL =
  process.env.UPU_API_URL || "https://globaltrack.upu.int/api/v1";
const UPU_TOKEN = process.env.UPU_TOKEN;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const localData = parseS10(id);

  let remoteEvents: any[] = [];

  if (UPU_TOKEN && localData.isValid) {
    try {
      // const res = await fetch(`${UPU_API_URL}/track/${id}`, {
      //   headers: { Authorization: `Bearer ${UPU_TOKEN}` },
      // });
      // const data = await res.json();
      // remoteEvents = data.events;
    } catch (error) {
      console.error("UPU API Error:", error);
    }
  }

  return NextResponse.json({
    id,
    ...localData,
    events: remoteEvents,
  });
}
