import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Papa from 'papaparse';
import ReactFilterBox, { SimpleResultProcessing } from 'react-filter-box';
import Dimensions from 'react-dimensions';
import 'react-filter-box/lib/react-filter-box.css';
import '../styles/styles.css';

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

  // on clicking upload button after selecting csv file
  onFileUpload = () => {
    const { selectedFile } = this.state;
    Papa.parse(selectedFile, {
      header: true,
      complete: this.getCsvData,
    });
  };

  // after uploaded csv file is parsed in json
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

  // on applying filter
  onParseOk(expressions) {
    const newData = new SimpleResultProcessing(this.options).process(
      this.state.data,
      expressions
    );
    this.setState({
      filteredData: newData,
    });
  }

  // on clicking download button, filtered data is downloaded as csv
  onDownload() {
    try {
      const csv = Papa.unparse(this.state.filteredData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const { name } = this.state.selectedFile;
      const fileName = name.split('.')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', fileName + ' - Filtered.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
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

// to make table responsive
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
