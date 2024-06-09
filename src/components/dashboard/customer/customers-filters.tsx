import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Box, Grid } from '@mui/material';

interface CustomersFiltersProps {
  ButtonsElement: React.JSX.Element;
}
export function CustomersFilters({ ButtonsElement }: CustomersFiltersProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          <OutlinedInput
            defaultValue=""
            fullWidth
            placeholder="Search customer"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
            sx={{ maxWidth: '500px' }}
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
