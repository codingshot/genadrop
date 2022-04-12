import classes from "./Docs.module.css";
import booksImage from "../../../assets/books.svg";
import linkIcon from "../../../assets/icon-link2.svg";

const Docs = () => {
  return (
    <div className={classes.container}>
      <img src={booksImage} alt="" />
      <p>
        Not sure yet how <br /> to <span>use GenaDrop</span>?
      </p>
      <a href="https://doc.clickup.com/4659940/d/4e6q4-2087/gena-drop-docs">
        <button>
          <img src={linkIcon} alt="" /> <span>Read the Docs</span>
        </button>
      </a>
    </div>
  );
};

export default Docs;
