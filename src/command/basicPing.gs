function basicPing(replyToken, token) {
  var url = "https://api.line.me/v2/bot/message/reply";
  var payload = {
    replyToken: replyToken,
    messages: [{
  "type": "text",
  "text": "𝑷𝑨𝑵𝑫𝑨𝑨𝑺 𝑰𝒏𝒕𝒓𝒐𝒅𝒖𝒄𝒕𝒊𝒐𝒏 🐼✨\n\nPANDAAS, atau Pantek Digital Academic Assistant and Support, Bisa dipanggil 𝑷𝒂𝒂𝒏𝒚 🤖🎓, adalah bot Line yang menyediakan layanan otomasi akademik untuk Pantek 📚⚡. Dikembangkan oleh tim kusus Pantek, Paany hadir untuk membantu Pantek mendapatkan informasi aktivitas akademik dengan lebih mudah dan cepat📅✅ 🚀🎯.\n\nProject Director : 18023047\nCaption by : GPT 4.0"
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
