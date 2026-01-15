import { NextResponse } from "next/server";
import crypto from "crypto";

function hashSHA256(value?: string): string | undefined {
  if (!value) return undefined;
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function generateEventId(): string {
  return crypto.randomUUID();
}

export async function POST(request: Request) {
  // --- TELEGRAM CONFIG ---
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // --- META CAPI CONFIG ---
  const PIXEL_ID = "1547111949891286";
  const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;

  if (!botToken || !chatId) {
    console.error("❌ TELEGRAM CONFIG MISSING");
    return NextResponse.json(
      { success: false, error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      nama,
      whatsapp,
      domisili,
      keterangan,
      jadwal,
      utm_source,
      utm_medium,
      utm_campaign,
      user_agent,
    } = body;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "0.0.0.0";

    const isClickOnly = nama === "Visitor (Click Only)" || whatsapp === "-";

    let jadwalString = "-";
    if (jadwal) {
      const dateObj = new Date(jadwal);
      if (!isNaN(dateObj.getTime())) {
        jadwalString = dateObj.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } else {
        jadwalString = jadwal;
      }
    }

    let waNumber = "";
    if (whatsapp && whatsapp !== "-" && whatsapp.length > 5) {
      waNumber = whatsapp.replace(/^0/, "62").replace(/\+/g, "");
    }

    const telegramTitle = isClickOnly
      ? "🖱️ *TRAFFIC: CLICK WA (FLOATING)*"
      : "🔔 *LEADS BARU MASUK!*";

    const waLinkDisplay = waNumber
      ? `[${waNumber}](https://wa.me/${waNumber})`
      : "-";

    const message = `
${telegramTitle}

👤 *Nama:* ${nama || "-"}
📱 *WA:* ${waLinkDisplay}
📍 *Domisili:* ${domisili || "-"}
📅 *Jadwal Cek Lokasi:* ${jadwalString}

📊 *Sumber Traffic*
• Source: ${utm_source || "Direct"}
• Medium: ${utm_medium || "-"}
• Campaign: ${utm_campaign || "-"}

📝 *Pesan:* ${keterangan || "-"}

_Cek Dashboard untuk detail lengkap_
`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    // --- 3. KIRIM KE META CONVERSION API (SERVER-SIDE) ---
    if (ACCESS_TOKEN) {
      const eventId = generateEventId();

      const fbEventName = isClickOnly ? "Contact" : "Lead";
      const fbValue = isClickOnly ? 0 : 0;

      const userDataCapi = {
        client_ip_address: ip,
        client_user_agent: user_agent,
        ph: waNumber ? [hashSHA256(waNumber)] : undefined,
        fn: !isClickOnly && nama ? [hashSHA256(nama)] : undefined,
        ct: !isClickOnly && domisili ? [hashSHA256(domisili)] : undefined,
      };

      const eventData = {
        data: [
          {
            event_name: fbEventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            action_source: "website",
            event_source_url:
              request.headers.get("referer") || "https://www.casadekayana.com",
            user_data: userDataCapi,
            custom_data: {
              content_name: isClickOnly
                ? "WhatsApp Click"
                : "Property Consultation",
              currency: "IDR",
              value: fbValue,
              lead_status: "new",
            },
          },
        ],
      };

      // Fire to Facebook Graph API
      await fetch(
        `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Lead API Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim lead" },
      { status: 500 }
    );
  }
}
