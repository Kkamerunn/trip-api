import axios from 'axios';

export async function getAddressFromCoordinates(lat: number, lon: number): Promise<string> {
  const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
    params: {
      lat,
      lon,
      //format: 'json',
    },
  });
  return response.data.display_name;
}