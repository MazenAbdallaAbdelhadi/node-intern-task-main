import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const mdUp = useResponsive('up', 'md');

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        py: '2rem',
      }}
    >
      {children}
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      justifyContent='center'
      alignItems='center'
      sx={{
        minHeight: '100vh',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        overflow: 'hidden',
        '& .MuiStack-root': {
          borderRadius: '5px',
        },
      }}
    >
      <Stack direction="row" sx={{ width: 'min(900px, calc(100% - 3rem))' }}>
        {mdUp && (
          <Stack
            flex={1}
            sx={{ background: '#011D42', padding: '2rem 1rem' }}
            alignItems='center'
            justifyContent='space-between'
          >
            <Stack alignItems='center'>
              <Typography component='h1' fontSize='36px' color='GrayText'>
                Royal Taxi
              </Typography>

              <Typography
                textAlign='center'
                fontSize='16px'
                sx={{ mt: '1rem', opacity: '0.8' }}
              >
                Passion drivers amateurs Responsibility drivers proffessionals Curiosity drivers
                geniuses
              </Typography>
            </Stack>

            <Typography>❤️kareem Hussien</Typography>
          </Stack>
        )}

        <Stack
          flex={2}
          justifyContent='center'
          alignItems='center'
          sx={{
            padding: '1rem',
            background: '#121E2E',
          }}
        >
          {renderContent}
        </Stack>
      </Stack>
    </Stack>
  );
}
