import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Box, Grid } from '@mui/material';

interface CustomersFiltersProps {
  ButtonsElement: React.JSX.Element;
  onSearch: (name: string) => void;
}
export function CustomersFilters({ ButtonsElement, onSearch }: CustomersFiltersProps): React.JSX.Element {
  const [name, setName] = React.useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    // console.log('name entered', name);
    if (event.key === 'Enter') {
      onSearch(name);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          <OutlinedInput
            fullWidth
            placeholder="Search customer"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
            sx={{ maxWidth: '500px' }}
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
              if (event.target.value.length === 0) {
                onSearch('');
              }
            }}
            onKeyDown={handleKeyDown}
          />
        </Grid>
        <Grid>
          <Box component="div" sx={{ display: 'inline-flex', msFlexDirection: 'row', flexDirection: 'row' }}>
            {ButtonsElement}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
