import * as React from "react";

import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  card: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 100,
    minWidth: 275,
    minHeight: 200
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  image: {
    width: "100%"
  },
  button: {
    margin: theme.spacing.unit,
    marginLeft: 20
  }
});

function Share(props) {
  const { classes, loading, link, image, callback } = props;

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          {loading ? <CircularProgress className={classes.progress} /> : null}
          {link ? <h2>Use this link to share the image:</h2> : null}
          {link ? <a href={link}>{link}</a> : null}
          {image ? <img src={image} className={classes.image} /> : null}
          {image || link ? (
            <p>
              This image is client-side encrypted by the sender, stored
              encrypted on IPFS, and client-side decrypted in the browser using
              a special decryption key in the url.
            </p>
          ) : null}
        </CardContent>
      </Card>
      {!loading ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={callback}
          className={classes.button}
        >
          Share Something Else
        </Button>
      ) : null}
    </div>
  );
}

export default withStyles(styles)(Share);
