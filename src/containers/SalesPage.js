import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Papa from 'papaparse';
import ReactFilterBox, { SimpleResultProcessing } from 'react-filter-box';
import Dimensions from 'react-dimensions';
import 'react-filter-box/lib/react-filter-box.css';
import './styles.css';

import Table from '../components/Table';

class SalesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      filteredData: [],
      columns: [],
      selectedFile: null,
      isFileUploaded: false,
    };

    this.optionsx = [];
    this.getCsvData = this.getCsvData.bind(this);
    this.onDownload = this.onDownload.bind(this);
  }

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  onFileUpload = () => {
    const { selectedFile } = this.state;
    Papa.parse(selectedFile, {
      header: true,
      complete: this.getCsvData,
    });
  };

  getCsvData(result) {
    const { data } = result;
    const { fields } = result.meta;

    this.options = fields.map(function (fieldName) {
      return {
        columnField: fieldName,
        type: 'text',
      };
    });

    this.setState({
      data: data,
      filteredData: data,
      columns: [...fields],
      isFileUploaded: true,
    });
  }

  onParseOk(expressions) {
    var newData = new SimpleResultProcessing(this.options).process(
      this.state.data,
      expressions
    );
    this.setState({
      filteredData: newData,
    });
  }

  onDownload() {
    var csv = Papa.unparse(this.state.filteredData);
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      this.state.selectedFile.name + ' - Filtered.csv'
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render() {
    const { filteredData, isFileUploaded, selectedFile, columns } = this.state;
    const { containerWidth, containerHeight } = this.props;

    return (
      <div className="container">
        <h4>Upload CSV file</h4>
        <div>
          <input type="file" accept=".csv" onChange={this.onFileChange} />
          <button
            className="btn"
            disabled={!selectedFile}
            onClick={this.onFileUpload}
          >
            Upload
          </button>
        </div>

        {isFileUploaded && (
          <div>
            <h4>Filter CSV data</h4>
            <ReactFilterBox
              data={filteredData}
              options={this.options}
              onParseOk={this.onParseOk.bind(this)}
            />

            <Table
              {...{
                rows: filteredData,
                fields: columns,
                tableWidth: containerWidth,
                tableHeight: containerHeight,
              }}
            />

            <p>No. of rows in table: {filteredData.length}</p>
            <button className="btn" onClick={this.onDownload}>
              Download CSV
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(
  Dimensions({
    getHeight: function (element) {
      return window.innerHeight - 320;
    },
    getWidth: function (element) {
      var widthOffset = window.innerWidth < 680 ? 0 : 240;
      return window.innerWidth - widthOffset;
    },
  })(SalesPage)
);
