function biodataPing(replyToken, accessToken, inputArgumen, sheetDatabase) {
  var data = sheetDatabase.getDataRange().getValues(); // Ambil semua data di sheet
  var nameList = [];
  var foundData = null;

  // Loop untuk mencari data atau menyimpan daftar nama panggilan
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var biodata = {
      namaPanggilan: row[1],
      namaLengkap: row[2],
      nim1: row[3],
      nim2: row[4],
      kelompok: row[5],
      noHP: row[6],
      noDarurat1: row[7],
      noDarurat2: row[8],
      alamat: row[9],
      riwayatPenyakit: row[10],
      foto: row[11]
    };

    // Simpan daftar nama panggilan jika argumen kosong
    if (!inputArgumen) {
      nameList.push(biodata.namaPanggilan);
    }

    // Cek apakah inputArgumen cocok dengan Nama Panggilan atau NIM2
    if (inputArgumen && (biodata.namaPanggilan.toLowerCase() === inputArgumen.toLowerCase() || biodata.nim2 === inputArgumen)) {
      foundData = biodata;
      break;
    }
  }

  var responseMessage;

  if (!inputArgumen) {
    // Jika argumen kosong, tampilkan daftar nama panggilan
    responseMessage = nameList.length > 0
      ? `🪪🔍 𝐁𝐈𝐎𝐃𝐀𝐓𝐀 𝐒𝐄𝐀𝐑𝐂𝐇 𝐏𝐀𝐍𝐓𝐄𝐊\n================\n` +
        `📌𝘔𝘦𝘯𝘺𝘦𝘥𝘪𝘢𝘬𝘢𝘯 𝘥𝘢𝘵𝘢 𝘪𝘯𝘥𝘪𝘷𝘪𝘥𝘶 𝘮𝘢𝘴𝘢 𝘗𝘈𝘕𝘛𝘌𝘒 𝘶𝘯𝘵𝘶𝘬 𝘬𝘦𝘱𝘦𝘳𝘭𝘶𝘢𝘯 𝘥𝘢𝘳𝘶𝘳𝘢𝘵\n` +
        `➔"!pany biodata <nama>"\n➔"!pany inspect <3dgtNIM>"\n\n` +
        '🗃 𝗡𝗮𝗺𝗮 𝗧𝗲𝗿𝘀𝗲𝗱𝗶𝗮 :\n'+
        nameList.map((name, index) => `${name.toLowerCase()}/`).join("") +
        `\n================\nContoh: \n🔍"!pany biodata rifkun"\n🔍"!pany biodata 025"`
      : "❌ Tidak ada data biodata yang tersedia.";
  } else if (foundData) {
    // Format hasil jika data ditemukan
    responseMessage = `✅ 𝐃𝐚𝐭𝐚 𝐃𝐢𝐭𝐞𝐦𝐮𝐤𝐚𝐧 !\n================\n
👤 𝗡𝗮𝗺𝗮: ${foundData.namaLengkap}
🎓 𝗡𝗜𝗠: ${foundData.nim1}
👥 𝗞𝗲𝗹𝗼𝗺𝗽𝗼𝗸: ${foundData.kelompok}
📱 𝗡𝗼 𝗛𝗣: ${foundData.noHP}
📞 𝗗𝗮𝗿𝘂𝗿𝗮𝘁 𝟭: ${foundData.noDarurat1}
📞 𝗗𝗮𝗿𝘂𝗿𝗮𝘁 𝟮: ${foundData.noDarurat2}
🏠 𝗔𝗹𝗮𝗺𝗮𝘁: ${foundData.alamat}
⚕️ 𝗥𝗶𝘄𝗮𝘆𝗮𝘁 𝗣𝗲𝗻𝘆𝗮𝗸𝗶𝘁: ${foundData.riwayatPenyakit}
🖼 𝗙𝗼𝘁𝗼: ${foundData.foto}\n================`;
  } else {
    responseMessage = "❌ 𝐃𝐚𝐭𝐚 𝐭𝐢𝐝𝐚𝐤 𝐝𝐢𝐭𝐞𝐦𝐮𝐤𝐚𝐧!\nCommand : !pany biodata";
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
