import React from 'react'
import { Grid, Typography, Link } from '@mui/material'
import { styled } from '@mui/material/styles'

const BannerGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {},
}))

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    fontWeight: 500,
  },
}))

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 500,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
    fontWeight: 400,
  },
}))

const Banner = () => {
  return (
    <Grid container alignitems='center' sx={{ marginTop: '30px' }}>
      <BannerGrid
        item
        xs={12}
        sx={{
          textAlign: 'center',
          padding: 10,
          color: '#fff',
          backgroundImage: 'url(/images/nftjobs.webp) ',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backgroundBlendMode: 'darken',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Title>NFT IS A NEW WAVE</Title>
        <Subtitle>Find world NFT projects that need your support.</Subtitle>
        <Link
          href='https://superrare.com/alterlier'
          target='_blank'
          rel='noreferrer'
          color='inherit'
          underline='none'
        >
          <Typography sx={{ fontSize: '0.6rem', color: '#e2e2e2' }}>
            Art by Alterlier
          </Typography>
        </Link>
      </BannerGrid>
    </Grid>
  )
}

export default Banner
