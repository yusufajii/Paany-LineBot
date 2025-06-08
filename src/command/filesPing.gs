function filesPing(replyToken, accessToken, filekeywords, sheetDatabase) {
  var data = sheetDatabase.getDataRange().getValues(); // Ambil semua data di sheet
  var availableFiles = []; // Untuk daftar file jika filekeywords kosong
  var foundFiles = []; // Untuk hasil pencarian

  // Loop melalui semua baris (dimulai dari indeks 1 karena indeks 0 adalah header)
  for (var i = 1; i < data.length; i++) {
    var title = data[i][1]; // Kolom TITLE
    var link = data[i][2]; // Kolom LINK
    var keywords = data[i][3]; // Kolom KEYWORDS

    availableFiles.push(keywords); // Simpan semua keywords

    // Jika filekeywords tidak kosong, cari file yang sesuai
    if (filekeywords && keywords.toLowerCase().includes(filekeywords.toLowerCase())) {
      foundFiles.push(`📌 𝗝𝘂𝗱𝘂𝗹 𝗙𝗶𝗹𝗲: ${title}\n🔗 𝗟𝗶𝗻𝗸: ${link}`);
    }
  }

  var responseMessage = "";

  if (!filekeywords) {
    // Jika filekeywords kosong, tampilkan daftar file yang tersedia
    responseMessage = `📄🔍 𝐒𝐄𝐀𝐑𝐂𝐇 𝐅𝐈𝐋𝐄 𝐏𝐄𝐍𝐓𝐈𝐍𝐆\n================\n` +
        '📌𝘔𝘦𝘯𝘺𝘦𝘥𝘪𝘢𝘬𝘢𝘯 𝘧𝘪𝘭𝘦-𝘧𝘪𝘭𝘦 𝘱𝘦𝘯𝘵𝘪𝘯𝘨 𝘥𝘦𝘯𝘨𝘢𝘯 𝘢𝘬𝘴𝘦𝘴 𝘮𝘶𝘥𝘢𝘩 𝘥𝘢𝘯 𝘤𝘦𝘱𝘢𝘵\n➔"!pany file <judul>"\n\n'+
        `📂 ${availableFiles.length} 𝗝𝘂𝗱𝘂𝗹 𝗙𝗶𝗹𝗲 𝗧𝗲𝗿𝘀𝗲𝗱𝗶𝗮 :\n`;
    responseMessage += availableFiles.map((file, index) => `${file}/`).join("");
    responseMessage += "\n==================";
    responseMessage += `\n🔍Contoh: \n"!pany file tp02soal"`;

  } else if (foundFiles.length > 0) {
    // Jika file ditemukan, tampilkan hasil pencarian
    responseMessage = `✅ 𝐅𝐢𝐥𝐞 𝐃𝐢𝐭𝐞𝐦𝐮𝐤𝐚𝐧 !\n==============\n${foundFiles.join("\n====\n")}\n==============`;
  } else {
    // Jika file tidak ditemukan
    responseMessage = "❌ 𝐅𝐢𝐥𝐞 𝐭𝐢𝐝𝐚𝐤 𝐝𝐢𝐭𝐞𝐦𝐮𝐤𝐚𝐧!";
  }

  // Kirim respon ke LINE
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
