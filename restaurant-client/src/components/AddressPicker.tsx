import { useRef, useState, useCallback, useEffect } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF as Marker,
  StandaloneSearchBox
} from '@react-google-maps/api';

const BAKU_BOUNDS: google.maps.LatLngBoundsLiteral = {
  north: 40.49306,
  south: 40.309825,
  west: 49.776516,
  east: 50.001,
};

const containerStyle = { width: '100%', height: '300px' };

interface AddressPickerProps {
  initialAddress?: string;
  initialLocation?: google.maps.LatLngLiteral;
  onSelect: (address: string, location: google.maps.LatLngLiteral) => void;
}

export default function AddressPicker({
  initialAddress = '',
  initialLocation,
  onSelect,
}: AddressPickerProps) {
  const libraries = ['places'] as const;
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: libraries as any,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral>(
    initialLocation || { lat: 40.415002, lng: 49.853308 }
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = initialAddress.trim();
    }
    if (initialLocation) {
      setMarkerPos(initialLocation);
    }
  }, [initialAddress, initialLocation]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.fitBounds(BAKU_BOUNDS);
  }, []);

  const onPlacesChanged = () => {
    const box = searchBoxRef.current;
    if (!box) return;
    const places = box.getPlaces();
    if (!places || !places.length) return;

    const place = places[0];
    if (!place.geometry || !place.geometry.location) return;

    const location = place.geometry.location;
    const loc = {
      lat: location.lat(),
      lng: location.lng(),
    };

    const bounds = new google.maps.LatLngBounds(BAKU_BOUNDS);
    if (!bounds.contains(new google.maps.LatLng(loc))) {
      alert('Пожалуйста, выберите адрес внутри Баку');
      return;
    }

    setMarkerPos(loc);
    mapRef.current?.panTo(loc);
    onSelect(place.formatted_address?.trim() || '', loc);
  };

  if (loadError) return <div style={{ color: 'red' }}>Ошибка загрузки карт</div>;
  if (!isLoaded) return <div>Загрузка карт…</div>;

  return (
    <>
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Введите адрес в Баку"
          style={{ width: '100%', padding: '.5rem', fontSize: '1rem', marginBottom: '.5rem' }}
        />
      </StandaloneSearchBox>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPos}
        zoom={13}
        onLoad={onMapLoad}
        options={{
          restriction: {
            latLngBounds: BAKU_BOUNDS,
            strictBounds: true,
          },
          fullscreenControl: false,
          mapTypeControl: false,
        }}
      >
        <Marker position={markerPos} />
      </GoogleMap>
    </>
  );
}
