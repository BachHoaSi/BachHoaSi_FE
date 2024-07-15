import React, { useState } from 'react';
import { Input, Select, Space, Row, Col } from 'antd';
import PropTypes from 'prop-types';

const SearchBar = ({ fields, onSubmit, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState(null);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFieldChange = (value) => {
    setSelectedField(value);
  };

  const handleSearchSubmit = () => {
    if (selectedField) { 
      const queryParams = `${encodeURIComponent(selectedField)}=${encodeURIComponent(searchTerm)}`;
      onSubmit(queryParams);
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Select
            value={selectedField}
            onChange={handleFieldChange}
            style={{ width: '100%' }}
          >
            <Select.Option value={null}>Select a Field</Select.Option> 
            {fields.map((field, index) => ( // Using index as key
              <Select.Option key={index} value={field}>{field.toUpperCase()}</Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={16}>
          {selectedField !== null && ( 
            <Input.Search
              placeholder={placeholder ? placeholder : 'Search...'}
              value={searchTerm}
              onChange={handleInputChange}
              onSearch={handleSearchSubmit}
              enterButton
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

SearchBar.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;