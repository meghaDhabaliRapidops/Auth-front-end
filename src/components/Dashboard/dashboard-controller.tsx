import { useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import axios from "axios";

function useConnect() {
  const gridRef = useRef<AgGridReact>(null);

  const containerStyle = useMemo(
    () => ({ width: "100%", height: "550px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState(null);
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

  useQuery("studentData", () =>
    axios
      .get(`http://localhost:4000/api/students`, { withCredentials: true })
      .then((result) => {
        setRowData(result.data);
      })
      .catch((error) => {
        alert("You are not authorized. Please login");
        navigate("/login");
        console.log(error);
      })
  );

//   const { refetch } =  useQuery("logoutUser", () =>
//   axios
//   .get(`http://localhost:4000/api/logout`, { withCredentials: true })
//   .then((result) => {
//     window.localStorage.setItem("logged_out", "yes");
//     navigate("/login");
//   })
//   .catch((error) => {
//     console.log(error);
//     navigate("/login");
//   }),

// );

  // if (isLoading) return 'Loading...'

  // if (error) return 'An error has occurred: ' + error.message

  //   const getGridData = () => {
  //     axios
  //       .get(`http://localhost:4000/api/students`, { withCredentials: true })
  //       .then((result) => {
  //         setRowData(result.data);
  //       })
  //       .catch((error) => {
  //         alert("You are not authorized. Please login");
  //         navigate("/login");
  //         console.log(error);
  //       });
  //   };
  const logout = () => {
    axios
      .get(`http://localhost:4000/api/logout`, { withCredentials: true })
      .then((result) => {
        window.localStorage.setItem("logged_out", "yes");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        navigate("/login");
      });
  };
  return {
    gridRef,
    containerStyle,
    gridStyle,
    rowData,
    gridConfig,
    //getGridData,
    logout,
  };
}

export default useConnect;
