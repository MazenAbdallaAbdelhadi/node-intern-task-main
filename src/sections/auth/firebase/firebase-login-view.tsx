import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Divider } from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Label from 'src/components/label';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: 'admin@domain.com',
    password: '123456',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.email, data.password);

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2}>
      <Typography variant="h3">Account Login</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack alignItems="start">
        <Label variant="outlined" sx={{ border: 'none', color: '#808897' }}>
          Email address
        </Label>
        <RHFTextField name="email" placeholder="exmple@email.com" />
      </Stack>

      <Stack alignItems="start">
        <Label variant="outlined" sx={{ border: 'none', color: '#808897' }}>
          Password
        </Label>
        <RHFTextField
          name="password"
          placeholder="Password"
          type={password.value ? 'text' : 'password'}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="info"
        size="medium"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          borderRadius: '5px',
        }}
      >
        Log in
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>

      <Divider sx={{ mt: '1rem', color: '#808897' }}>Welcome Back 😊</Divider>
    </>
  );
}
