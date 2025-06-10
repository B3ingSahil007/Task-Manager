// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';

import Box from '@mui/material/Box';

import MobileSection from './MobileSection';


// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      
      {downLG && <MobileSection />}
    </>
  );
}
