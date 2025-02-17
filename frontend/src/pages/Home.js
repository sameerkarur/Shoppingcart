import React from 'react';
import { Container, Typography, Grid, Button, Card, CardContent, CardMedia } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  hero: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: theme.spacing(3),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

const categories = [
  {
    title: 'Fresh Fruits',
    description: 'Fresh and organic fruits from local farms',
    image: '/images/fruits.jpg',
    link: '/products?category=1',
  },
  {
    title: 'Healthy Grains',
    description: 'Nutritious grains and cereals for your daily needs',
    image: '/images/grains.jpg',
    link: '/products?category=2',
  },
  {
    title: 'Personal Care',
    description: 'High-quality personal care products',
    image: '/images/personal-care.jpg',
    link: '/products?category=3',
  },
];

function Home() {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <main>
      <div className={classes.hero}>
        <Container maxWidth="sm" className={classes.heroContent}>
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Welcome to E-Shop
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Discover amazing products at great prices. Shop with confidence and enjoy our fast delivery service.
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button variant="contained" color="primary" onClick={() => navigate('/products')}>
                  Shop Now
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary" onClick={() => navigate('/register')}>
                  Join Us
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>

      <Container className={classes.cardGrid} maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Shop by Category
        </Typography>
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item key={category.title} xs={12} sm={6} md={4}>
              <Card className={classes.card} onClick={() => navigate(category.link)}>
                <CardMedia
                  className={classes.cardMedia}
                  image={category.image}
                  title={category.title}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {category.title}
                  </Typography>
                  <Typography>
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}

export default Home;
