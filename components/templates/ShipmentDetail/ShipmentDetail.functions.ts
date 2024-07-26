import { useEffect, useState } from "react";
import { defaultLocation } from "@constants/Constants";

export function useCoordinatesFromAddress({ address, zipCode }: { address: string, zipCode: string }) {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number }>(defaultLocation);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const getLocation = async () => {
            setLoading(true);
            const apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!;
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address})}+${zipCode}&key=${apiKey}`;
            try {
                const response = await fetch(url);
                const json = await response.json();
                const { results } = json;
                if (results.length > 0) {
                    const { geometry } = results[0];
                    const { location: fetchLocation } = geometry;

                    setLocation({
                        lat: fetchLocation.lat,
                        lng: fetchLocation.lng,
                    });
                    setLoading(false);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
                console.error("Error al obtener las coordenadas", error);
            }
        };
        getLocation();
    }, [address, zipCode])

    return { loading, location, error };
};