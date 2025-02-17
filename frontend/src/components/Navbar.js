import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Badge, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { styled } from '@mui/material/styles';

const StyledTitle = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  textDecoration: 'none',
  color: 'white',
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  marginLeft: theme.spacing(2),
}));

const CartButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="static">
      <Toolbar>
        <StyledTitle variant="h6" component={StyledLink} to="/">
          E-Shop
        </StyledTitle>
        
        <Button color="inherit" component={StyledLink} to="/products">
          Products
        </Button>

        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
            <CartButton 
              color="inherit" 
              component={StyledLink} 
              to="/cart"
            >
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </CartButton>
          </>
        ) : (
          <>
            <Button color="inherit" component={StyledLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={StyledLink} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
