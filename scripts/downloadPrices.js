import fs from "fs";
import fetch from "node-fetch";

const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

const FILE_STORAGE = "src/lib/config/prices.json"

const fetchLatest = async () => {
    const data = await fetch(API_URL);
    return data.json();
}

const cleanPrice = ({ id, symbol, name, image, current_price }) => ({ id, symbol, name, image, current_price });

async function downloadAndSaveData() {
    const data = await fetchLatest();
    const cleanedData = data.map(cleanPrice);
    fs.writeFile(FILE_STORAGE, JSON.stringify(cleanedData, null, 2), 'utf-8', (err) => {
        if (err) throw err;
    });
}

downloadAndSaveData();
