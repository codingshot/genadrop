import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./Explore.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import Filter from "./Filter/Filter";
import Header from "./Header/Header";
import { groupAttributesByTraitType, mapAttributeToFilter } from "./Explore-script";
import { getGraphCollection, getNftCollection } from "../../utils";
import Menu from "./Menu/Menu";
import closeIcon from "../../assets/icon-close.svg";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import { createClient } from "urql";
import { GET_ALL_AURORA_COLLECTIONS, GET_GRAPH_COLLECTION } from "../../graphql/querries/getCollections";

const Explore = () => {
  const APIURL = "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet";

  const client = createClient({
    url: APIURL,
  });

  const [state, setState] = useState({
    togglePriceFilter: false,
    NFTCollection: null,
    FilteredCollection: null,
    loadedChain: null,
    collection: null,
    attributes: null,
    filterToDelete: null,
    headerHeight: 0,
    filter: {
      searchValue: "",
      price: "high",
    },
  });
  const {
    collection,
    NFTCollection,
    attributes,
    filter,
    filterToDelete,
    FilteredCollection,
    headerHeight,
    loadedChain,
  } = state;
  const { collections, mainnet } = useContext(GenContext);

  const { collectionName } = useParams();

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleFilter = (_filter) => {
    handleSetState({ filter: { ...filter, ..._filter } });
  };

  const getHeight = (res) => {
    handleSetState({ headerHeight: res });
  };

  useEffect(() => {
    if (Object.keys(collections).length) {
      const collectionsFound = collections.find((col) => col.name === collectionName);
      if (collectionsFound) {
        (async function getResult() {
          const result = await getNftCollection(collectionsFound, mainnet);
          handleSetState({
            collection: collectionsFound,
            NFTCollection: result,
          });
        })();
      } else {
        (async function getGraphResult() {
          const data = await client.query(GET_GRAPH_COLLECTION, { id: collectionName }).toPromise();
          console.log(data.data);
          const result = await getGraphCollection(data.data.collection.nfts, data.data.collection);
          handleSetState({
            collection: {
              ...data?.data?.collection,
              owner: data?.data?.collection?.id,
              price: result[0].collectionPrice,
            },
            NFTCollection: result,
            loadedChain: result[0].chain,
          });
        })();
      }
    }
  }, []);

  useEffect(() => {
    if (!NFTCollection) return;
    handleSetState({
      attributes: mapAttributeToFilter(NFTCollection),
      FilteredCollection: NFTCollection,
    });
  }, [NFTCollection]);

  useEffect(() => {
    if (!NFTCollection) return;
    const filtered = NFTCollection.filter((col) => col.name.toLowerCase().includes(filter.searchValue.toLowerCase()));
    handleSetState({ FilteredCollection: filtered });
  }, [filter.searchValue]);

  useEffect(() => {
    if (!NFTCollection) return;
    let filtered = null;
    if (filter.price === "low") {
      filtered = NFTCollection.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      filtered = NFTCollection.sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ FilteredCollection: filtered });
  }, [filter.price]);

  useEffect(() => {
    if (!NFTCollection) return;
    const filtered = NFTCollection.filter(
      (col) => Number(col.price) >= Number(filter.priceRange.min) && Number(col.price) <= Number(filter.priceRange.max)
    );
    handleSetState({ FilteredCollection: filtered });
  }, [filter.priceRange]);

  useEffect(() => {
    if (!NFTCollection) return;
    const groupedAttributes = groupAttributesByTraitType(filter.attributes);
    const filtered = NFTCollection.filter((col) =>
      Object.keys(groupedAttributes).every((attributeKey) =>
        groupedAttributes[attributeKey].some((el) =>
          JSON.stringify(col.ipfs_data.properties).includes(JSON.stringify(el))
        )
      )
    );
    handleSetState({ FilteredCollection: filtered });
    document.documentElement.scrollTop = headerHeight;
  }, [filter.attributes]);

  return (
    <div className={classes.container}>
      <Header
        getHeight={getHeight}
        collection={{
          ...collection,
          numberOfNfts: NFTCollection && NFTCollection.length,
          imageUrl: NFTCollection && NFTCollection[Math.floor(Math.random() * NFTCollection.length)].image_url,
        }}
        loadedChain={loadedChain}
      />

      <div className={classes.displayContainer}>
        <Filter handleFilter={handleFilter} filterToDelete={filterToDelete} attributes={attributes} />
        <main className={classes.displayWrapper}>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={(value) => handleSetState({ filter: { ...filter, searchValue: value } })} />
            <PriceDropdown onPriceFilter={(value) => handleSetState({ filter: { ...filter, price: value } })} />
          </div>

          <div className={classes.filterDisplay}>
            {filter?.attributes &&
              filter.attributes.map((f, idx) => (
                <div key={idx} className={classes.filteredItem}>
                  <span>{`${f.trait_type}: ${f.value}`}</span>
                  <div onClick={() => handleSetState({ filterToDelete: f })} className={classes.closeIcon}>
                    <img src={closeIcon} alt="" />
                  </div>
                </div>
              ))}
            {filter?.attributes && filter.attributes.length ? (
              <div onClick={() => handleSetState({ filterToDelete: [] })} className={classes.clearFilter}>
                clear all
              </div>
            ) : null}
          </div>
          <Menu NFTCollection={FilteredCollection} loadedChain={loadedChain} />
        </main>
      </div>
    </div>
  );
};

export default Explore;
