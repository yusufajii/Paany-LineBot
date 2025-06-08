var mainSpreadsheet = SpreadsheetApp.openById("1_3Xm-TA9WuPSWMolN_-D6j3-uGdVZwuXphUEeMZ3bDk")
var control = mainSpreadsheet.getSheetByName("main");
var tugas_active = mainSpreadsheet.getSheetByName("tugas_active");
var ujian_active = mainSpreadsheet.getSheetByName("ujian_active");
var tugas_database = mainSpreadsheet.getSheetByName("tugas_database");
var files_database = mainSpreadsheet.getSheetByName("files_database");
var biodata_database = mainSpreadsheet.getSheetByName("student_database");
var folder_database = mainSpreadsheet.getSheetByName("folder_database");
var commandList = mainSpreadsheet.getSheetByName("command_list");
var instanceList = mainSpreadsheet.getSheetByName("checkup_database");

var accessToken = control.getRange("T18").getValue();
var botname = control.getRange("A1").getValue();
var mainGrupId = control.getRange("M5").getValue();

//==================== CONTROL PANEL =====================
var main_toggle = control.getRange("AO18").getValue();
//========================================================


// Webhook receiver function
function doPost(e) {

  try {
    // Process the webhook event
    var event = processWebhookEvent(e);
    
    // If event is valid, you can now use it flexibly
    if (event) {
      if (main_toggle){
        var commandRange = control.getRange("G5:G18");
        var event_trigger = recognizeCommand(commandRange,botname,event);

        if (event_trigger.status==200){
          // Log to spreadsheet
          var sheet = SpreadsheetApp.openById("1_3Xm-TA9WuPSWMolN_-D6j3-uGdVZwuXphUEeMZ3bDk").getSheetByName("callback_log");;
          sheet.appendRow([
            new Date(),
            event.UserId,
            event.GroupId,
            event.MessageText,
            event.ReplyToken,
            event_trigger.command,
            event_trigger.argument
          ]);

        if (!is_commandActive(event_trigger.command, commandList.getRange("A1:C14"))) {
          var inactiveMsg = `𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐓𝐢𝐝𝐚𝐤 𝐀𝐤𝐭𝐢𝐟! \n\n` +
                            `❌ Command: [${event_trigger.command}] tidak tersedia saat ini.\n` +
                            `Silakan coba lagi nanti atau hubungi 18023047 jika ini adalah kesalahan.`;
          
          failMsg(event.ReplyToken, botname, accessToken, inactiveMsg);
          return;
          }
          
          //Main processing
          switch(event_trigger.command) {
            case commandList.getRange("B2").getValue():
              basicPing(event.ReplyToken, accessToken);
              break;
            case commandList.getRange("B3").getValue():
              commandPing(event.ReplyToken,accessToken,commandList.getRange("A1:C14"));
              break;
            case commandList.getRange("B4").getValue():
              tugasPing(event.ReplyToken, accessToken, tugas_active.getRange("A1:H6"));
              break;
            case commandList.getRange("B5").getValue():
              addtugas(tugas_database, event_trigger.argument, event.ReplyToken, accessToken);
              break;
            case commandList.getRange("B6").getValue():
              filesPing(event.ReplyToken, accessToken, event_trigger.argument, files_database);
              break;
            case commandList.getRange("B7").getValue():
              biodataPing(event.ReplyToken, accessToken, event_trigger.argument, biodata_database);
              break;
            case commandList.getRange("B8").getValue():
              inspectPing(event.ReplyToken, accessToken, event_trigger.argument, folder_database,biodata_database);
              break;
            case commandList.getRange("B9").getValue():
              broadcastPing(event.ReplyToken, accessToken, event_trigger.argument);
              break;
            case commandList.getRange("B10").getValue():
              pcPing(event.ReplyToken, accessToken, biodata_database.getRange("A1:M59"), event_trigger.argument);
              break;
            case commandList.getRange("B11").getValue():
              epfessPing(event.ReplyToken, accessToken, mainGrupId, event_trigger.argument);
              break;
            case commandList.getRange("B12").getValue():
              ujianPing(event.ReplyToken, accessToken, ujian_active.getRange("A1:H6"));
              break;
            case  commandList.getRange("B13").getValue():
              checkupPing(event.ReplyToken, accessToken, event_trigger.argument, instanceList, biodata_database);
              break
          }
        }
        if(event_trigger.status==400){
          var errMsg = 'Invalid Command <'+event_trigger.command+'> : Unregistered key or argument.\n'
          failMsg(event.ReplyToken,botname,accessToken,errMsg);
        }
      }
      else{
        var offMsg = ` ${botname} saat ini sedang Maintenance.\n\n` +
                      "🚨 Silakan laporkan kendala ke: 18023047.\n" +
                      "🙏 Mohon maaf atas ketidaknyamanannya.";
        failMsg(event.ReplyToken, botname, accessToken, offMsg);
        return
      }
    }

    return ContentService.createTextOutput("OK");
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString());
  }

}
