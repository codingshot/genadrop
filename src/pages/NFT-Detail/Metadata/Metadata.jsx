import classes from "./Metadata.module.css";
import { CopyBlock, dracula } from "react-code-blocks";

const Metadata = ({ nftDetails: properties }) => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>Metadata</div>
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
