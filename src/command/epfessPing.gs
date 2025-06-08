function epfessPing(replyToken, accessToken, mainGroupId, message) {
  var url = "https://api.line.me/v2/bot/message/push";
  var payload = {
    to: mainGroupId, // ID grup utama
    messages: [{
      "type": "text",
      "text": "📢 𝐏𝐞𝐬𝐚𝐧 𝐀𝐧𝐨𝐧𝐢𝐦\n\n" + message
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
    sendReply(replyToken, accessToken, "✅ 𝐏𝐞𝐬𝐚𝐧 𝐚𝐧𝐨𝐧𝐢𝐦 𝐛𝐞𝐫𝐡𝐚𝐬𝐢𝐥 𝐝𝐢𝐤𝐢𝐫𝐢𝐦 𝐤𝐞 𝐠𝐫𝐮𝐩.");

  } catch (error) {
    sendReply(replyToken, accessToken, "❌ 𝐆𝐚𝐠𝐚𝐥 𝐦𝐞𝐧𝐠𝐢𝐫𝐢𝐦 𝐩𝐞𝐬𝐚𝐧 𝐚𝐧𝐨𝐧𝐢𝐦: " + error.toString());
  }
}

// Fungsi untuk mengirim pesan balasan ke pemanggil perintah
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
