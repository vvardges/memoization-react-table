import React from "react";
import { render } from "react-dom";
import { makeData, newPerson } from "./Utils";

// Import React Table
import ReactTable from "react-table";

// change styles in this file
import "./index.css";

const requestData = () => {
  return new Promise((resolve, reject) => {
    resolve(newPerson(Math.floor(Math.random()*2000)));
  });
};

class App extends React.Component {
  constructor() {
    super();

    //get initial data from serve
    const serverData = makeData();
    const mapData = new Map();
    for(let d of serverData){
      mapData.set(d.id, d);
    }

    this.state = {
      data: mapData,
      fetchCounter: 0
    };
  }

  componentDidMount() {
    // Request data every <INTERVAL> milliseconds
    this.interval = setInterval(() => {
      // Change requestData to your function that requests data from the server
      requestData().then(newData => {
        const newMappedData = this.state.data;
        newMappedData.set(newData.id, newData);

        this.setState({
          data: newMappedData
        });
      });
    }, 200);
  }

  componentWillUnmount() {
    // Make sure to clear interval when unmounting
    clearInterval(this.interval);
  }

  handleEdit(rowData) {
    console.log(rowData);
  };

  handleDelete(rowData) {
    console.log(rowData);
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <ReactTable
          data={Array.from(data.values())}
          columns={[
            {
              Header: "Actions",
              columns: [{
                header: '',
                Cell: row => (
                    <div>
                      <button onClick={() => this.handleEdit(row.original)}>Edit</button>
                      <button onClick={() => this.handleDelete(row.original)}>Delete</button>
                    </div>
                )
              }]
            },
            {
              Header: "Name",
              columns: [
                {
                  Header: "Updated",
                  accessor: "modified"
                },
                {
                  Header: "ID",
                  accessor: "id"
                },
                {
                  Header: "First Name",
                  accessor: "firstName"
                },
                {
                  Header: "Last Name",
                  id: "lastName",
                  accessor: d => d.lastName
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Age",
                  accessor: "age"
                },
                {
                  Header: "Status",
                  accessor: "status"
                }
              ]
            },
            {
              Header: "Stats",
              columns: [
                {
                  Header: "Visits",
                  accessor: "visits"
                }
              ]
            }
          ]}
          defaultPageSize={10}
          filterable={true}
          className="-striped -highlight"
          sorted={[
            {
              id: 'modified',
              desc: true
            }
          ]}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
