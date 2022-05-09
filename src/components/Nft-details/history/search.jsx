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

    const searchString = this.state.search.trim().toLowerCase();

    if (searchString.length > 0) {
      records = records.filter((e) => e.type.toLowerCase().match(searchString));
    }

    return (
      <div>
        <UserInput update={(e) => this.handleChange(e)} />
        {records.length >= 1 ? (
          <Table data={records} />
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
