import React from 'react';
import { Box, BoxProps } from '@mui/material';
import logoImage from '../assets/LOGO.jpg';

interface LogoProps extends BoxProps {
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ height = 50, ...props }) => {
  return (
    <Box
      component="img"
      src={logoImage}
      alt="UniGoods Logo"
      sx={{
        height: height,
        width: 'auto',
        objectFit: 'contain',
        ...props.sx
      }}
      {...props}
    />
  );
};

export default Logo; 