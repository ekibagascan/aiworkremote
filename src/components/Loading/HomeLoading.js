import React from 'react'
import { Grid, Grow, Container, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

const MyBox = styled(Box)(({ theme }) => ({
  width: 806,
  height: '106px',
  [theme.breakpoints.down('sm')]: {
    width: 355,
    height: 80,
  },
  // [theme.breakpoints.down('xs')]: {
  //   width: 50,
  //   height: 20,
  // },
}))

const HomeLoading = () => {
  const categories = [0, 1, 2, 3, 4, 5, 6]
  const posts = [0, 1, 2, 3, 4]
  return (
    <Grow in>
      <Container maxWidth='xl'>
        <Grid
          container
          aligntitems='center'
          spacing={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Grid item xs={12} sx={{ marginTop: '20px', display: 'flex' }}>
            <Box
              sx={{
                margin: 'auto',
                width: '1500px',
                height: '300px',
                borderRadius: '8px',
                backgroundColor: 'rgba(236, 236, 236, 0.7)',
              }}
            />
          </Grid>

          <Grid item sx={{ marginTop: '20px' }}>
            <Box
              sx={{
                margin: 'auto',
                width: '100px',
                height: '10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(236, 236, 236, 0.7)',
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', margin: '20px auto 0px auto' }}
          >
            {categories.map((category) => (
              <Box
                key={category}
                sx={{
                  margin: 'auto 9px',
                  width: '100px',
                  height: '30px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(236, 236, 236, 0.7)',
                }}
              />
            ))}
          </Grid>

          <Grid item xs={12} sx={{ marginTop: '20px', margin: 'auto' }}>
            {posts.map((post) => (
              <Grid
                key={post}
                item
                xs={12}
                sx={{ margin: 1 }}
                alignItems='center'
              >
                <MyBox
                  sx={{
                    margin: 'auto',
                    backgroundColor: 'rgba(236, 236, 236, 0.7)',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  )
}

export default HomeLoading
