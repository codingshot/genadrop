import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import NftCard from "../Marketplace/NftCard/NftCard";
import classes from "./similarNFTs.module.css";
import GenadropCarouselScreen from "../Genadrop-Carousel-Screen/GenadropCarouselScreen";

const SimilarNFTs = (data) => {
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts } = useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

  const cardRef = useRef(null);

  const [state, setState] = useState({
    nfts: [],
  });

  const { nfts } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  useEffect(() => {
    const chain = data.data.chain;

    if (["137", "80001"].includes(chain)) {
      console.log("CHAIN: ", chain);
      handleSetState({ nfts: singlePolygonNfts });
      // similarity();
    } else if (["1313161554", "1313161555"].includes(chain)) {
      console.log("CHAIN: ", chain);
      handleSetState({ nfts: singleAuroraNfts });
      similarity(singleAuroraNfts);
    } else {
      similarity(singleAlgoNftsArr);
    }

    // similarity();
  }, []);

  const similarity = (x) => {
    const s1 = data.data.description;
    let current_traits = [];

    data.data.properties.forEach((trait) => {
      current_traits.push(trait.trait_type);
    });

    let nftsx = x;

    nftsx?.forEach((e) => {
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

      e.properties?.forEach((trait) => {
        nft_traits.push(trait.trait_type);
      });
      nft_traits = nft_traits.filter((p) => current_traits.includes(p));
      e["similarity"] += nft_traits.length / current_traits.length;
    });

    // sort nfts by similarity
    nftsx.sort(compare);
    nftsx.reverse();
    nftsx.shift();
    handleSetState({ nfts: nftsx });
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

  function compare(a, b) {
    if (a.similarity < b.similarity) {
      return -1;
    }
    if (a.similarity > b.similarity) {
      return 1;
    }
    return 0;
  }

  return (
    <div className={classes.container}>
      <GenadropCarouselScreen cardWidth={16 * 20} gap={16}>
        {nfts?.map((nft, id) => (
          <div key={id} ref={cardRef} className={classes.card}>
            <NftCard useWidth="20em" key={nft.Id} nft={nft} listed extend="/1of1" />
          </div>
        ))}
      </GenadropCarouselScreen>
    </div>
  );
};

export default SimilarNFTs;
