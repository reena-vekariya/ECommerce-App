'use client';

import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, IconButton, Select, MenuItem,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { adminService } from '@/services/wishlist.service';
import { IUser } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => adminService.getUsers({ limit: 100 }).then((r) => setUsers(r.data ?? []));
  useEffect(() => { fetch().finally(() => setLoading(false)); }, []);

  const handleRoleChange = async (id: string, role: string) => {
    await adminService.updateUserRole(id, role);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await adminService.deleteUser(id);
    fetch();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Users ({users.length})</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.fullName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    sx={{ fontSize: 12 }}
                  >
                    <MenuItem value="user">user</MenuItem>
                    <MenuItem value="admin">admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton size="small" color="error" onClick={() => handleDelete(u._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
