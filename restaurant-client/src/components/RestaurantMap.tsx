import React from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';

const center = { lat: 40.415002, lng: 49.853308 };
const containerStyle = { width: '100%', height: '400px' };

const RestaurantMap: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  if (loadError) {
    console.error('Google Maps API error:', loadError);
    return <div style={{ color: 'red' }}>Error loading map</div>;
  }

  if (!isLoaded) {
    return <div>Loading map…</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

export default RestaurantMap;