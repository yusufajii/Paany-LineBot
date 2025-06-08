function ujianPing(replyToken, token, rangeSpreadsheet) {
  var url = "https://api.line.me/v2/bot/message/reply";

  // Ambil semua data dari spreadsheet dalam bentuk array 2D
  var data = rangeSpreadsheet.getValues();
  
  // Array untuk menampung daftar ujian yang valid
  var ujianList = [];

  // Pastikan ada ujian yang tersedia (lebih dari hanya header)
  if (data.length > 1) {
    // Loop setiap ujian, mulai dari baris ke-2 (indeks 1) untuk menghindari header
    data.slice(1).forEach((row, index) => {
      var matkul = row[1] ? row[1].trim() : "";  // Mata kuliah
      var judul = row[2] ? row[2].trim() : "";  // Judul ujian
      var jadwal = row[3] ? row[3].toString().trim() : "-";  // Countdown hari
      var cd = row[7] ? row[7].toString().trim() : "-";  // Countdown hari
      var link = row[5] ? row[5].trim() : " - "; // Jika tidak ada link, tampilkan pesan default
      var link_2 = row[6] ? row[6].trim() : " - ";  // Judul ujian
      // Pastikan ujian memiliki informasi yang cukup untuk ditampilkan
      if (matkul && judul) {
        var nomor = (ujianList.length + 1) + "️⃣"; // Nomor berdasarkan jumlah ujian yang valid
        ujianList.push(`${nomor} ${matkul}\n📋 ${judul}\n📌 ${jadwal}\n⏳ ${cd} hari lagi\n📔 ${link}\n📚 ${link_2}`);
      }
    });
  }

  // Format pesan akhir
  var pesan;
  if (ujianList.length > 0) {
    pesan = `📌 𝐔𝐉𝐈𝐀𝐍 𝐌𝐄𝐍𝐃𝐀𝐓𝐀𝐍𝐆!\n================\n\n${ujianList.join("\n\n")}\n\n================\n✅ Jangan lupa belajar dan berdoa!\n📩 Ada kesalahan data? PC divisi akademik. 🚀`;
  } else {
    pesan = `📌 𝐔𝐉𝐈𝐀𝐍 𝐌𝐄𝐍𝐃𝐀𝐓𝐀𝐍𝐆!\n================\n\nSaat ini tidak ada ujian mendatang.\n\n================\n✅ Nikmati harimu! 📚🚀`;
  }

  var payload = {
    replyToken: replyToken,
    messages: [{
      "type": "text",
      "text": pesan
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
