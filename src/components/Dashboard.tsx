import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  MutableRefObject
} from "react";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import axios from "axios";

function Dashboard() {
const gridRef = useRef<AgGridReact>(null);

  const containerStyle = useMemo(
    () => ({ width: "100%", height: "550px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  // const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  // const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  let checkboxSelection = function (params: any) {
    return params.columnApi.getRowGroupColumns().length === 0;
  };

  let headerCheckboxSelection = function (params: any) {
    return params.columnApi.getRowGroupColumns().length === 0;
  };

  const gridConfig = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
    },
    columnDefs: [
      {
        headerName: "Full Name",
        field: "fullName",
        checkboxSelection: checkboxSelection,
        headerCheckboxSelection: headerCheckboxSelection,
      },
      {
        headerName: "Email",
        field: "email",
      },
      // {
      //   headerName: "DOB",
      //   cellRenderer: ({ value }) => {
      //     return (
      //       <>
      //         {value === "" ? "" : new Date(value).toISOString().slice(0, 10)}
      //       </>
      //     );
      //   },
      //   field: "date",
      // },
      {
        headerName: "Gender",
        field: "gender",
        width: 150,
        suppressSizeToFit: true,
      },
      {
        headerName: "City",
        field: "city",
      },
      {
        headerName: "State",
        // cellRenderer: ({value}) => {
        //   return <>{value === "Select State" ? "" : value}</>;
        // },
        field: "state",
      },
      {
        headerName: "Zip",
        field: "zip",
        // width: 150,
        // suppressSizeToFit: true,
      },
    ],
  };

  // const onGridReady = (params: any) => {
  //   setGridApi(params.api);
  // };
  const getGridData = () => {
    axios
      .get(`http://localhost:4000/api/students`, { withCredentials: true })
      .then((result) => {
        console.log("inside getGridData function");
        console.log("result", result);
        setRowData(result.data);
      })
      .catch((error) => {
        alert("You are not authorized. Please login");
        navigate("/login");
        console.log("inside error");
        console.log(error);
      });
  };

  useEffect(() => {
    getGridData();
    //sizeToFit();
  }, []);

  const logout = () => {
    console.log("inside logout");
    axios
      .get(`http://localhost:4000/api/logout`, { withCredentials: true })
      .then((result) => {
        window.localStorage.setItem("logged_out", "yes");
        navigate("/login");
        console.log("result", result);
      })
      .catch((error) => {
        console.log(error);
        navigate("/login");
      });
  };

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <>
      <div className="topnav-right">
        <button
          color="danger"
          onClick={() => logout()}
          style={{ fontWeight: "bold", marginTop: "5px" }}
        >
          Logout
        </button>
      </div>
      <br />
      <div style={containerStyle} className="grid">
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            //onGridReady={onGridReady}
            gridOptions={gridConfig}
            rowData={rowData}
            paginationAutoPageSize={true}
            pagination={true}
            ref={gridRef}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
