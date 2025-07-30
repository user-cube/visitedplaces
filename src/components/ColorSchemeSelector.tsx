import { COLOR_SCHEMES } from '../types';

interface ColorSchemeSelectorProps {
  selectedScheme: keyof typeof COLOR_SCHEMES;
  onSchemeChange: (scheme: keyof typeof COLOR_SCHEMES) => void;
}

export function ColorSchemeSelector({ selectedScheme, onSchemeChange }: ColorSchemeSelectorProps) {
  return (
    <div>
      <label
        style={{
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '8px',
          display: 'block',
          color: '#374151',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        🎨 Color Scheme
      </label>

      {/* Color Preview Squares */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          justifyContent: 'center',
        }}
      >
        {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
          <div
            key={key}
            onClick={() => onSchemeChange(key as keyof typeof COLOR_SCHEMES)}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              backgroundColor: scheme.countryFill,
              border: `2px solid ${scheme.countryBorder}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: selectedScheme === key ? 'scale(1.1)' : 'scale(1)',
              boxShadow:
                selectedScheme === key
                  ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                  : '0 1px 3px rgba(0, 0, 0, 0.1)',
              position: 'relative',
            }}
            title={`${scheme.name} color scheme`}
          >
            {/* Small red dot to show city color */}
            <div
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: scheme.cityFill,
                border: `1px solid ${scheme.cityBorder}`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 