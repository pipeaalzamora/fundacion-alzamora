import React, { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { VALPARAISO_BOUNDS } from '../lib/googleMaps';

// Datos del lugar seleccionado en el autocompletado.
export interface SelectedPlace {
  address: string; // dirección formateada o nombre del punto
  commune?: string; // comuna / ciudad detectada
  lat?: number;
  lng?: number;
}

interface AddressAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (place: SelectedPlace) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// Input de dirección con autocompletado de Google Places.
// Debe renderizarse dentro de un <APIProvider> (Google Maps) para activarse.
// Si la librería de Places no está disponible (sin API key), se comporta como
// un input de texto normal: la app sigue funcionando igual.
export default function AddressAutocomplete({
  id,
  value,
  onChange,
  onSelect,
  placeholder,
  required,
  className,
}: AddressAutocompleteProps) {
  const placesLib = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Guardamos las últimas callbacks en refs para que el listener siempre use
  // la versión actual sin necesidad de reinicializar el widget de Google.
  const onChangeRef = useRef(onChange);
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onChangeRef.current = onChange;
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    if (!placesLib || !inputRef.current || autocompleteRef.current) return;

    // Sesga los resultados hacia la bahía de Valparaíso / Viña del Mar.
    const bounds = new google.maps.LatLngBounds(
      { lat: VALPARAISO_BOUNDS.south, lng: VALPARAISO_BOUNDS.west },
      { lat: VALPARAISO_BOUNDS.north, lng: VALPARAISO_BOUNDS.east }
    );

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      // Restringe estrictamente los resultados a Chile.
      componentRestrictions: { country: 'cl' },
      bounds,
      fields: ['formatted_address', 'name', 'geometry', 'address_components'],
    });
    autocompleteRef.current = autocomplete;

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const address = place.formatted_address || place.name || '';

      // Detecta la comuna/ciudad a partir de los componentes de la dirección.
      let commune: string | undefined;
      for (const comp of place.address_components ?? []) {
        if (comp.types.includes('locality') || comp.types.includes('administrative_area_level_3')) {
          commune = comp.long_name;
          break;
        }
      }
      if (!commune) {
        const admin2 = (place.address_components ?? []).find((c) =>
          c.types.includes('administrative_area_level_2')
        );
        commune = admin2?.long_name;
      }

      if (address) onChangeRef.current(address);
      onSelectRef.current?.({
        address,
        commune,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      });
    });

    return () => listener.remove();
  }, [placesLib]);

  return (
    <input
      id={id}
      ref={inputRef}
      type="text"
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      autoComplete="off"
    />
  );
}
