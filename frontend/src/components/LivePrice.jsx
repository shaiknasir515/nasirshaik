import { useEffect, useState } from "react";
import { connectWebSocket } from "../utils/socket";

export default function LivePrice({ symbol }) {
    const [price, setPrice] = useState(null);

    useEffect(() => {
        const socket = connectWebSocket((msg) => {
            if (msg.symbol === symbol) {
                setPrice(msg.price);
            }
        });

        socket.onopen = () => {
            socket.send(JSON.stringify({ symbol }));
        };

        return () => socket.close();
    }, [symbol]);

    return (
        <div style={{ padding: "10px", marginTop: "20px", background: "#eee" }}>
            <h4>Live Price:</h4>
            <h2>{price ? price : "Waiting for updates..."}</h2>
        </div>
    );
}
