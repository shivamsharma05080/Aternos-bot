const mineflayer = require("mineflayer");

const HOST = "SPICY_ARMY1.aternos.me";
const PORT = 40740;
const VERSION = "1.21.11";
const BOT_USERNAME = "SpicyBot";

let bot;

function startBot() {
  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_USERNAME,
    version: VERSION,
    auth: "offline"
  });

  bot.once("spawn", () => {
    console.log("✅ Bot joined SPICY ARMY!");

    // Random walking
    setInterval(() => {
      if (!bot.entity) return;

      const directions = ["forward", "back", "left", "right"];
      const dir = directions[Math.floor(Math.random() * directions.length)];

      bot.setControlState(dir, true);

      setTimeout(() => {
        bot.setControlState(dir, false);
      }, 1500);
    }, 5000);
  });

  // Auto pickup nearby dropped items
  bot.on("physicTick", () => {
    if (!bot.entity) return;

    const items = Object.values(bot.entities).filter(
      e => e.type === "object" && e.objectType === "Item"
    );

    for (const item of items) {
      if (bot.entity.position.distanceTo(item.position) < 3) {
        bot.lookAt(item.position, true).catch(() => {});
      }
    }
  });

  bot.on("death", () => {
    console.log("💀 Bot died — waiting for respawn...");
  });

  bot.on("kicked", reason => {
    console.log("❌ Kicked:", reason);
  });

  bot.on("end", () => {
    console.log("🔄 Disconnected — reconnecting in 10 seconds...");
    setTimeout(startBot, 10000);
  });

  bot.on("error", err => {
    console.log("⚠️ Error:", err.message);
  });
}

startBot();
