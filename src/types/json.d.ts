declare module "*/itineraries.json" {
  interface ItineraryPointData {
    name: string;
    address: string;
    date: string;
    phone?: string;
    website?: string;
    coordinates: [number, number];
    category?: string;
  }

  interface ItineraryData {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    description?: string;
    points: ItineraryPointData[];
  }

  const data: {
    itineraries: ItineraryData[];
  };

  export default data;
}

declare module "*/visited.json" {
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
