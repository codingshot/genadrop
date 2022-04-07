import React from "react";
import classes from "./docsEmbed.module.css";

const DocsEmbed = () => (
  <>
    <iframe className={classes.docs} src="https://doc.clickup.com/4659940/d/4e6q4-2087/gena-drop-docs" title="docs" />
    <script async src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js" />
  </>
);

export default DocsEmbed;
