import React from 'react'
import {
  Grid,
  Grow,
  Container,
  Paper,
  ImageListItem,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'

const MyPaper = styled(Paper)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: 2,
    margin: '30px auto',
  },
}))
const MyImage = styled(ImageListItem)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100px',
    margin: '15px auto',
  },
}))
const Title = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
}))
const Subtitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  },
}))
const Back = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.7rem',
  },
}))

const PostJobDone = () => {
  return (
    <Grow in>
      <Container maxWidth='lg'>
        <Grid
          container
          justifyContent='space-between'
          aligntitems='center'
          spacing={0}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MyPaper
              elevation={2}
              sx={{ padding: 4, margin: '60px 200px 0px' }}
            >
              <MyImage sx={{ width: '200px', margin: '20px auto' }}>
                <img
                  alt='successfull'
                  src='/images/checklist.svg'
                  loading='lazy'
                />
              </MyImage>
              <Title variant='h4'>All done!</Title>
              <Subtitle variant='body1'>
                We will review your post and post it fastly🧐
              </Subtitle>
              <Link to={`/`}>
                <Back variant='body1' sx={{ marginBottom: '30px' }}>
                  Go Home
                </Back>
              </Link>
            </MyPaper>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  )
}

export default PostJobDone
