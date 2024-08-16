import { m } from 'framer-motion';
// @mui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from './../../routes/components';
// components
import { MotionContainer, varBounce } from './../../components/animate';
// assets
import { PageNotFoundIllustration } from './../../assets/illustrations';
import {useTranslation} from "react-i18next";


// ----------------------------------------------------------------------

export default function NotFoundView() {
  const {t } = useTranslation();

  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" paragraph>
          Sorry, Page Not Found!
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('messages.page_not_found')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <PageNotFoundIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </m.div>

      <Button component={RouterLink} href="/" size="large" variant="contained">
        {t('buttons.go_to_home')}
      </Button>
    </MotionContainer>
  );
}
