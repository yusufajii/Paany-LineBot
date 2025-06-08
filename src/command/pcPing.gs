function pcPing(replyToken, accessToken, std_database, input,) {
  var data = std_database.getValues(); // Ambil seluruh data dari database
  var headers = data[0]; // Header kolom
  var userIDIndex = headers.indexOf("UserID");
  var nim1Index = headers.indexOf("NIM1");
  var namaPanggilanIndex = headers.indexOf("Nama Panggilan");

  if (userIDIndex === -1 || nim1Index === -1 || namaPanggilanIndex === -1) {
    sendReply(replyToken, accessToken, "❌ Kesalahan sistem: Kolom tidak ditemukan di database.");
    return;
  }

  // Pisahkan input hanya pada tanda "-" pertama
  var firstDashIndex = input.indexOf("-");
  if (firstDashIndex === -1) {
    sendReply(replyToken, accessToken, "❌ 𝐅𝐨𝐫𝐦𝐚𝐭 𝐬𝐚𝐥𝐚𝐡.\n\nGunakan: \n!pany pc NIM-Pesan\n!pany pc nama-Pesan");
    return;
  }

  var target = input.substring(0, firstDashIndex).trim(); // Ambil bagian sebelum "-"
  var message = input.substring(firstDashIndex + 1).trim(); // Ambil bagian setelah "-"

  var userId = null;

  // Loop untuk mencari berdasarkan NIM1 atau Nama Panggilan
  for (var i = 1; i < data.length; i++) {
    if (data[i][nim1Index] == target || data[i][namaPanggilanIndex].toLowerCase() == target.toLowerCase()) {
      userId = data[i][userIDIndex];
      break;
    }
  }

  if (!userId) {
    sendReply(replyToken, accessToken, "❌ 𝐏𝐞𝐧𝐠𝐠𝐮𝐧𝐚 𝐝𝐞𝐧𝐠𝐚𝐧 𝐍𝐈𝐌/𝐍𝐚𝐦𝐚 " + target + " 𝐭𝐢𝐝𝐚𝐤 𝐝𝐢𝐭𝐞𝐦𝐮𝐤𝐚𝐧.");
    return;
  }

  var url = "https://api.line.me/v2/bot/message/push";
  var payload = {
    to: userId,
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
    sendReply(replyToken, accessToken, "✅ 𝐏𝐞𝐬𝐚𝐧 𝐛𝐞𝐫𝐡𝐚𝐬𝐢𝐥 𝐝𝐢𝐤𝐢𝐫𝐢𝐦 𝐤𝐞 : " + target);
  } catch (error) {
    sendReply(replyToken, accessToken, "❌ 𝐆𝐚𝐠𝐚𝐥 𝐦𝐞𝐧𝐠𝐢𝐫𝐢𝐦 𝐩𝐞𝐬𝐚𝐧: \n" + error.toString());
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
