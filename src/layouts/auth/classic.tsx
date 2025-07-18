// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// auth
import { useAuthContext } from '../../auth/hooks';
// routes
import { paths } from './../../routes/paths';
import { RouterLink } from './../../routes/components';
// hooks
import { useResponsive } from './../../hooks/use-responsive';
// theme
import { bgGradient } from './../../theme/css';
// components
import {useSettingsContext} from "../../components/settings";

// ----------------------------------------------------------------------

const METHODS = [
  {
    id: 'jwt',
    label: 'Jwt',
    path: paths.auth.jwt.login,
    icon: '/assets/icons/auth/ic_jwt.svg',
  },
];

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children }: Props) {
  const { method } = useAuthContext();
  const settings = useSettingsContext();

  const theme = useTheme();

  const upMd = useResponsive('up', 'md');


  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        py: { xs: 15, md: 30 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      spacing={10}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {''}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={settings.themeMode === 'dark' ? '/logo/logo_light.svg' : '/logo/logo_dark.svg'}
        sx={{ maxWidth: 720 }}
      />

      <Stack direction="row" spacing={2}>
        {METHODS.map((option) => (
          <Tooltip key={option.label} title={option.label}>
            <Link component={RouterLink} href={option.path}>

            </Link>
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {upMd && renderSection}

      {renderContent}
    </Stack>
  );
}
