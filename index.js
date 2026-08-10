const mineflayer = require("mineflayer");

const HOST = "SPICY_ARMY1.aternos.me";
const PORT = 40740;
const VERSION = "1.21.11";
const BOT_USERNAME = "SpicyBot";

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
    console.log("✅ BOT JOINED SPICY ARMY!");

    startMovement();
  });

  function startMovement() {
    const directions = ["forward", "back", "left", "right"];

    setInterval(() => {
      if (!bot || !bot.entity) return;

      const direction =
        directions[Math.floor(Math.random() * directions.length)];

      // Stop previous movement
      for (const d of directions) {
        bot.setControlState(d, false);
      }

      // Walk
      bot.setControlState(direction, true);

      // Sometimes jump
      if (Math.random() < 0.4) {
        bot.setControlState("jump", true);

        setTimeout(() => {
          if (bot && bot.entity) {
            bot.setControlState("jump", false);
          }
        }, 400);
      }

      console.log("🚶 Bot moving:", direction);

      // Change direction after 3 seconds
      setTimeout(() => {
        if (bot && bot.entity) {
          bot.setControlState(direction, false);
        }
      }, 3000);

    }, 3500);
  }

  bot.on("kicked", reason => {
    console.log("❌ Kicked:", reason);
  });

  bot.on("end", () => {
    console.log("🔄 Disconnected! Reconnecting in 10 seconds...");

    clearTimeout(reconnectTimer);

    reconnectTimer = setTimeout(() => {
      startBot();
    }, 10000);
  });

  bot.on("error", err => {
    console.log("⚠️ Error:", err.message);
  });
}

startBot();
