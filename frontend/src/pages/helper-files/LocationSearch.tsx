import React, { useState } from "react";
import { FieldProps } from "formik";
import axios from "axios";
import '../css-files/AddTrip.css';
interface LocationSearchProps extends FieldProps { }
const LocationSearch: React.FC<LocationSearchProps> = ({ field, form }) => {
    const [query, setQuery] = useState(field.value || "");
    const [suggestions, setSuggestions] = useState<string[]>([]); // Suggestions from API
    const [error, setError] = useState<string | null>(null); // Error handling

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        form.setFieldValue(field.name, value); // Update Formik's value
        // Fetch suggestions if input is not empty
        if (value) {
            try {
                const apiKey = "1ae701ed36c446c19fbf043aa05a53c9"; // Replace with your OpenCage API key
                const response = await axios.get(
                    `https://api.opencagedata.com/geocode/v1/json`,
                    {
                        params: {
                            q: value,
                            key: apiKey,
                            limit: 5,
                            language: "en",
                        },
                    }
                );

                // console.log("API Response:", response.data);
                // console.log("Field:", field);
                // console.log("Form:", form);
                // console.log('API URL:', `https://api.opencagedata.com/geocode/v1/json?q=${value}&key=${apiKey}&limit=5&language=en`);

                const locations = response.data.results.map((result: any) => result.formatted);
                setSuggestions(locations);
                setError(null); // Clear any existing errors
            } catch (err) {
                setError("Failed to fetch suggestions. Please try again.");
            }
        } else {
            setSuggestions([]); // Clear suggestions if input is empty
        }
    };
    return (
        <div className="form-group">
            <input
                type="text"
                id={field.name}
                name={field.name}
                className="input-field"
                value={query}
                onChange={handleInputChange}
                placeholder="Start typing a location..."
            />
            {error && <div className="error">{error}</div>}
            {/* Show suggestions */}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setQuery(suggestion);
                                setSuggestions([]);
                                form.setFieldValue(field.name, suggestion); // Update Formik's value on selection
                            }}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default LocationSearch;