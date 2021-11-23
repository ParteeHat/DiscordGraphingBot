# DiscordGraphingBot
Discord bot built with puppeteer and discord.js capable of graphing equations. The bot connects to the online graphing calculator, Desmos, and feeds it commands and or

# Setup
1. Install node.js
2. Open the config.json file and insert your discord bot's token. Optionally, you can change the prefix used to call the bot (By default, it's "!D")
3. Run ```npm install``` in the installed folder's console
4. To start up the bot, run the "run.bat" file or execute ```node app.js``` in the same console
5. Invite the bot to your server using the link "https://discord.com/api/oauth2/authorize?client_id=INSERT_YOUR_CLIENT_ID_HERE&permissions=0&scope=bot%20applications.commands" and replacing the "INSERT_YOUR_CLIENT_ID_HERE" with your bot's client id
6. Type ```!D commands``` into Discord to  list the available commands

# Dependancies
- discord.js v13.3.1,
- puppeteer v11.0.0
