import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Divider,
} from '@material-ui/core';
import { Add, Remove, Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  cartItem: {
    marginBottom: theme.spacing(2),
  },
  itemContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(0, 1),
    },
  },
  summary: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
  },
  checkoutButton: {
    marginTop: theme.spacing(2),
  },
}));

function Cart() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container className={classes.root}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card key={item.id} className={classes.cartItem}>
              <CardContent className={classes.itemContent}>
                <div>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography color="textSecondary">
                    ${item.price.toFixed(2)}
                  </Typography>
                </div>

                <div className={classes.quantityControls}>
                  <IconButton
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className={classes.summary}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>Subtotal</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="right">${subtotal.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Shipping</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="right">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Total</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                    ${total.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.checkoutButton}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Cart;
