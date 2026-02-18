import React, { useState, useRef, useEffect } from 'react';
import { countries, Country } from '../data/countries';

interface CountryCodePickerProps {
    selectedCountry: Country;
    onCountryChange: (country: Country) => void;
}

const CountryCodePicker: React.FC<CountryCodePickerProps> = ({ selectedCountry, onCountryChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (country: Country) => {
        onCountryChange(country);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center gap-2 h-full px-3 bg-gray-200 rounded-l-md border border-r-0 border-gray-300"
            >
                <span>{selectedCountry.flag}</span>
                <span className="text-sm font-semibold text-gray-700">{selectedCountry.dial_code}</span>
            </button>
            {isOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-20 max-h-60 overflow-y-auto">
                    {countries.map(country => (
                        <button
                            key={country.code}
                            type="button"
                            onClick={() => handleSelect(country)}
                            className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-100"
                        >
                            <span>{country.flag}</span>
                            <span className="text-sm text-gray-800 flex-1">{country.name}</span>
                            <span className="text-sm text-gray-500">{country.dial_code}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CountryCodePicker;
