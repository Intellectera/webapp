import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
// @ts-ignore
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from './../../../hooks/use-boolean';
// routes
import { paths } from './../../../routes/paths';
import { useSearchParams } from '../../../routes/hook';
import { RouterLink } from './../../../routes/components';
// config
import { CAPTCHA_SITE_KEY, IS_PRODUCTION, PATH_AFTER_LOGIN } from './../../../config-global';
// auth
import { useAuthContext } from '../../../auth/hooks';
// components
import Iconify from './../../../components/iconify';
import FormProvider, { RHFTextField } from './../../../components/hook-form';
import { CustomError } from "../../../utils/types.ts";
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from '../../../components/settings/index.ts';
import ReCAPTCHA from "react-google-recaptcha";

// ----------------------------------------------------------------------


type FormValuesProps = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

export default function JwtRegisterView() {
    const { register } = useAuthContext();
    const { t } = useTranslation();
    const settings = useSettingsContext();

    const [errorMsg, setErrorMsg] = useState('');
    const [captcha, setCaptcha] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');

    let invitationEmail : string | null = searchParams.get('email');
    invitationEmail = (invitationEmail && invitationEmail.trim().length > 0) ? invitationEmail : null;
    let invitationId : string | null = searchParams.get('invitationId');
    invitationId = (invitationId && invitationId.trim().length > 0) ? invitationId : null;

    const password = useBoolean();

    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string().required(t('errors.first_name_required')),
        lastName: Yup.string().required(t('errors.last_name_required')),
        email: Yup.string().required(t('errors.email_required')).email(t('errors.email_valid')),
        password: Yup.string().required(t('password_required')),
    });

    const defaultValues = {
        firstName: '',
        lastName: '',
        email: invitationEmail ? invitationEmail : '',
        password: '',
    };

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = useCallback(
        async (data: FormValuesProps) => {
            try {
                await register?.(data.email, data.password, data.firstName, data.lastName, invitationId);
                window.location.href = returnTo || PATH_AFTER_LOGIN;
            } catch (error) {
                if (!IS_PRODUCTION) {
                    console.error(error);
                }
                const customError: CustomError = error as CustomError;
                reset();
                setErrorMsg(customError.error.message ? customError.error.message : 'Unknown error');
            }
        },
        [register, reset, returnTo]
    );

    const renderHead = (
        <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
            <Typography variant="h4">{t('titles.get_started_free')}</Typography>

            <Stack direction="row" spacing={0.5}>
                <Typography variant="body2"> {t('titles.already_have_account')} </Typography>

                <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
                    {t('labels.sign_in')}
                </Link>
            </Stack>
        </Stack>
    );


    const renderForm = (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
                {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {settings.themeDirection === 'ltr' ? (
                        <>
                            <RHFTextField name="firstName" label={t('labels.first_name')} />
                            <RHFTextField name="lastName" label={t('labels.last_name')} />
                        </>
                    ) : (
                        <>
                            <RHFTextField name="lastName" label={t('labels.last_name')} />
                            <RHFTextField name="firstName" label={t('labels.first_name')} />
                        </>
                    )}
                </Stack>

                <RHFTextField disabled={invitationEmail != null} name="email" label={t('email')} />

                <RHFTextField
                    name="password"
                    label={t('password')}
                    type={password.value ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={password.onToggle} edge="end">
                                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* @ts-ignore */}
                <ReCAPTCHA
                    sitekey={CAPTCHA_SITE_KEY}
                    onChange={(value) => setCaptcha(value)}
                />


                <LoadingButton
                    fullWidth
                    disabled={captcha === null}
                    color="inherit"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                >
                    {t('create_account')}
                </LoadingButton>
            </Stack>
        </FormProvider>
    );

    return (
        <>
            {renderHead}

            {renderForm}
        </>
    );
}
