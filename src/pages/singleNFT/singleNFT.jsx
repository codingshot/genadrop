import { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom"
import { GenContext } from "../../gen-state/gen.context";
import { getSingleNftDetails } from "../../utils";

const SingleNFT = () => {

  const { params: { nftId } } = useRouteMatch();
  const { singleNfts } = useContext(GenContext);
  const [state, setState] = useState({
    nftDetails: null
  });
  const { nftDetails } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }));
  }

  useEffect(() => {
    const nft = singleNfts.filter(nft => String(nft.id) === nftId)[0];
    (async function getNftDetails() {
      let nftDetails = await getSingleNftDetails(nft);
      handleSetState({ nftDetails })
    }());
  }, []);

  useEffect(()=> {
    if(!nftDetails) return;
    console.log(nftDetails);
  },[nftDetails])

  return (
    <div>
      single nft page
      {/* single nft details goes here */}
    </div>
  )
}

export default SingleNFT