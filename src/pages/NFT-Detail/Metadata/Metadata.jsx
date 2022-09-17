import React, { CopyBlock, dracula } from "react-code-blocks";
import { useContext } from "react";
import classes from "./Metadata.module.css";
import { ReactComponent as MetadataIcon } from "../../../assets/icon-metadata.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { setNotification } from "../../../gen-state/gen.actions";

const Metadata = ({ nftDetails: properties }) => {
  const { dispatch } = useContext(GenContext);
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <MetadataIcon />
        <div>Metadata</div>
      </div>
      <div className={classes.content}>
        <CopyBlock
          language="json"
          text={JSON.stringify(properties, null, 2)}
          showLineNumbers={false}
          theme={dracula}
          wrapLines
          codeBlock
          onCopy={() => {
            dispatch(setNotification({ message: "Metadata copied", type: "success" }));
          }}
        />
      </div>
    </div>
  );
};

export default Metadata;
