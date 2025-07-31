import { COLOR_SCHEMES } from '../types';

interface ColorSchemeSelectorProps {
  selectedScheme: keyof typeof COLOR_SCHEMES;
  onSchemeChange: (scheme: keyof typeof COLOR_SCHEMES) => void;
}

export function ColorSchemeSelector({
  selectedScheme,
  onSchemeChange,
}: ColorSchemeSelectorProps) {
  return (
    <div className="color-scheme-selector">
      <label className="color-scheme-label">
        🎨 Color Scheme
      </label>

      <div className="color-scheme-grid">
        {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
          <div
            key={key}
            onClick={() => onSchemeChange(key as keyof typeof COLOR_SCHEMES)}
            className={`color-scheme-option ${selectedScheme === key ? 'selected' : ''}`}
            style={{
              backgroundColor: scheme.countryFill,
              borderColor: scheme.countryBorder,
            }}
            title={`${scheme.name} color scheme`}
          >
            <div
              className="color-scheme-dot"
              style={{
                backgroundColor: scheme.cityFill,
                borderColor: scheme.cityBorder,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
