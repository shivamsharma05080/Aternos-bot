const mineflayer = require("mineflayer");

const BOT_USERNAME = "SoulSMP";
const HOST = "SoulSMP12.aternos.me";
const PORT = 40740;
const VERSION = "1.21.11";

let bot;
let reconnectTimer;
let walkTimer;
let chatTimer;
let messageIndex = 0;

const messages = [
  "Hi Everyone! Welcome to SoulSMP ❤️",
  "Kya haal chaal bhaiyo, kaise ho? 😎",
  "Spicy_Gamerz ko subscribe kr dena ❤️",
  "Join our Discord! 📢"
];

function startBot() {
  console.log("🔌 Connecting to SoulSMP...");

  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_USERNAME,
    version: VERSION,
    auth: "offline"
  });

  bot.once("spawn", () => {
    console.log("✅ SoulBot joined!");

    // Spawn par ek baar
    setTimeout(() => {
      if (bot.entity) bot.chat("/spawn");
    }, 5000);

    startWalking();
    startChat();
  });

  // Death -> auto respawn
  bot.on("death", () => {
    console.log("💀 SoulSMP died. Respawning...");

    setTimeout(() => {
      if (bot && bot.entity) {
        bot.respawn();
      }
    }, 1500);
  });

  // Player chat commands
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;

    if (message === "!rtp") {
      bot.chat("/rtp");
    }

    if (message === "!spawn") {
      bot.chat("/spawn");
    }

    if (message === "!arena") {
      bot.chat("/warp arena");
    }

    if (message === "!shop") {
      bot.chat("/shop");
    }
  });

  bot.on("kicked", reason => {
    console.log("❌ Kicked:", reason);
  });

  bot.on("error", err => {
    console.log("⚠️ Error:", err.message);
  });

  // Only reconnect after an actual disconnect
  bot.on("end", () => {
    stopAll();

    console.log("🔄 Disconnected. Rejoining in 10 seconds...");

    clearTimeout(reconnectTimer);

    reconnectTimer = setTimeout(() => {
      startBot();
    }, 10000);
  });
}

function startWalking() {
  stopWalking();

  const directions = ["forward", "left", "right", "back"];

  walkTimer = setInterval(() => {
    if (!bot || !bot.entity) return;

    directions.forEach(d => bot.setControlState(d, false));

    const direction =
      directions[Math.floor(Math.random() * directions.length)];

    bot.setControlState(direction, true);

    setTimeout(() => {
      if (bot && bot.entity) {
        bot.setControlState(direction, false);
      }
    }, 2000);

  }, 4000);
}

function startChat() {
  stopChat();

  // Every 20 seconds
  chatTimer = setInterval(() => {
    if (!bot || !bot.entity) return;

   
