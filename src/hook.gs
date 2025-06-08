function processWebhookEvent(e) {
  try {
    // Parse raw payload
    var rawPayload = e && e.postData ? e.postData.contents : null;
    if (!rawPayload) return null;
    
    var jsonData = JSON.parse(rawPayload);
    
    // Check if events exist
    if (!jsonData.events || jsonData.events.length === 0) return null;
    
    // Take first event (you can modify to handle multiple events)
    var event = jsonData.events[0];
    
    // Construct standardized event object
    return {
      // Source Information
      "UserId": event.source?.userId || null,
      "GroupId": event.source?.groupId || null,
      "SourceType": event.source?.type || null,
      
      // Message Information
      "MessageType": event.message?.type || null,
      "MessageText": event.message?.text || null,
      "MessageId": event.message?.id || null,
      
      // Event Metadata
      "EventType": event.type || null,
      "ReplyToken": event.replyToken || null,  // Specifically added as "ReplyToken"
      "Timestamp": event.timestamp ? new Date(event.timestamp) : null,
      "WebhookEventId": event.webhookEventId || null,
      "Mode": event.mode || null,
      
      // Raw payload for reference
      "_rawPayload": rawPayload
    };
  } catch (error) {
    // Log error or handle parsing failure
    console.error("Event parsing error: " + error);
    return null;
  }
}
