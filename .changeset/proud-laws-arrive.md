---
"@comet/admin": minor
---

Add `ChipSelect` component

This adds the ChipSelect component, as well as a wrapper for FinalForm (`FinalFormChipSelect`) and an abstraction for the usage of the previously mentioned component (`ChipSelectField`).

**Example - Basic:**

```tsx
import { ChipSelect } from '@comet/admin';
import { MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { Offline, Online } from "@comet/admin-icons";

const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
];

const MyComponent = () => {
    const [someValue, setSomeValue] = React.useState("");
    
    return (
        <ChipSelect options={options} onChange={(e) => setSomeValue(e.target.value)} selectedOption={someValue} />
    );
};


```

**Example - Final Form:**
```tsx
import { ChipSelectField, FinalForm } from '@comet/admin';
import { MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { Offline, Online } from "@comet/admin-icons";

const MyComponent = () => {
  return (
      <FinalForm
          mode="add"
          onSubmit={() => {
              // ...
          }}
      >
          <ChipSelectField name="chip-select" label="Chip Select">
              <MenuItem value="Option 1">
                  <ListItemIcon>
                      <Online />
                  </ListItemIcon>
                  <ListItemText primary="Option 1" />
              </MenuItem>
              <MenuItem value="Option 2">
                  <ListItemIcon>
                      <Offline />
                  </ListItemIcon>
                  <ListItemText primary="Option 2" />
              </MenuItem>
              <MenuItem value="Option 3">
                  <ListItemText primary="Option 3" />
              </MenuItem>
          </ChipSelectField>
      </FinalForm>
  );
};
```

