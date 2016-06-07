export declare class LightSensor extends RuffDevice {
    /**
     * Get the illuminance of the LightSensor
     * @param callback - The callback to process the illuminance
     */
    getIlluminance(callback: (error: Error, value: number) => void): void;
}

export default LightSensor;
