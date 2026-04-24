const { Server } = require("socket.io");
const axios = require("axios");

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        let interval = null;

        socket.on("startLivePrice", (symbol) => {
            console.log("Live price started for:", symbol);

            if (interval) clearInterval(interval);

            interval = setInterval(async () => {
                try {
                    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
                    const response = await axios.get(url);
                    const price = response.data.quoteResponse.result[0]?.regularMarketPrice;

                    socket.emit("livePrice", price);
                } catch (err) {
                    console.log("Error:", err);
                }
            }, 2000);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
            clearInterval(interval);
        });
    });
};
