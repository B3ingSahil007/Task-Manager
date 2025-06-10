import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import logo from "../../../../assets/mendajiwala.webp"
// import Logo from 'components/logo';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const email = localStorage.getItem('email');

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={{ fontSize: '20px' }}>
          {/* <b>{email}</b> */}
          <img src={logo} alt="" width={"250px"} />
        </p>
      </div>
    </>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
