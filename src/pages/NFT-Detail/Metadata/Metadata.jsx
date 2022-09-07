import classes from "./Metadata.module.css";
import { CopyBlock, dracula } from "react-code-blocks";
import { ReactComponent as MetadataIcon } from "../../../assets/icon-metadata.svg";

const Metadata = ({ nftDetails: properties }) => {
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
        />
      </div>
    </div>
  );
};

export default Metadata;
