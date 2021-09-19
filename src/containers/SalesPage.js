import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Papa from 'papaparse';
import ReactFilterBox, { SimpleResultProcessing } from 'react-filter-box';
import Dimensions from 'react-dimensions';
import 'react-filter-box/lib/react-filter-box.css';
import '../styles/styles.css';

import Table from '../components/Table';

function SalesPage(props) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(props);
  const [containerHeight, setContainerHeight] = useState(props);

  useEffect(() => {
    const { containerWidth, containerHeight } = props;
    setContainerWidth(containerWidth);
    setContainerHeight(containerHeight);
  }, [props]);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // on clicking upload button after selecting csv file
  const onFileUpload = () => {
    Papa.parse(selectedFile, {
      header: true,
      complete: getCsvData,
    });
  };

  // after uploaded csv file is parsed in json
  const getCsvData = (result) => {
    const { data } = result;
    const { fields } = result.meta;

    const filterOptions = fields.map(function (fieldName) {
      return {
        columnField: fieldName,
        type: 'text',
      };
    });

    setOptions(filterOptions);
    setData(data);
    setFilteredData(data);
    setColumns([...fields]);
    setIsFileUploaded(true);
  };

  // on applying filter
  const onParseOk = (expressions) => {
    const newData = new SimpleResultProcessing(options).process(
      data,
      expressions
    );

    setFilteredData(newData);
  };

  // on clicking download button, filtered data is downloaded as csv
  const onDownload = () => {
    try {
      const csv = Papa.unparse(filteredData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const { name } = selectedFile;
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
  };

  return (
    <div className="container">
      <h4>Upload CSV file</h4>
      <div>
        <input type="file" accept=".csv" onChange={onFileChange} />
        <button className="btn" disabled={!selectedFile} onClick={onFileUpload}>
          Upload
        </button>
      </div>

      {isFileUploaded && (
        <div>
          <h4>Filter CSV data</h4>
          <ReactFilterBox
            data={filteredData}
            options={options}
            onParseOk={onParseOk}
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
          <button className="btn" onClick={onDownload}>
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default withRouter(
  Dimensions({
    getHeight: function (element) {
      return window.innerHeight - 320;
    },
    getWidth: function (element) {
      const widthOffset = window.innerWidth < 680 ? 0 : 240;
      return window.innerWidth - widthOffset;
    },
  })(SalesPage)
);
