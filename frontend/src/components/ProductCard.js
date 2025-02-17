import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useCart } from '../context/CartContext';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  content: {
    flexGrow: 1,
  },
  price: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
}));

function ProductCard({ product }) {
  const classes = useStyles();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.serial_number,
      name: product.item_name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={product.image_url || '/placeholder.jpg'}
        title={product.item_name}
      />
      <CardContent className={classes.content}>
        <Typography gutterBottom variant="h5" component="h2">
          {product.item_name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.description || 'No description available'}
        </Typography>
        <Typography variant="h6" className={classes.price}>
          ${product.price}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {product.units} units available
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button size="small" color="primary">
          View Details
        </Button>
        <IconButton 
          aria-label="Add to Cart"
          onClick={handleAddToCart}
          color="primary"
        >
          <AddShoppingCart />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
