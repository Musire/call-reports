import { NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return new Response("Missing token", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    if (!startTime || !endTime) {
      return new Response("Missing query params", { status: 400 });
    }

    const upstreamRes = await fetch(
      `https://remote-expert.dtinterpreting.video/expert/report-download?startTime=${startTime}&endTime=${endTime}`,
      {
        headers: {
          Authorization: authHeader,
          Accept: "text/csv",
        },
        cache: "no-store",
      }
    );

    if (!upstreamRes.ok) {
      return new Response("Failed to fetch upstream report", {
        status: upstreamRes.status,
      });
    }

    const data = await upstreamRes.text();

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=report.csv",
      },
    });
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}