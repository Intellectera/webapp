import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {useCallback, useState} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import {paths} from './../../../routes/paths';
import {useSearchParams} from '../../../routes/hook';
import {RouterLink} from './../../../routes/components';
// config
import {IS_PRODUCTION, PATH_AFTER_LOGIN} from './../../../config-global';
// hooks
import {useBoolean} from './../../../hooks/use-boolean';
// auth
import {useAuthContext} from '../../../auth/hooks';
// components
import Iconify from './../../../components/iconify';
import FormProvider, {RHFTextField} from './../../../components/hook-form';
import {CustomError} from "../../../utils/types.ts";
import {useTranslation} from "react-i18next";

// ----------------------------------------------------------------------

type FormValuesProps = {
    email: string;
    password: string;
};

export default function JwtLoginView() {
    const {t } = useTranslation();


    const {login} = useAuthContext();

    const [errorMsg, setErrorMsg] = useState('');

    const searchParams = useSearchParams();

    const returnTo = searchParams.get('returnTo');

    const password = useBoolean();

    const LoginSchema = Yup.object().shape({
        email: Yup.string().required(t('errors.email_required')).email(t('errors.email_valid')),
        password: Yup.string().required(t('errors.password_required')),
    });

    const defaultValues = {
        email: 'arash@gmail.com',
        password: '123456',
    };

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const onSubmit = useCallback(
        async (data: FormValuesProps) => {
            try {
                await login?.(data.email, data.password);
                window.location.href = returnTo || PATH_AFTER_LOGIN;
            } catch (error) {
                if (!IS_PRODUCTION) {
                    console.error(error);
                }
                const customError: CustomError = error as CustomError;
                reset();
                // @ts-ignore
                setErrorMsg(customError.error.message ? customError.error.message : 'Unknown error');
            }
        },
        [login, reset, returnTo]
    );

    const renderHead = (
        <Stack spacing={2} sx={{mb: 5}}>
            <Typography variant="h4">{t('login')}</Typography>

            <Stack direction="row" spacing={0.5}>
                <Typography variant="body2">{t('new_user')}</Typography>

                <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
                    {t('create_account')}
                </Link>
            </Stack>
        </Stack>
    );

    const renderForm = (
        <Stack spacing={2.5}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <RHFTextField className={'overflow-visible-children-i'} name="email" label={t('email')}/>

            <RHFTextField
                name="password"
                label={t('password')}
                type={password.value ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={password.onToggle} edge="end">
                                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}/>
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Link variant="body2" color="inherit" underline="always" sx={{alignSelf: 'flex-end'}}>
                {t('forgot_password')}
            </Link>

            <LoadingButton
                fullWidth
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
