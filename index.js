const mineflayer = require("mineflayer")
const fs = require('fs');
const config = require("./config.json");

const bot = mineflayer.createBot({
    host: config.host,
    username: config.username,
    version: config.version,
    hideErrors: true
})

bot.on('kicked', console.log)
bot.on('error', console.log)

bot.on("message", (message) => {
    console.log(message.toAnsi());
});

bot.on("messagestr", (message) => {
    if (message.includes("Are you using a premium account?")) {
        bot.chat("/cracked")
    } else if (message.includes("/login <password>")) {
        bot.chat(`/login ${config["auth_password"]}`);
    } else {
        if (message.includes("register")) {
            bot.chat(`/register ${config["auth_password"]} ${config["auth_password"]}`)
        } else if (message === `Welcome ${bot.username} to 8builders8tools` || message === "You are already logged in." || message === "Your login session has been continued.") {
            setInterval(() => {
                if (config.whisper_random_messages) {
                    let onlinePlayers = Object.keys(bot.players);
        
                    if (onlinePlayers.length > 0) {
                        fs.readFile("random_message.json", (err, data) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            const messages = JSON.parse(data);
                            const randomIndex = Math.floor(Math.random() * messages.length);
                            const randomMessage = messages[randomIndex];
        
                            const randomPlayer = onlinePlayers[Math.floor(Math.random() * onlinePlayers.length)];
                            bot.chat(`/w ${randomPlayer} ${randomMessage}`);
                        });
                    }
                } else {
                    fs.readFile("random_message.json", (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        const messages = JSON.parse(data);
                        const randomIndex = Math.floor(Math.random() * messages.length);
                        const randomMessage = messages[randomIndex];
                        bot.chat(randomMessage)
                    })
                }
            }, config.spam_interval_in_seconds * 1000);
        }
    }  
});

bot.once("spawn", () => {
    setTimeout(() => {
        bot.chat("/8b8t")
    }, 8000)
})
