function inspectPing(replyToken, accessToken, inputPrompt, sheetFolder, sheetBiodata) {
  var folderData = sheetFolder.getDataRange().getValues();
  var biodataData = sheetBiodata.getDataRange().getValues();
  
  var splitInput = inputPrompt.split("-");
  var inputKeyfolder = splitInput[0];
  var inputKelompok = splitInput.length > 1 ? splitInput[1] : null;

  var keyfolderList = [];
  var foundFolder = null;

  for (var i = 1; i < folderData.length; i++) {
    var row = folderData[i];
    var folderInfo = {
      namaFolder: row[0],
      keyfolder: row[1],
      folderID: row[2]
    };

    if (!inputKeyfolder) {
      keyfolderList.push(folderInfo.keyfolder);
    }

    if (inputKeyfolder && folderInfo.keyfolder.toLowerCase() === inputKeyfolder.toLowerCase()) {
      foundFolder = folderInfo;
      break;
    }
  }

  if (!inputKeyfolder) {
    var responseMessage = keyfolderList.length > 0
      ? `📂🔍 𝐆𝐃𝐑𝐈𝐕𝐄 𝐈𝐍𝐒𝐏𝐄𝐂𝐓𝐈𝐎𝐍\n================\n` +
        '📌𝘔𝘦𝘭𝘢𝘬𝘬𝘶𝘬𝘢𝘬𝘢𝘯 𝘱𝘦𝘯𝘨𝘦𝘤𝘦𝘬𝘢𝘯 𝘰𝘵𝘰𝘮𝘢𝘵𝘪𝘴 𝘱𝘢𝘥𝘢 𝘨𝘰𝘰𝘨𝘭𝘦 𝘥𝘳𝘪𝘷𝘦 𝘵𝘦𝘳𝘬𝘢𝘪𝘵 𝘱𝘦𝘯𝘨𝘶𝘮𝘱𝘶𝘭𝘢𝘯 𝘵𝘶𝘨𝘢𝘴 𝘥𝘢𝘯 𝘊𝘩𝘦𝘤𝘬𝘜𝘱 𝘱𝘦𝘳 𝘒𝘦𝘭𝘰𝘮𝘱𝘬\n➔"!pany inspect <drive>"\n➔"!pany inspect <drive-kel>"\n\n'+
        '🗃𝗗𝗿𝗶𝘃𝗲 𝗧𝗲𝗿𝘀𝗲𝗱𝗶𝗮 :\n'+
        keyfolderList.map((key, index) => `${key}/`).join("") +
        `\n================\n🔍Contoh: \n"!pany inspect tp02"\n"!pany inspect tp02-12"`
      : "❌ Tidak ada folder yang tersedia.";
      
    sendReply(replyToken, accessToken, responseMessage);
    return;
  }

  if (!foundFolder) {
    sendReply(replyToken, accessToken, `❌ Folder tidak ditemukan.\n🔍Command: "!pany inspect`);
    return;
  }

  var folder = DriveApp.getFolderById(foundFolder.folderID);
  var files = folder.getFiles();
  var submittedNIMs = {};

  var validNIMs = {};
  var totalMahasiswa = 0;
  var kelompokMahasiswa = {};
  var belumMengumpulkan = [];

  for (var j = 1; j < biodataData.length; j++) {
    var row = biodataData[j];
    var nim1 = row[3]; // Kolom NIM1
    var kelompok = row[5]; // Kolom Kelompok
    var nama = row[1]; // Nama Panggilan

    validNIMs[nim1] = { nama, kelompok };

    if (!kelompokMahasiswa[kelompok]) {
      kelompokMahasiswa[kelompok] = [];
    }
    kelompokMahasiswa[kelompok].push({ nim1, nama });

    totalMahasiswa++;
  }

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();

    // Cari pola NIM1 dalam nama file
    var match = fileName.match(/(18023\d{3})/);
    if (match) {
      var nim1 = match[1];

      // Hanya tambahkan jika NIM1 valid dalam database
      if (validNIMs[nim1]) {
        submittedNIMs[nim1] = true;
      }
    }
  }

  // Cek mahasiswa yang belum mengumpulkan
  for (var nim in validNIMs) {
    if (!submittedNIMs[nim]) {
      belumMengumpulkan.push(nim);
    }
  }

  var responseMessage = ` 𝐅𝐨𝐥𝐝𝐞𝐫 𝐈𝐧𝐬𝐩𝐞𝐜𝐭𝐢𝐨𝐧 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞𝐝! \n================\n` +
    `📂 𝐅𝐨𝐥𝐝𝐞𝐫: ${foundFolder.namaFolder}\n` +
    `📑 𝗙𝗶𝗹𝗲 𝗧𝗲𝗿𝗸𝘂𝗺𝗽𝘂𝗹: ${Object.keys(submittedNIMs).length}\n` +
    `🔗 𝐋𝐢𝐧𝐤 : https://drive.google.com/drive/folders/${foundFolder.folderID}\n================\n` +
    `🎓 𝗧𝗲𝗿𝗸𝘂𝗺𝗽𝘂𝗹: ${Object.keys(submittedNIMs).length}/${totalMahasiswa} Mahasiswa\n`;

  if (inputKelompok) {
    var kelompokFiltered = kelompokMahasiswa[inputKelompok] || [];
    var kelompokSubmitted = kelompokFiltered.filter(m => submittedNIMs[m.nim1]);

    responseMessage += `📝 𝗞𝗲𝗹𝗼𝗺𝗽𝗼𝗸 ${inputKelompok}: ${kelompokSubmitted.length}/${kelompokFiltered.length} Mahasiswa\n` +
      kelompokFiltered.map(m => `👤 ${m.nama}: ${submittedNIMs[m.nim1] ? "✅" : "❌"}`).join("\n") + "\n================";
  } else {
    responseMessage += `🚨 𝗠𝗮𝗵𝗮𝘀𝗶𝘀𝘄𝗮 𝗯𝗲𝗹𝘂𝗺 𝗺𝗲𝗻𝗴𝘂𝗺𝗽𝘂𝗹𝗸𝗮𝗻: ${belumMengumpulkan.join(", ")}\n================`;
  }

  sendReply(replyToken, accessToken, responseMessage);
}
