import { toast } from 'react-toastify';
import { useRef, useState, useCallback, useEffect } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF as Marker,
  Autocomplete
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
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

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
    geocoderRef.current = new google.maps.Geocoder();
  }, []);

  const onPlaceChanged = () => {
    const auto = autocompleteRef.current;
    if (!auto) return;

    const place = auto.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const location = place.geometry.location;
    const loc = {
      lat: location.lat(),
      lng: location.lng(),
    };

    const bounds = new google.maps.LatLngBounds(BAKU_BOUNDS);
    if (!bounds.contains(location)) {
      toast.error('We are not currently supporting this area');
      return;
    }

    setMarkerPos(loc);
    mapRef.current?.panTo(loc);
    onSelect(place.formatted_address?.trim() || '', loc);
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !geocoderRef.current) return;

    const latLng = e.latLng;
    const loc = { lat: latLng.lat(), lng: latLng.lng() };

    const bounds = new google.maps.LatLngBounds(BAKU_BOUNDS);
    if (!bounds.contains(latLng)) {
      toast.error('Please click inside Baku');
      return;
    }

    geocoderRef.current.geocode({ location: loc }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const formatted = results[0].formatted_address;
        setMarkerPos(loc);
        mapRef.current?.panTo(loc);
        if (inputRef.current) inputRef.current.value = formatted;
        onSelect(formatted.trim(), loc);
      } else {
        toast.error('Could not retrieve address');
      }
    });
  };

  if (loadError) return <div style={{ color: 'red' }}>Ошибка загрузки карт</div>;
  if (!isLoaded) return <div>Загрузка карт…</div>;

  return (
    <>
      <Autocomplete
        onLoad={(ref) => {
          autocompleteRef.current = ref;
        }}
        onPlaceChanged={onPlaceChanged}
        options={{
          bounds: new google.maps.LatLngBounds(BAKU_BOUNDS),
          strictBounds: true,
          componentRestrictions: { country: 'az' },
          types: ['geocode'],
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter address or choose on map"
          style={{ width: '100%', padding: '.5rem', fontSize: '1rem', marginBottom: '.5rem' }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPos}
        zoom={13}
        onLoad={onMapLoad}
        onClick={onMapClick}
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
