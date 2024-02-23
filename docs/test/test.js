async function fetchBensinpris() {
    try {
        const response = await fetch('https://bensinpriser.nu/api/v1/prices');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching bensinpris:', error);
    }
}

const bensinData = await fetchBensinpris();
const bensin95Pris = bensinData.find(station => station.fuelType === '95').price;
const bensinPrisPerLiter = bensin95Pris; // Placera priset i en variabel
console.log('Dagens bensinpris (95-oktan):', bensinPrisPerLiter);
