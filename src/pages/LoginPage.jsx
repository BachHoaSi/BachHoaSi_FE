import {
  GitHub,
  LocalShipping,
  LockOutlined,
  MailOutline,
  PersonOutline,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const theme = createTheme();

const LoginPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    // Temporary username/password check (replace with actual authentication logic later)
    if (username === 'admin@123' && password === 'admin@123') {
      console.log("Login successful!");
      navigate('/admin/dashboard'); // Redirect to the admin dashboard
    } else {
      setError("Invalid username or password.");
    }

    // Commented out API call for now
    /*
    try {
      const response = await fetch('/your-login-endpoint', { 
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log("Login successful!");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred during login.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
    */
  };

  return (
    <ThemeProvider theme={theme}>
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
            <Typography component="h1" variant="h5">
              GitHub
            </Typography>
            <Typography component="p">Nền tảng quản lý mã nguồn lớn nhất thế giới</Typography>

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

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                Đăng nhập
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <input type="checkbox" id="autoLogin" name="autoLogin" />
                  <label htmlFor="autoLogin" style={{ color: 'white' }}> Đăng nhập tự động</label>
                </Box>
                <a href="#" style={{ color: 'white' }}>
                  Quên mật khẩu
                </a>
              </Box>
            </Box>

            <Divider sx={{ my: 2, color: 'white' }}>Hoặc đăng nhập bằng</Divider>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button>
                <Avatar sx={{ bgcolor: '#1677FF' }}>
                  <GitHub />
                </Avatar>
              </Button>
              <Button>
                <Avatar sx={{ bgcolor: '#FF6A10' }}>
                  <LocalShipping />
                </Avatar>
              </Button>
              <Button>
                <Avatar sx={{ bgcolor: '#1890ff' }}>
                  <MailOutline />
                </Avatar>
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
