export interface Country {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
}

export const countries: Country[] = [
  { name: 'United Arab Emirates', dial_code: '+971', code: 'AE', flag: '🇦🇪' },
  { name: 'United States', dial_code: '+1', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', dial_code: '+44', code: 'GB', flag: '🇬🇧' },
  { name: 'Germany', dial_code: '+49', code: 'DE', flag: '🇩🇪' },
  { name: 'India', dial_code: '+91', code: 'IN', flag: '🇮🇳' },
  { name: 'Saudi Arabia', dial_code: '+966', code: 'SA', flag: '🇸🇦' },
  { name: 'Egypt', dial_code: '+20', code: 'EG', flag: '🇪🇬' },
  { name: 'France', dial_code: '+33', code: 'FR', flag: '🇫🇷' },
  { name: 'Spain', dial_code: '+34', code: 'ES', flag: '🇪🇸' },
  { name: 'Italy', dial_code: '+39', code: 'IT', flag: '🇮🇹' },
  { name: 'Canada', dial_code: '+1', code: 'CA', flag: '🇨🇦' },
  { name: 'Australia', dial_code: '+61', code: 'AU', flag: '🇦🇺' },
  { name: 'China', dial_code: '+86', code: 'CN', flag: '🇨🇳' },
  { name: 'Japan', dial_code: '+81', code: 'JP', flag: '🇯🇵' },
  { name: 'Brazil', dial_code: '+55', code: 'BR', flag: '🇧🇷' },
];
