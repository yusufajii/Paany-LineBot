function failMsg(replyToken, botname ,token, errorDetail) {
  var url = "https://api.line.me/v2/bot/message/reply";
  var payload = {
    replyToken: replyToken,
    messages: [{
  "type": "text",
  "text": '🔴 𝗘𝗥𝗥𝗢𝗥 𝟰𝟬𝟬!\n\n⚠️'+errorDetail
}]
  };
  
  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + token
    },
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, options);
}
