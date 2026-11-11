
export default async function handler(req, res) {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({
        error: "Method Not Allowed"
      });
    }
  
    const profileUrl = "https://austiblox.net/user/himazin0239";
    const statusElementId =
      "ctl00_cphRoblox_rbxUserPane_lUserOnlineStatus";
  
    try {
      const response = await fetch(profileUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "text/html"
        },
        signal: AbortSignal.timeout(10000)
      });
  
      if (!response.ok) {
        return res.status(502).json({
          error: "Could not retrieve Austiblox profile",
          status: "[ Status unavailable ]"
        });
      }
  
      const html = await response.text();
  
      const escapedId = statusElementId.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
  
      const pattern = new RegExp(
        `<span\\b(?=[^>]*\\bid=["']${escapedId}["'])[^>]*>([\\s\\S]*?)<\\/span>`,
        "i"
      );
  
      const match = html.match(pattern);
  
      if (!match) {
        return res.status(502).json({
          error: "Status element was not found",
          status: "[ Status unavailable ]"
        });
      }
  
      const status = match[1]
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .trim();
  
      if (status !== "[ Online ]" && status !== "[ Offline ]") {
        return res.status(502).json({
          error: "Unknown status format",
          status: "[ Status unavailable ]"
        });
      }
  
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=30, stale-while-revalidate=60"
      );
  
      return res.status(200).json({
        username: "himazin0239",
        status: status
      });
  
    } catch (error) {
      console.error("Austiblox status error:", error);
  
      return res.status(500).json({
        error: "Failed to fetch Austiblox status",
        status: "[ Status unavailable ]"
      });
    }
  }
  