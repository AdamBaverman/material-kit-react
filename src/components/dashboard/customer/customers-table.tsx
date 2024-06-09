'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { styled, keyframes, useTheme, type Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';
import { type Keyframes } from '@emotion/react';

export interface Customer {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  address: {
    city: string;
    state: string;
    country: string;
    street: string;
  };
  phone: string;
  createdAt: Date;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (customer: Customer) => void;
}

// Определяем анимацию плавного изменения цвета

export const fadeIn = (theme: Theme): Keyframes => keyframes`
  from {
    background-color: ${theme.palette.primary.light};
    }
    to {
      background-color: ${theme.palette.primary.dark};
      }
      `;

export const fadeOut = (theme: Theme): Keyframes => keyframes`
  from {
    background-color: ${theme.palette.primary.dark};
    }
    to {
      background-color: ${theme.palette.primary.light};
      }
      `;

const AnimatedAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'hovered',
})<{ hovered: boolean; theme: Theme }>(({ hovered, theme }) => ({
  transition: 'transform 0.3s',
  transform: hovered ? 'scale(1.2)' : 'scale(1)',
  animation: hovered ? `${fadeIn(theme)} 0.3s forwards` : `${fadeOut(theme)} 0.3s forwards`,
}));

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange,
  onRowsPerPageChange,
  onEdit
}: CustomersTableProps): React.JSX.Element {
  const theme = useTheme();
  const [hoveredState, setHoveredState] = React.useState<Record<string, boolean>>({});

  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      selectAll();
    } else {
      deselectAll();
    }
  };

  const handleSelectOne = (event: React.ChangeEvent<HTMLInputElement>, id: string): void => {
    if (event.target.checked) {
      selectOne(id);
    } else {
      deselectOne(id);
    }
  };

  const handleHover = (id: string, hovered: boolean): void => {
    setHoveredState((prev) => ({ ...prev, [id]: hovered }));
  };

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Signed Up</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => { handleSelectOne(event, row.id); }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <AnimatedAvatar
                        src={row.avatar}
                        onClick={() => { onEdit(row); }}
                        onMouseEnter={() => { handleHover(row.id, true); }}
                        onMouseLeave={() => { handleHover(row.id, false); }}
                        hovered={hoveredState[row.id] || false}
                        theme={theme}
                      />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {[row.address.city, row.address.state, row.address.country].filter(Boolean).join(', ') || 'homeless'}
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
