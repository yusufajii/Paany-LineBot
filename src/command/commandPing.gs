function commandPing(replyToken, accessToken, sheetCommand) {
  var data = sheetCommand.getValues(); // Ambil semua data
  var commandList = [];

  for (var i = 1; i < data.length; i++) {
    var deskripsi = data[i][0]; // Kolom Deskripsi
    var prompt = data[i][1]; // Kolom PROMP
    var enable = data[i][2]; // Kolom ENABLE

    if (enable.toString().toLowerCase() === "true" && prompt) {
      commandList.push(`🟢 ${prompt}`);
    }
    else if (enable.toString().toLowerCase() === "false" && prompt){
      commandList.push(`🔴 ${prompt}`);
    }
  }

  var responseMessage = commandList.length > 0
    ? `📜 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐢𝐬𝐭\n================\n${commandList.join("\n")}\n================\nGunakan perintah dengan format: \n🔍 "!pany [command]"`
    : "❌ Tidak ada command yang tersedia.";

  sendReply(replyToken, accessToken, responseMessage);
}

// Fungsi untuk mengirim pesan ke pengguna via LINE
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
