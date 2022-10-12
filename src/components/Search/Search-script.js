const handleSuggestions = async ({ handleSetState, searchContext, value }) => {
  let newSearch = [];
  let oldSearch = [];
  value = value.trim().toLowerCase();

  if (!value) {
    handleSetState({ value: "", suggestions: null });
    newSearch = [];
    oldSearch = [];
    return;
  }

  Object.keys(searchContext).forEach(async (chain) => {
    const search = new Promise((resolve) => {
      const result = searchContext[chain].filter(
        (el) =>
          el.name?.toLowerCase().includes(value) ||
          el.description?.toLowerCase().includes(value) ||
          el.owner?.toLowerCase().includes(value) ||
          el.contractAddress?.toLowerCase().includes(value) ||
          el.collection_contract?.toLowerCase().includes(value)
      );
      resolve(result);
    });
    newSearch = await search;
    handleSetState({ suggestions: [...oldSearch, ...newSearch] });
    oldSearch = [...oldSearch, ...newSearch];
  });
};
export default handleSuggestions;
