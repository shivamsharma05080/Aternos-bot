const mineflayer = require("mineflayer");

const HOST = "SPICY_ARMY1.aternos.me";
const PORT = 40740;
const VERSION = "1.21.11";
const BOT_USERNAME = "SoulSMP";

let bot;
let reconnectTimer;

function startBot() {
  console.log("🔌 Connecting...");

  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_USERNAME,
    version: VERSION,
    auth: "offline"
  });

  bot.once("spawn", () => {
    console.log("✅ SpicyBot joined!");

    // Normal slow walking
    movementLoop();
  });

  async function movementLoop() {
    while (bot && bot.entity) {
      const directions = ["forward", "left", "right", "back"];
      const direction =
        directions[Math.floor(Math.random() * directions.length)];

      bot.setControlState(direction, true);

      // Walk for 2–4 seconds
      await sleep(2000 + Math.random() * 2000);

      bot.setControlState(direction, false);

      // Occasionally jump normally
      if (Math.random() < 0.2) {
        bot.setControlState("jump", true);
        await sleep(300);
        bot.setControlState("jump", false);
      }

      // Small pause
      await sleep(1000);
    }
  }

  bot.on("kicked", reason => {
    console.log("❌ Kicked:", reason);
  });

  bot.on("end", () => {
    console.log("🔄 Disconnected — reconnecting in 30 seconds...");

    clearTimeout(reconnectTimer);

    reconnectTimer = setTimeout(() => {
      startBot();
    }, 30000);
  });

  bot.on("error", err => {
    console.log("⚠️ Error:", err.message);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

startBot();
