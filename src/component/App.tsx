import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles
} from "@material-ui/core/styles";
import Grid, { GridSpacing } from "@material-ui/core/Grid";
import Dropzone from "./Dropzone";
import Share from "./Share";
import * as tres from "../tres";

const GATEWAY_URL = "https://ipfs.infura.io:5001";
const SHARE_URL = "https://ipfs.infura.io";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      justifyContent: "center",
      display: "flex"
    },
    container: {
      maxWidth: 640
    }
  });

const setInitialState = () => {
  let error, url, key, payload;
  let showDropzone = false;
  let shareLink = false;
  let askForKey = false;
  let loading = false;

  try {
    key = tres.getKey();
    payload = tres.getPayload();

    if (!key && payload) {
      askForKey = true;
    } else if (key && payload) {
      url = tres.decryptEncoded(key, payload);
      if (!url) {
        error = "invalid key/payload combination";
      }
    } else if (!key && !payload) {
      showDropzone = true;
    }
  } catch (err) {
    console.log(err);
    error = err;
  }
  return {
    url,
    key,
    showDropzone,
    shareLink,
    askForKey,
    payload,
    error,
    loading
  };
};

interface Props extends WithStyles<typeof styles> { }

class App extends React.Component<Props> {
  state = {
    url: null,
    key: null,
    showDropzone: true,
    askForKey: false,
    payload: null,
    shareLink: false,
    error: null,
    loading: false
  };
  constructor(props) {
    super(props);
    this.state = setInitialState();
  }

  dzCallback = url => {
    let shareLink, error;
    let { key, payload } = tres.genKeyEncrypt(url);
    let share = tres.genShareData(payload);
    this.setState({
      loading: true,
      showDropzone: false
    });
    tres
      .addToIPFS(share, GATEWAY_URL)
      .then(hash => {
        shareLink = tres.makeShareLink(hash, key, SHARE_URL);
        this.setState({
          showDropzone: false,
          shareLink: shareLink,
          loading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          showDropzone: false,
          loading: false,
          error: err
        });
      });
  };

  resetCallback = () => {
    this.setState({
      url: null,
      key: null,
      showDropzone: true,
      askForKey: false,
      payload: null,
      shareLink: false,
      error: null,
      loading: false
    });
  };


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container className={classes.container} spacing={24 as GridSpacing}>
          <Grid item xs>
            {this.state.showDropzone ? (
              <Dropzone callback={this.dzCallback} />
            ) : (
              <Share
                loading={this.state.loading}
                link={this.state.shareLink}
                image={this.state.url}
                callback={this.resetCallback}
              />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
