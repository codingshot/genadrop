import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import NftCard from "../Marketplace/NftCard/NftCard";
import classes from "./similarNFTs.module.css";
import GenadropCarousel from "../../components/Genadrop-Carousel/GenadropCarousel";

const SimilarNFTs = (data) => {
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts } = useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

  const cardRef = useRef(null);

  const [state, setState] = useState({
    cardWidth: 0,
    chain: null,
  });

  const { cardWidth, chain } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  useEffect(() => {
    console.log("CHAIN", data);
    const cardWidth = cardRef.current && cardRef.current.getBoundingClientRect().width;
    const chain = data.data.chain;
    handleSetState({ cardWidth, chain });

    similarity();
  }, []);

  const similarity = () => {
    let nfts = singleAlgoNftsArr;
    const s1 = data.data.description;
    let current_traits = [];
    data.data.properties.forEach((trait) => {
      current_traits.push(trait.trait_type);
    });

    nfts.forEach((e) => {
      // description similarity
      var longer = s1;
      var shorter = e.description;
      var s2 = e.description;

      if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
      }
      var longerLength = longer.length;
      if (longerLength == 0) {
        e["similarity"] = 1.0;
      } else {
        e["similarity"] = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
      }
      // properties similarity
      let nft_traits = [];
      e.properties.forEach((trait) => {
        nft_traits.push(trait.trait_type);
      });
      nft_traits = nft_traits.filter((p) => current_traits.includes(p));
    });

    console.log("WITH SIM: ", nfts, data);
  };

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0) costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  return (
    <div className={classes.container}>
      <GenadropCarousel cardWidth={cardWidth} gap={16}>
        {["137", "80001"].includes(chain)
          ? singlePolygonNfts.map((nft, id) => (
              <div key={id} ref={cardRef} className={classes.card}>
                <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
              </div>
            ))
          : ["1313161554", "1313161555"].includes(chain)
          ? singlePolygonNfts.map((nft, id) => (
              <div key={id} ref={cardRef} className={classes.card}>
                <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
              </div>
            ))
          : singleAlgoNftsArr.map((nft, id) => (
              <div key={id} ref={cardRef} className={classes.card}>
                <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
              </div>
            ))}
      </GenadropCarousel>
    </div>
  );
};

export default SimilarNFTs;
