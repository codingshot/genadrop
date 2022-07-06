import { useContext } from "react";
import { useState } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import classes from "./Sidebar.module.css";

const Sidebar = () => {
  const { collectionName } = useContext(GenContext);

  const [state, setState] = useState({
    isSidebar: false,
    isEdit: false,
    nValue: collectionName,
  });

  const { isSidebar, isEdit, nValue } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleSidebar = () => {
    handleSetState({ isSidebar: !isSidebar });
  };

  const handleSave = () => {
    console.log(isEdit);
    // handleSetState({ isEdit: !isEdit });
  };

  return (
    <div className={`${classes.container} ${isSidebar && classes.active}`}>
      <div onClick={handleSidebar} className={classes.toggleBtn}></div>
      <div className={classes.downloadMintBtn}>Download & Mint</div>
      <div className={classes.nameContainer}>
        <div className={classes.name}>Collection Name</div>
        <form onSubmit={handleSave} className={classes.inputContainer}>
          <input disabled={!isEdit} type="text" onChange={(nValue) => handleSetState({ nValue })} value={nValue} />
          <button type="submit">{isEdit ? "S" : "E"}</button>
        </form>
      </div>
      <div className={classes.descriptionContainer}>
        <div className={classes.descriptionWrapper}>
          <div className={classes.name}>Collection Description</div>
          <div className={classes.toggle}>tog</div>
        </div>
        <textarea type="text" />
      </div>
      <div className={classes.formatContainer}>
        <div className={classes.name}>Use Format</div>
        <div className={classes.selectWrapper}>
          {/* <select onChange={()=>{}} value={""}>
            <option value="ipfs">IPFS</option>
            <option value="arweave">Arweave</option>
          </select> */}
        </div>
      </div>
      <div className={classes.btnContainer}>
        <div className={classes.gifBtn}>Generate Gif</div>
        <div className={classes.downloadBtn}>Download Zip {`"(${123})"`}</div>
      </div>
    </div>
  );
};

export default Sidebar;
