import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import LogoImage from '../assets/LOGO.jpg';

interface LogoProps {
  height?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ height = 40, showText = true }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        component="img"
        src={LogoImage}
        alt="UniGoods Logo"
        sx={{
          height: height,
          width: 'auto',
          objectFit: 'contain',
        }}
      />
      {showText && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          UniGoods
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 