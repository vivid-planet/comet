import * as React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useI18n } from ".";

export default function LocaleSwitcher() {
    const { locale, setLocale, supportedLocales } = useI18n();
    const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
        setLocale(event.target.value);
    };

    return (
        <div>
            <Select value={locale} onChange={handleChange}>
                {supportedLocales.map(c => (
                    <MenuItem key={c} value={c}>
                        {c}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
}
