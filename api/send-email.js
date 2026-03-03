export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }
  const { to, giverName, receiverName, groupName, budget, eventDate, eventPlace, message } = req.body;
  if (!to || !giverName || !receiverName) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  let html = '<div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;padding:20px;">';
  html += '<h2>Hola ' + giverName + '!</h2>';
  html += '<p style="font-size:1.1em;">Tu amigo invisible es:</p>';
  html += '<p style="font-size:1.5em;font-weight:bold;color:#d4a843;">' + receiverName + '</p>';
  if (groupName) html += '<p><strong>Sorteo:</strong> ' + groupName + '</p>';
  if (budget) html += '<p><strong>Presupuesto:</strong> ' + budget + '</p>';
  if (eventDate) html += '<p><strong>Fecha:</strong> ' + eventDate + '</p>';
  if (eventPlace) html += '<p><strong>Lugar:</strong> ' + eventPlace + '</p>';
  if (message) html += '<hr style="border:1px dashed #ddd;margin:20px 0;"><p>' + message + '</p>';
  html += '<p style="margin-top:30px;color:#aaa;font-size:0.8em;">Enviado con Amigo Invisible App</p></div>';
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Amigo Invisible <onboarding@resend.dev>",
        to: [to],
        subject: groupName ? "Tu amigo invisible - " + groupName : "Tu amigo invisible",
        html: html,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || "Resend error" });
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
