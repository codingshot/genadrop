import React from "react";
import Table from "./table";
import UserInput from "./userInput";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
  }

  handleChange(event) {
    const searchValue = event.target.value;
    this.setState({ search: searchValue });
  }

  render() {
    let records = this.props.data;
    let chain = this.props.chain;

    const searchString = this.state.search.trim().toLowerCase();

    if (searchString.length > 0) {
      records = records.filter((e) => e.type.toLowerCase().match(searchString));
    }

    return (
      <div style={{ overflow: "scroll" }}>
        <UserInput update={(e) => this.handleChange(e)} />
        {records.length >= 1 ? (
          <Table data={records} chain={chain} />
        ) : (
          <div style={{ height: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>
            No Transaction
          </div>
        )}
      </div>
    );
  }
}

export default Search;
