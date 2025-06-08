function broadcastPing(replyToken, accessToken, message) {
  var url = "https://api.line.me/v2/bot/message/broadcast";
  var payload = {
    messages: [{
      "type": "text",
      "text": message
    }]
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + accessToken
    },
    payload: JSON.stringify(payload)
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var result = response.getContentText();
    Logger.log("✅ 𝐁𝐫𝐨𝐚𝐝𝐜𝐚𝐬𝐭 𝐁𝐞𝐫𝐡𝐚𝐬𝐢𝐥: " + result);
    sendReply(replyToken, accessToken, "✅ Pesan broadcast berhasil dikirim.");
  } catch (error) {
    Logger.log("❌ 𝐁𝐫𝐨𝐚𝐝𝐜𝐚𝐬𝐭 𝐆𝐚𝐠𝐚𝐥: " + error.toString());
    sendReply(replyToken, accessToken, "❌ Gagal mengirim broadcast: " + error.toString());
  }
}

function sendReply(replyToken, accessToken, message) {
  var url = "https://api.line.me/v2/bot/message/reply";
  var payload = {
    replyToken: replyToken,
    messages: [{
      "type": "text",
      "text": message
    }]
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + accessToken
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}
