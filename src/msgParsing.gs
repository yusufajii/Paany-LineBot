function recognizeCommand(commandRange, botName, event) {
  // Ensure we have a message to check
  if (!event || !event.MessageText) return null;
  
  // Normalize message text (lowercase, trim)
  var messageText = event.MessageText.trim();
  
  // Normalize bot name (lowercase, trim)
  var normalizedBotName = botName.toLowerCase().trim();
  
  // Create bot command patterns
  var directMention = `@${normalizedBotName}`;
  var exclamationCommand = `!${normalizedBotName}`;
  
  // Check if message starts with bot mention or exclamation command
  var isBotAddressed = messageText.startsWith(directMention + " ") || 
                       messageText.startsWith(exclamationCommand + " ");
  
  // If not addressed to bot, return null
  if (!isBotAddressed) return {status : 0};
  
  // Remove bot name from message
  var commandPart = messageText.replace(directMention, '').replace(exclamationCommand, '').trim();
  
  // Get the commands
  var commands = commandRange.getValues().flat().filter(cmd => cmd.toString().trim() !== '');
  
  // Check for command match
  for (var i = 0; i < commands.length; i++) {
    var command = commands[i].toString().toLowerCase().trim();
    
    // Check if command matches at the start of the message
    if (commandPart.startsWith(command + " ") || commandPart === command) {
      // Extract arguments
      var argument = commandPart.startsWith(command + " ") 
        ? commandPart.replace(command, '').trim() 
        : '';
      
      return {
        status : 200,
        command: command,
        argument: argument,
        fullText: event.MessageText
      };
    }
  }
  
  // No matching command found
  return {status : 400, command: commandPart};
}
