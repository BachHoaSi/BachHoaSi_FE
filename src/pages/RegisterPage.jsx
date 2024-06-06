import {
    GitHub,
    LockOutlined, MailOutline, PersonOutline
} from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Link,
    Paper,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

const Header = () => (
    <AppBar position="static" sx={{ bgcolor: 'rgba(0, 0, 0, 0.65)' }}>
        <Toolbar>
            <Typography
                variant="h6"
                component="div"
                sx={{
                    flexGrow: 1,
                    color: 'white',
                    fontFamily: 'Black Ops One',
                    fontSize: '2rem'
                }}
            >
                <Link href="/admin/dashboard" underline="none">
                    Bach Hoa Si
                </Link>
            </Typography>
            <Link href="/login" color="inherit" underline="none" sx={{ mr: 2 }}>
                Login
            </Link>
        </Toolbar>
    </AppBar>
);

const Footer = () => (
    <Box
        component="footer"
        sx={{
            bgcolor: 'rgba(0, 0, 0, 0.65)',
            p: 2,
            textAlign: 'center',
            color: 'white',
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
        }}
    >
        <Typography variant="body2" color="inherit">
            Bach Hoa Xanh &copy; {new Date().getFullYear()} Created by Nhat Sang
        </Typography>
    </Box>
);

const RegisterPage = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        event.currentTarget.reset();

        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (!username || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields.", { containerId: 'error' });
            return;
        } else if (password !== confirmPassword) {
            toast.error("Passwords do not match.", { containerId: 'error' });
            return;
        }
        toast.success("Sign up successful!", { containerId: 'success' });
    };

    return (
        <ThemeProvider theme={theme}>
            <Header />

            <Container component="main" maxWidth="xs" sx={{ position: 'relative' }}>
                <CssBaseline />

                <video
                    autoPlay
                    loop
                    muted
                    style={{
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        objectFit: 'cover',
                        zIndex: -1,
                    }}
                >
                    <source src="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr" type="video/mp4" />
                </video>

                <Paper elevation={6} sx={{ p: 3, mt: 8, bgcolor: 'rgba(0, 0, 0, 0.65)' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: 'white',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <GitHub />
                        </Avatar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                color: 'white',
                                fontFamily: 'Black Ops One',
                                fontSize: '1.5rem'
                            }}
                        >
                            <Link href="/admin/dashboard" underline="none">
                                Bach Hoa Si
                            </Link>
                        </Typography>
                        <Typography component="p">Nền tảng phân phối hàng hóa lớn nhất thế giới</Typography>

                        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Tên đăng nhập"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                InputProps={{
                                    startAdornment: <PersonOutline sx={{ color: 'white' }} />,
                                }}
                                sx={{
                                    '& .MuiInputLabel-root': { color: 'white' },
                                    input: { color: 'white' },
                                    fieldset: { borderColor: 'white' },
                                }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                id="email"
                                autoComplete="email" InputProps={{
                                    startAdornment: <MailOutline sx={{ color: 'white' }} />,
                                }}
                                sx={{
                                    '& .MuiInputLabel-root': { color: 'white' },
                                    input: { color: 'white' },
                                    fieldset: { borderColor: 'white' },
                                }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                InputProps={{
                                    startAdornment: <LockOutlined sx={{ color: 'white' }} />,
                                }}
                                sx={{
                                    '& .MuiInputLabel-root': { color: 'white' },
                                    input: { color: 'white' },
                                    fieldset: { borderColor: 'white' },
                                }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"s
                                type="password"
                                id="confirmPassword"
                                autoComplete="current-password"
                                InputProps={{
                                    startAdornment: <LockOutlined sx={{ color: 'white' }} />,
                                }}
                                sx={{
                                    '& .MuiInputLabel-root': { color: 'white' },
                                    input: { color: 'white' },
                                    fieldset: { borderColor: 'white' },
                                }}
                            />
                            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                                Sign Up
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>

            <Footer />

            <ToastContainer
                enableMultiContainer
                containerId='error'
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
            <ToastContainer
                enableMultiContainer
                containerId='success'
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </ThemeProvider>
    );
};

export default RegisterPage;
