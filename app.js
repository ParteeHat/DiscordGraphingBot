const puppeteer = require("puppeteer");
const Discord = require("discord.js");
const { Client, Intents, MessageAttachment } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const { token, prefix } = require("./config.json");
const file = new MessageAttachment("./graphImage.png");
// Default Desmos values
var minXDefault = "-10";
var maxXDefault = "10";
var minYDefault = "-11.542";
var maxYDefault = "11.542";
var polarDefault = "false";
var radiansDefault = "false";
var sidePanelDefault = "true";
var waitDefault = "1000";
// Embed that lists commands
const commandEmbed = {
  color: "#22874b",
  title: "Commands",
  fields: [
    {
      name: prefix + " commands",
      value: "List commands",
      inline: true,
    },
    {
      name: prefix + " settings",
      value: "List graphing settings",
      inline: true,
    },
    {
      name: prefix + " {function} {function 2}",
      value: "Graphs inserted function (second function is optional)",
      inline: true,
    },
  ],
  footer: {
    text: "Made by ee#7151",
  },
};
// Embed that lists settings
const settingsEmbed = {
  color: "#22874b",
  title: "Settings",
  description: "(Replace {} with value)",
  fields: [
    {
      name: prefix + " zoom {minX} {maxX} {minY} {maxY}",
      value:
        "Scales the graph according to given coordinates (Default: zoom -10 10 -11.542 11.542)",
      inline: true,
    },
    {
      name: prefix + " polar {true/false}",
      value:
        "Changes graph type to a polar grid if true or a cartesian grid if false (Default: polar false)",
      inline: true,
    },
    {
      name: prefix + " radians {true/false}",
      value:
        "Shows units in radians if true or in degrees if false if the polar grid is enabled (Default: radians false)",
      inline: true,
    },
    {
      name: prefix + " panel {true/false}",
      value: "Shows side panel with equation(s) if true (Default: panel true)",
      inline: true,
    },
    {
      name: prefix + " wait {milliseconds}",
      value:
        "[DEBUG] Changes the time in milliseconds before the screenshot is taken (Default: wait 1000)",
      inline: false,
    },
  ],
};

// Scraper
async function desmos(url, equation1, equation2) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  // Opens settings
  var settingsPath = await page.waitForXPath(
    "/html/body/div[2]/div[2]/div/div/div/div[4]/div[1]/div/div[1]/div[1]/div/i"
  );
  await settingsPath.click();
  // Selects and types in the minimum X value
  var minXPath = await page.waitForXPath(
    "/html/body/div[2]/div[2]/div/div/div/div[4]/div[1]/div/div[1]/div[2]/div/div[3]/div[2]/div[1]/div[2]/span/span[2]"
  );
  await minXPath.click();
  await page.keyboard.down("Control");
  await page.keyboard.press("A");
  await page.keyboard.up("Control");
  await page.keyboard.type(minXDefault);
  // Selects and types in the maximum X value
  await page.keyboard.press("Tab");
  await page.keyboard.type(maxXDefault);
  // Selects and types in the minimum Y value
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.type(minYDefault);
  // Selects and types in the maximum Y value
  await page.keyboard.press("Tab");
  await page.keyboard.type(maxYDefault);
  // Toggles polar grid mode if true
  if (polarDefault == "true") {
    var polarPath = await page.waitForXPath(
      "/html/body/div[2]/div[2]/div/div/div/div[4]/div[1]/div/div[1]/div[2]/div/div[2]/div[1]/div[2]/div[2]"
    );
    await polarPath.click();
  } else if (polarDefault == "false") {
    var cartesianPath = await page.waitForXPath(
      "/html/body/div[2]/div[2]/div/div/div/div[4]/div[1]/div/div[1]/div[2]/div/div[2]/div[1]/div[2]/div[1]"
    );
    await cartesianPath.click();
  }
  // Toggles on the radian measurement if true
  if (radiansDefault == "true") {
    var radiansPath = await page.waitForXPath(
      "/html/body/div[2]/div[2]/div/div/div/div[4]/div[1]/div/div[1]/div[2]/div/div[4]/div[1]"
    );
    await radiansPath.click();
  } else if (radiansDefault == "false") {
    var degreesPath = await page.waitForXPath(
      "/html/body/div[2]/div[2]/div/div/div/div[4]/div[1]/div/div[1]/div[2]/div/div[4]/div[2]"
    );
    await degreesPath.click();
  }
  // Types in equation
  var input1Path = await page.waitForXPath(
    "/html/body/div[2]/div[2]/div/div/div/div[1]/div/div[2]/div[4]/div/span/div/div[1]/div[1]/div[1]/div[2]/div/span[2]"
  );
  await input1Path.click();
  await input1Path.type(equation1);
  // Checks if there is a second equation and types it in if it exists
  if (equation2 != "") {
    var input2Path = await page.waitForXPath(
      "/html/body/div[2]/div[2]/div/div/div/div[1]/div/div[2]/div[4]/div/div[1]/div"
    );
    await input2Path.click();
    input2Path = await page.waitForXPath(
      "/html/body/div[2]/div[2]/div/div/div/div[1]/div/div[2]/div[4]/div/span/div[2]/div[1]/div[1]/div[1]/div[2]/div/span[2]"
    );
    await input2Path.type(equation2);
  }
  // Toggles on the side panel if true
  if (sidePanelDefault == "false") {
    var sidePanelPath = await page.waitForXPath(
      "/html/body/div[2]/div[2]/div/div/div/div[1]/div/div[2]/div[1]/div[3]/div[3]/span"
    );
    await sidePanelPath.click();
  }
  // Gives the webpage time to load the function
  await page.waitForTimeout(Number(waitDefault));
  // Takes the screenshot of the area
  await page.screenshot({
    path: "./graphImage.png",
    clip: { x: 0, y: 46, width: 800, height: 554 },
  });
  await page.close();
  await browser.close();
}

client.once("ready", () => {
  console.log("Running...");
});
// Executes when any message is inputted
client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return; // Check if the message has the prefix
  const args = message.content.slice(prefix.length).trim().split(" "); // Splits up the arguments into the args array
  const command = args.shift().toLowerCase(); // Takes the first value after the prefix and places it into the command variable

  if (
    command === "help" ||
    command === "" ||
    command === "command" ||
    command === "commands" ||
    command === "about"
  ) {
    // Lists commands if help/commands/command/''  is used
    message.channel.send({ embeds: [commandEmbed] }).catch(console.error);
  } else if (command === "settings" || command === "setting") {
    // Lists settings if setting/setting is used
    message.channel.send({ embeds: [settingsEmbed] }).catch(console.error);
  } else if (command === "zoom") {
    // Edits zoom values
    minXDefault = args[0];
    maxXDefault = args[1];
    minYDefault = args[2];
    maxYDefault = args[3];
    message.channel.send("Done :thumbsup:");
  } else if (command === "polar") {
    // Toggles the polar graph
    polarDefault = args[0];
    message.channel.send("Done :thumbsup:");
  } else if (command === "radians" || command === "radian") {
    // Toggles radians
    radiansDefault = args[0];
    message.channel.send("Done :thumbsup:");
  } else if (command === "panel") {
    // Toggles the panel
    sidePanelDefault = args[0];
    message.channel.send("Done :thumbsup:");
  } else if (command === "wait") {
    // Changes time
    waitDefault = args[0];
    message.channel.send("Done :thumbsup:");
  } else {
    // If an equation is inputted
    var command2 = args[0];
    if (command2 == undefined) {
      command2 = "";
    }
    if (command2 == "") {
      var footer = command;
    } else {
      var footer = command + " & " + command2;
    }
    desmos("https://www.desmos.com/calculator", command, command2)
      .then((res) => {
        var calcEmbed = {
          // Embed screenshot with the inputted equation(s) as the footer
          color: "#22874b",
          image: {
            url: "attachment://graphImage.png",
          },
          footer: {
            text: footer,
          },
        };
        message.channel
          .send({ embeds: [calcEmbed], files: [file] })
          .catch(console.error);
      })
      .catch((err) => console.log(err));
  }
});

client.login(token);
