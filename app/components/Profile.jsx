import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '../contexts/ThemeContext';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { Icon } from '@iconify/react';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Cookies from 'js-cookie';

export default function Profile({ username, email, role, status, gender }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { theme } = useTheme();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    sessionStorage.clear();
    Cookies.remove('user');
    window.location.href = '/'
  };

  return (
    <div>
      <Tooltip title="Profile">
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Avatar sx={{ width: 35, height: 35, fontSize: 16 }} style={{ backgroundColor: theme.primaryColor }}>{String(username).slice(0, 2)}</Avatar>
        </Button></Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <div className='flex justify-between gap-3 items-center'>
            <div>
              <Avatar style={{ backgroundColor: theme.primaryColor }}>{String(username).slice(0, 2)}</Avatar>
            </div>
            <div className='flex flex-col'>
              <p style={{ color: theme.primaryColor }} className='text-md font-bold'>{username}</p>

              <p className='text-xs'>{email}</p>
            </div>
          </div>
        </MenuItem>
        <MenuItem className='w-[100%]'>
          <div className='flex justify-between gap-[100%]'>
            <span className='font-bold '>Role: </span>
            <Chip size='small' label={role} color="primary" />
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose} className='underline'>Account</MenuItem>
        <MenuItem onClick={handleClose} className='underline'>Privacy</MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <Icon icon="ic:outline-logout" className='text-2xl' />
          <span>Sign Out</span>
        </MenuItem>
      </Menu>
    </div>

  );
}