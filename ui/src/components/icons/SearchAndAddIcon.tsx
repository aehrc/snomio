// material-ui
import { useTheme } from '@mui/material/styles';

import searchAndAddIcon from '../../assets/images/icons/SearchAdd.png';
import { ThemeMode } from '../../types/config';
// ==============================|| LOGO ICON SVG ||============================== //

interface SearchAndAddIconProps {
  width: string;
  alt: string;
}
const SearchAndAddIcon = ({ width, alt }: SearchAndAddIconProps) => {
  const theme = useTheme();

  return (
    <img
      src={
        theme.palette.mode === ThemeMode.DARK
          ? searchAndAddIcon
          : searchAndAddIcon
      }
      alt={alt}
      title={alt}
      width={width}
    />
  );
};

export default SearchAndAddIcon;
