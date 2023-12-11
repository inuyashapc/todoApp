import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { ExportToExcel } from "../../../components/ExportToExcel";
import axios from "axios";

export default function TodoApp2() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [listTodoApp, setListTodoApp] = useState([]);
  const [todoApp, setTodoApp] = useState({});

  useEffect(() => {
    const listTodo = JSON.parse(localStorage.getItem("todoApp"));
    if (listTodo == null) {
      localStorage.setItem("todoApp", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("todoApp");
    console.log("🚀 ========= data:", data);
    setListTodoApp(JSON.parse(localStorage.getItem("todoApp")));
  }, [todoApp]);

  const onSubmit = (data) => {
    const listTodo = JSON.parse(localStorage.getItem("todoApp"));
    localStorage.setItem(
      "todoApp",
      JSON.stringify([...listTodo, { data, date: new Date() }])
    );
    setTodoApp(listTodo);
  };

  //export excel
  const [data, setData] = React.useState([]);
  const fileName = "myfile";

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("https://jsonplaceholder.typicode.com/posts")
        .then((postData) => {
          // reshaping the array
          const customHeadings = postData.data.map((item) => ({
            "Article Id": item.id,
            "Article Title": item.title,
          }));
          console.log("🚀 ========= customHeadings:", customHeadings);

          setData(customHeadings);
        });
    };
    fetchData();
  }, []);

  const [data2, setData2] = React.useState([]);
  const fileName2 = "MyTodoApp";
  useEffect(() => {
    const data = localStorage.getItem("todoApp");
    const customHeadings = JSON.parse(data).map((item, index) => ({
      Id: index + 1,
      Data: item.data.todoApp,
      Date: dayjs(item?.date).format("DD/MM/YYYY"),
    }));
    console.log("🚀 ========= customHeadings1234:", customHeadings);
    setData2(customHeadings);
  }, []);
  return (
    <div className="bg-white pt-12 pr-0 pb-12 pl-0 mt-0 mr-auto mb-0 ml-auto sm:py-16 lg:py-20 max-w-4xl">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">
          To-Do List
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm mx-auto px-4 py-2"
      >
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            placeholder="Add a task"
            {...register("todoApp", { required: true })}
          />
          {errors.todoApp && <span>This field is required</span>}

          <button
            type="submit"
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          >
            Add
          </button>
        </div>
      </form>
      <div>
        {/* <button className="bg-green-500 p-2 rounded-xl">
          <FontAwesomeIcon icon={faDownload} />
          Export excel
        </button> */}
        <ExportToExcel
          apiData={data}
          fileName={fileName}
          className={"bg-green-500 p-2 rounded-xl"}
        />
        <ExportToExcel
          apiData={data2}
          fileName={fileName2}
          className={"bg-green-500 p-2 rounded-xl"}
        />
      </div>
      <ul className="divide-y divide-gray-200 px-4">
        {listTodoApp?.map((item, index) => (
          <li key={index} className="py-4">
            <div className="flex items-center">
              <input
                id="todo1"
                name="todo1"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="todo1" className="ml-3 block text-gray-900">
                <span className="text-lg font-medium mr-2">
                  {item?.data?.todoApp}
                </span>
                <span className="text-sm font-light text-gray-500">
                  Due on {dayjs(item?.date).format("DD/MM/YYYY")}
                </span>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
