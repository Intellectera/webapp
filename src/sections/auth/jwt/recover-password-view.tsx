import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// config
import { CAPTCHA_SITE_KEY, IS_PRODUCTION } from './../../../config-global';
// hooks
import { useBoolean } from './../../../hooks/use-boolean';
// components
import Iconify from './../../../components/iconify';
import FormProvider, { RHFTextField } from './../../../components/hook-form';
import { CustomError } from "../../../utils/types.ts";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import { useParams } from 'react-router';
import recoverPassword from '../../../utils/calls/auth/recover-password.ts';
import { paths } from '../../../routes/paths.ts';

// ----------------------------------------------------------------------

type FormValuesProps = {
    newPassword: string;
};

export default function RecoverPasswordView() {
    const { t } = useTranslation();

    const { token } = useParams();

    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [remaining, setRemaining] = useState(5);
    const [captcha, setCaptcha] = useState<string | null>(null);

    const password = useBoolean();

    const RecoverPasswordSchema = Yup.object().shape({
        newPassword: Yup.string().required(t('errors.password_required')).min(6, t('errors.password_min')),
    });

    const defaultValues = {
        newPassword: '',
    };

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(RecoverPasswordSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSuccess = () => {
        setSuccess(true);
        const interval = setInterval(() => {
            setRemaining((prev) => prev - 1);
        }, 1000);
        setTimeout(() => {
            clearInterval(interval);
            setSuccess(false);
            setRemaining(5);
            window.location.href = paths.auth.jwt.login
        }, 5000);
    }

    const onSubmit = useCallback(
        async (data: FormValuesProps) => {
            setErrorMsg('');
            recoverPassword({token: token!, password: data.newPassword})
            .then(result => {
                if (result) {
                    onSuccess();
                } else {
                    setErrorMsg(t('errors.token_is_not_valid'));
                }
            })
            .catch(error => {
                if (!IS_PRODUCTION) {
                    console.error(error);
                }
                const customError: CustomError = error as CustomError;
                reset();
                // @ts-ignore
                setErrorMsg(customError.error.message ? customError.error.message : 'Unknown error');
            })
        },
        [reset ]
    );

    const renderHead = (
        <Stack spacing={2} sx={{ mb: 5 }}>
            <Typography variant="h4">{t('recover_password')}</Typography>
        </Stack>
    );

    const renderForm = (
        <Stack spacing={2.5}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            {success && <Alert severity="success">{t('messages.recover_password_success') + ` ${remaining} ...`}</Alert>}

            <RHFTextField
                name="newPassword"
                label={t('new_password')}
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
                {t('continue')}
            </LoadingButton>
        </Stack>
    );

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {renderHead}

            {renderForm}
        </FormProvider>
    );
}
