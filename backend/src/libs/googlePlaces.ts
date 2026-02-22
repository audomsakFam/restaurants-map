import "dotenv/config";

const fetchFromGooglePlaces = async (keyword: string) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.location,places.formattedAddress",
      },
      body: JSON.stringify({
        textQuery: `ร้านอาหาร ${keyword}`,
        languageCode: "th",
        regionCode: "th", 
      }),
    },
  );

  const data = (await response.json()) as any;

  if (!data.places) return [];

  return data.places.map((place: any) => ({
    id: place.id,
    name: place.displayName?.text || "ไม่มีชื่อร้าน",
    latitude: place.location?.latitude,
    longitude: place.location?.longitude,
    address: place.formattedAddress || "",
    source: "google",
  }));
};

export default fetchFromGooglePlaces;
