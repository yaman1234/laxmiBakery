import React from 'react';
import { Box, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { siteConfig } from '../config/siteConfig';

interface SocialLinksProps {
  /** MUI sx prop for the wrapping Box. */
  sx?: object;
}

/**
 * Renders social icon buttons from centralized siteConfig.
 * Facebook/Instagram icons appear only when their env URLs are configured.
 */
const SocialLinks: React.FC<SocialLinksProps> = ({ sx }) => (
  <Box sx={sx}>
    {siteConfig.social.facebook && (
      <IconButton
        color="inherit"
        aria-label="Facebook"
        component="a"
        href={siteConfig.social.facebook}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookIcon />
      </IconButton>
    )}
    {siteConfig.social.instagram && (
      <IconButton
        color="inherit"
        aria-label="Instagram"
        component="a"
        href={siteConfig.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
      >
        <InstagramIcon />
      </IconButton>
    )}
    <IconButton
      color="inherit"
      aria-label="WhatsApp"
      component="a"
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsAppIcon />
    </IconButton>
  </Box>
);

export default SocialLinks;
