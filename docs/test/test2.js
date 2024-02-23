async function fetchBensinpris() {
    try {
        const response = await fetch('https://bensinpriser.nu/api/v1/prices');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fel vid hämtning av bensinpris:', error);
    }
}

async function main() {
    const bensinData = await fetchBensinpris();
    const bensin95Pris = bensinData.find(station => station.fuelType === '95').price;
    const bensinPrisPerLiter = bensin95Pris;
    console.log('Dagens bensinpris (95-oktan):', bensinPrisPerLiter);
}

main();
