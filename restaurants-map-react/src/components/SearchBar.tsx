import type { FormEvent, MouseEvent } from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  suggestions?: string[];
  onSelectSuggestion?: (item: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  suggestions = [],
  onSelectSuggestion,
  placeholder,
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  return (
    <div className="mt-3 pointer-events-none absolute left-1/2 top-3 z-1000 -translate-x-1/2 px-3 sm:top-4">
      <form
        onSubmit={handleSubmit}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 shadow-lg shadow-black/25 ring-1 ring-black/10 sm:px-4 sm:py-2.5"
      >
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-[70vw] max-w-120 min-w-55 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none sm:w-120 sm:text-base"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          Search
        </button>
      </form>
      {suggestions.length > 0 && (
        <div className="pointer-events-auto mt-2 w-full max-w-150 rounded-2xl bg-white/95 px-2 py-2 shadow-xl shadow-black/15 ring-1 ring-black/10 sm:max-w-150">
          <ul className="max-h-64 overflow-auto">
            {suggestions.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onSelectSuggestion?.(item)}
                  className="w-full rounded-xl px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                >
                  <div className="text-sm font-medium text-gray-900">{item}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
