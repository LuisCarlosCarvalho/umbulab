export async function sendZApiMessage(phone: string, message: string) {
  const instanceId = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;

  if (!instanceId || !token) {
    console.warn('Z-API credentials missing. Cannot send WhatsApp message:', message);
    return false;
  }

  // Remove any non-numeric characters from the phone number
  const cleanPhone = phone.replace(/\D/g, '');

  try {
    const response = await fetch(`https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: cleanPhone,
        message: message
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Z-API error:', errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Z-API exception:', error);
    return false;
  }
}
