declare module "*.json" {
    const value: {
        visited: Array<{
            city: string;
            country: string;
            coordinates: [number, number];
            photos?: string[];
        }>;
    };
    export default value;
}
