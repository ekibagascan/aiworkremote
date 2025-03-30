import React from "react";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

const Logo = styled("img")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    height: 15,
  },
}));

const Header = () => {
  return (
    <div>
      <Grid item sx={{ margin: "20px auto 10px", textAlign: "center" }}>
        <Link to="/">
          <Logo alt="remotenft" src="/images/remoteailogo.svg" height={50} />
        </Link>
      </Grid>
    </div>
  );
};

export default Header;
