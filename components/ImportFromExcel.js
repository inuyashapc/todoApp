import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { read, utils } from "xlsx";

export default function ImportFromExcel() {
  const router = useRouter();

  const [movies, setMovies] = useState([]);
  const handleImport = ($event) => {
    const files = $event.target.files;
    console.log("🚀 ========= files:", files);
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        console.log("🚀 ========= sheets:", sheets);

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          console.log("🚀 ========= rows:", rows);
          localStorage.setItem("todoApp", JSON.stringify(rows));
          setMovies(rows);
        }
      };
      reader.readAsArrayBuffer(file);
      router.refresh();
    }
  };
  return (
    <>
      <div>
        <input
          type="file"
          name="file"
          className="custom-file-input"
          id="inputGroupFile"
          required
          onChange={handleImport}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
        <label
          className="custom-file-label"
          style={{ cursor: "pointer" }}
          htmlFor="inputGroupFile"
        >
          <div className="flex gap-2 bg-green-500 p-2 items-center rounded-xl">
            <FontAwesomeIcon icon={faUpload} />
            Import data by excel
          </div>
        </label>
      </div>
      {/* <div className="row">
        <div className="col-sm-6 offset-3">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Data</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {movies.length ? (
                movies.map((movie, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{movie.data}</td>
                    <td>{movie.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Movies Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </>
  );
}
