import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import { useGetUniqueKey } from "react-generate-unique-key-for-map";
import "./dataDisplay.css";

const DataDisplay: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const [tableData, setTableData] = useState([]); 
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [popupData, setPopupData] = useState({
    InstanceId: "",
    ConsumedQuantity: "",
    Cost: "",
    MeterCategory: "",
    ServiceName: "",
    ResourceGroup: "",
    ResourceLocation: "",
    Date: "",
  });
  const itemsPerPage = 10;
  const getUniqueKey = useGetUniqueKey();

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const responseData = await fetchData();
        setData(responseData);
        setTableData(responseData)
      } catch (error) {
        // Handle error
      }
    };

    fetchDataFromApi();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };
  const filteredData = tableData.filter((item: any) => {
    const searchRegex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive search
  
    // Modify the conditions based on your desired search criteria
    return (
      searchRegex.test(item.Date) ||
      searchRegex.test(item.ConsumedQuantity) ||
      searchRegex.test(item.Cost) ||
      searchRegex.test(item.ResourceGroup) ||
      searchRegex.test(item.ResourceLocation) ||
      searchRegex.test(item.ServiceName)
    );
  });
  console.log(filteredData)
  function handleClick(data: any) {
    setPopupData(data);
    setShowPopup(true);
  }
  function handleClose() {
    setShowPopup(false);
  }

  function Popup() {
    return (
      <div className="popup">
        <div className="popup-content">
          <h2>Details of selected item</h2>
          <table>
            <tbody>
              <tr>
                <th>InstanceId</th>
                <td>{popupData.InstanceId}</td>
              </tr>
              <tr>
                <th>ConsumedQuantity</th>
                <td>{popupData.ConsumedQuantity}</td>
              </tr>
              <tr>
                <th>Cost</th>
                <td>{popupData.Cost}</td>
              </tr>
              <tr>
                <th>MeterCategory</th>
                <td>{popupData.MeterCategory}</td>
              </tr>
              <tr>
                <th>ServiceName</th>
                <td>{popupData.ServiceName}</td>
              </tr>
              <tr>
                <th>ResourceGroup</th>
                <td>{popupData.ResourceGroup}</td>
              </tr>
              <tr>
                <th>ResourceLocation</th>
                <td>{popupData.ResourceLocation}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{popupData.Date}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={() => setShowPopup(false)}>close</button>
        </div>
      </div>
    );
  }
  const sortTable = (column) => {
    // Toggle sort order if the same column is clicked
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }

    // Sort the table data based on the selected column and sort order
    const sortedData = [...tableData].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[column] - b[column];
      } else {
        return b[column] - a[column];
      }
    });

    setTableData(sortedData);
    setData(sortedData)
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
        <p>ELANCO</p>
       

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by ServiceName | Date | ConsumedQuantity | Cost | ResourceGroup | ResourceLocation . "
      />
     
      {filteredData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th onClick={() => sortTable('Date')}>Date</th>
              <th onClick={() => sortTable('ConsumedQuantity')}>ConsumedQuantity</th>
              <th onClick={() => sortTable('Cost')}>Cost</th>
              <th onClick={() => sortTable('ResourceGroup')}>ResourceGroup</th>
              <th onClick={() => sortTable('ResourceLocation')}>ResourceLocation</th>
              <th onClick={() => sortTable('ServiceName')}>ServiceName</th>
              <th>View</th>
              {/* Add more table headings as per your data requirement */}
            </tr>
          </thead>
          <tbody>
            {paginatedData       
            .map((item: any, i: number) => (
              <tr key={getUniqueKey(item)} className="border">
                <td>{item.Date}</td>
                <td>{item.ConsumedQuantity}</td>
                <td>{item.Cost}</td>
                <td>{item.ResourceGroup}</td>
                <td>{item.ResourceLocation}</td>
                <td>{item.ServiceName}</td>
                <td>
                  <button onClick={() => handleClick(item)}>Show more</button>
                </td>
                {/* Add more table cells as per your data requirement */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (

        filteredData.length===0 ? <p>No Data Found </p>:
        <p>Loading data...</p>
      )}

      {data.length > itemsPerPage && (
        <div>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span>{currentPage}</span>
          <button
            disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
      {showPopup && <Popup />}
    </div>
  );
};

export default DataDisplay;
