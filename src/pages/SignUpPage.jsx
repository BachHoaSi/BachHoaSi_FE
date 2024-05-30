import { LockOutlined, MailOutline, PersonOutline } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Container,
    CssBaseline,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

const theme = createTheme();

const SignUpPage = () => {
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper elevation={6} sx={{ p: 3, mt: 8 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <PersonOutline />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Đăng ký
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
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
                                    startAdornment: <PersonOutline />,
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
                                autoComplete="email"
                                InputProps={{
                                    startAdornment: <MailOutline />,
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
                                    startAdornment: <LockOutlined />,
                                }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"
                                type="password"
                                id="confirmPassword"
                                autoComplete="current-password"
                                InputProps={{
                                    startAdornment: <LockOutlined />,
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Đăng ký
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default SignUpPage;
