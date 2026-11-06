import { MOROCCAN_HUBS, VEHICLE_FLEET, type CityHub, type VehicleModel } from "./morocco-data";
import type { VehicleRate } from "./booking-engine";

export function toVehicleRate(vehicle: VehicleModel): VehicleRate {
    return {
        id: vehicle.id,
        name: vehicle.name,
        dailyPriceEur: vehicle.dailyPriceEur,
        dailyPriceMad: vehicle.dailyPriceMad,
        transmission: vehicle.transmission,
        seats: vehicle.seats,
        standardDepositEur: 300,
    };
}

export function findVehicle(id: string): VehicleModel | null {
    return VEHICLE_FLEET.find((vehicle) => vehicle.id === id) ?? null;
}

export function findHub(slug: string): CityHub | null {
    return MOROCCAN_HUBS.find((hub) => hub.slug === slug) ?? null;
}

export function listVehicles(): VehicleRate[] {
    return VEHICLE_FLEET.map(toVehicleRate);
}
