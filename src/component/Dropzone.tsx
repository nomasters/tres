import * as React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles
} from "@material-ui/core/styles";

const maxFileSize = 25 * 1000000; // 25 MB

const styles = (theme: Theme) =>
  createStyles({
    card: {
      marginTop: 20,
      marginLeft: 20,
      marginRight: 100,
      minWidth: 275,
      minHeight: 200
    }
  });

function Dropzone(props) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 1) {
      // TODO: error message
      console.log("only a single file can be added");
      return;
    }
    const file = acceptedFiles[0];
    if (!file.type.includes("image")) {
      // TODO: error message
      console.log("only an image single file can be added");
      return;
    }
    if (file.size >= maxFileSize) {
      console.log("file too large");
      return;
    }
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        props.callback(reader.result);
      },
      false
    );
    reader.readAsDataURL(file);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const { classes } = props;

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Card className={classes.card}>
        <CardContent>
          {isDragActive ? (
            <p>Drop your image file here ...</p>
          ) : (
            <p>
              Drag and drop an image file here, or click to select an image file
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default withStyles(styles)(Dropzone);
