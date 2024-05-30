import { Input, Table } from 'antd';
import React from 'react';

class SearchableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            filteredData: props.data,
        };
    }

    handleSearch = (value) => {
        const searchQuery = value.toLowerCase();
        const filtered = this.props.data.filter((record) => {
            return Object.values(record).some((field) =>
                field.toString().toLowerCase().includes(searchQuery)
            );
        });
        this.setState({ filteredData: filtered });
    };

    render() {
        return (
            <>
                <Input.Search
                    placeholder="Tìm kiếm"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={this.handleSearch}
                    style={{ marginBottom: 16 }}
                />
                <Table
                    columns={this.props.columns}
                    dataSource={this.state.filteredData}
                    {...this.props.tableProps}
                />
            </>
        );
    }
}

export default SearchableTable;
