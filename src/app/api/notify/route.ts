import { NextResponse } from "next/server";
import crypto from "crypto";

// --- Helper: Hash Data untuk Keamanan & Kualitas Matching (SHA256) ---
function hashSHA256(value?: string): string | undefined {
  if (!value) return undefined;
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

// --- Helper: Generate Unique ID untuk Deduplikasi Event ---
function generateEventId(): string {
  return crypto.randomUUID();
}

export async function POST(request: Request) {
  // --- TELEGRAM CONFIG ---
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // --- META CAPI CONFIG ---
  const PIXEL_ID = "750363290827556";
  const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;

  // Cek Konfigurasi Telegram
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

    // Ambil IP Address User
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "0.0.0.0";

    // Format Jadwal agar mudah dibaca
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

    // Format Nomor WA (62xxx) untuk link & hashing
    const waNumber = whatsapp?.replace(/^0/, "62")?.replace(/\+/g, "");

    // --- 1. KIRIM NOTIFIKASI TELEGRAM ---
    const message = `
🔔 *LEADS BARU MASUK!*

👤 *Nama:* ${nama || "-"}
📱 *WA:* ${waNumber ? `[${waNumber}](https://wa.me/${waNumber})` : "-"}
📍 *Domisili:* ${domisili || "-"}
📅 *Jadwal Cek Lokasi:* ${jadwalString}

📊 *Sumber Traffic*
• Source: ${utm_source || "Direct"}
• Medium: ${utm_medium || "-"}
• Campaign: ${utm_campaign || "-"}

📝 *Pesan:* ${keterangan || "-"}

_Segera follow up via Dashboard Admin_
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

    // --- 2. KIRIM KE META CONVERSION API (SERVER-SIDE) ---
    if (ACCESS_TOKEN) {
      const eventId = generateEventId();

      const eventData = {
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            action_source: "website",
            // [UPDATE] Parameter URL Sumber Peristiwa (Wajib dicentang di Facebook)
            event_source_url:
              request.headers.get("referer") || "https://www.haspro.me",

            user_data: {
              client_ip_address: ip,
              client_user_agent: user_agent,
              // Data sensitif di-hash SHA256 sesuai standar keamanan Meta
              ph: waNumber ? [hashSHA256(waNumber)] : undefined,
              fn: nama ? [hashSHA256(nama)] : undefined,
              ct: domisili ? [hashSHA256(domisili)] : undefined,
            },
            custom_data: {
              content_name: "Property Consultation",
              currency: "IDR",
              value: 390000000, // Nilai Leads (bisa disesuaikan)
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
