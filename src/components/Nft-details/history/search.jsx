import React from "react";
import Table from "./table";
import UserInput from "./userInput";
class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };
    }

    handleChange(event) {
        let searchValue = event.target.value;
        this.setState({ search: searchValue });
    }

    render() {

        let records = this.props.data,
            searchString = this.state.search.trim().toLowerCase();

        if (searchString.length > 0) {

            records = records.filter((e) => e.event.toLowerCase().match(searchString));
        }

        return (
            <div>
                <UserInput update={(e) => this.handleChange(e)} />
                <Table data={records} />
            </div>
        )
    }
}

export default Search;