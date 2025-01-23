
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// config
import { CAPTCHA_SITE_KEY, IS_PRODUCTION } from './../../../config-global';
// components
import FormProvider, { RHFTextField } from './../../../components/hook-form';
import { CustomError } from "../../../utils/types.ts";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import forgetPassowrd from '../../../utils/calls/auth/forget-password.ts';

// ----------------------------------------------------------------------

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

type FormValuesProps = {
    email: string;
};

export default function ForgetPasswordView() {
    const { t } = useTranslation();

    const [hasError, setHasError] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [captcha, setCaptcha] = useState<string | null>(null);

    const ForgetPasswordSchema = Yup.object().shape({
        email: Yup.string().required(t('errors.email_required')).email(t('errors.email_valid')),
    });

    const defaultValues = {
        email: '',
    };

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(ForgetPasswordSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = useCallback(
        async (data: FormValuesProps) => {
            setShowAlert(false);
            setHasError(false);

            forgetPassowrd(data).then((result) => {
                setShowAlert(true);
                setHasError(!result);
            }).catch((error: CustomError) => {
                if (!IS_PRODUCTION) {
                    console.error(error);
                }
                setHasError(true);
                setShowAlert(true);
            })
        },
        [reset]
    );

    const renderHead = (
        <Stack spacing={2} sx={{ mb: 5 }}>
            <Typography variant="h4">{t('recover_password')}</Typography>


        </Stack>
    );

    const renderForm = (
        <Stack spacing={2.5}>
            {showAlert && (
                <Alert className={classNames('w-100')} variant="filled" severity={hasError ? "error" : "success"}>
                    {hasError ? t('errors.forget_password') : t('messages.forget_password_sent')}
                </Alert>
            )}

            <RHFTextField className={'overflow-visible-children-i'} name="email" label={t('email')} />

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
