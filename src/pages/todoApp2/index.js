import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { ExportToExcel } from "../../../components/ExportToExcel";
import axios from "axios";
import ImportFromExcel from "../../../components/ImportFromExcel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import ModelHeadlessUI from "../../../components/ModelHeadlessUI";

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
    setListTodoApp(JSON.parse(localStorage.getItem("todoApp")));
  }, [todoApp]);

  const onSubmit = (data) => {
    const listTodo = JSON.parse(localStorage.getItem("todoApp"));
    console.log("🚀 ========= listTodo1234:", listTodo.length);
    localStorage.setItem(
      "todoApp",
      JSON.stringify([
        ...listTodo,
        {
          Id: listTodo.length === 0 ? 1 : listTodo[listTodo.length - 1].Id + 1,
          data: data.todoApp,
          date: new Date(),
          isUpdate: false,
        },
      ])
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
      data: item.data,
      date: item.date,
      isUpdate: item.isUpdate,
    }));
    setData2(customHeadings);
  }, [todoApp]);

  const handleDeleteTodoApp = (id) => {
    const data = localStorage.getItem("todoApp");
    const dataNew = JSON.parse(data).filter((item) => item.Id !== id);
    localStorage.setItem("todoApp", JSON.stringify(dataNew));
    setTodoApp(dataNew);
  };

  const handleOpenUpdate = (id) => {
    setTodoApp(id + Math.random(1, 1000));
    console.log("🚀 ========= id:", id);
    const data = localStorage.getItem("todoApp");
    const todoAppId = JSON.parse(data).findIndex((item) => item.Id === id);
    console.log("🚀 ========= todoAppId:", todoAppId);
    const objectData = JSON.parse(data);
    objectData[todoAppId].isUpdate
      ? (objectData[todoAppId].isUpdate = false)
      : (objectData[todoAppId].isUpdate = true);
    console.log("🚀 ========= objectData:", objectData[todoAppId]);
    localStorage.setItem("todoApp", JSON.stringify(objectData));
  };

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm({
    mode: "onBlur",
  });

  const handleUpdate = (id, title) => {
    setTodoApp(id + Math.random(1, 1000));
    const data = localStorage.getItem("todoApp");
    const todoAppId = JSON.parse(data).findIndex((item) => item.Id === id);
    const objectData = JSON.parse(data);
    objectData[todoAppId].isUpdate
      ? (objectData[todoAppId].isUpdate = false)
      : (objectData[todoAppId].isUpdate = true);
    objectData[todoAppId].data = title[`titleTodoApp${id}`];
    console.log("🚀 ========= objectData:", objectData[todoAppId]);
    localStorage.setItem("todoApp", JSON.stringify(objectData));
  };
  return (
    <div className="pt-12 pr-0 pb-12 pl-0 mt-0 mr-auto mb-0 ml-auto sm:py-16 lg:py-20 max-w-4xl">
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
        {/* <ExportToExcel
          apiData={data}
          fileName={fileName}
          className={"bg-green-500 p-2 rounded-xl"}
        /> */}
        <ExportToExcel
          apiData={data2}
          fileName={fileName2}
          className={"bg-green-500 p-2 rounded-xl"}
        />
        <ImportFromExcel />
      </div>
      <ul className="divide-y divide-gray-200 px-4">
        {listTodoApp?.map((item, index) => (
          <li key={index} className="py-4 flex items-center justify-between">
            <div className="flex items-center w-full">
              <input
                id={`todo${index}`}
                name="todo1"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              {item?.isUpdate ? (
                <form
                  onSubmit={handleSubmit2((e) => handleUpdate(item.Id, e))}
                  className="w-full mx-4"
                >
                  <div className="w-full flex gap-8">
                    <input
                      className="w-full"
                      defaultValue={item.data}
                      {...register2(`titleTodoApp${item.Id}`, {
                        required: true,
                      })}
                    />
                    {errors2.titleTodoApp && (
                      <span>This field is required</span>
                    )}

                    <button
                      type="submit"
                      className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                    >
                      Update
                    </button>
                  </div>
                </form>
              ) : (
                <label
                  htmlFor={`todo${index}`}
                  className="ml-3 block text-gray-900"
                >
                  <span className="text-lg font-medium mr-2">{item?.data}</span>
                  <span className="text-sm font-light text-gray-500">
                    Due on {dayjs(item?.date).format("DD/MM/YYYY")}
                  </span>
                </label>
              )}
            </div>
            <div className="flex gap-2 items-center">
              {!item.isUpdate && (
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  onClick={() => handleOpenUpdate(item.Id)}
                />
              )}

              {/* <ModelHeadlessUI
                title={<FontAwesomeIcon icon={faTrash} />}
                description={
                  "Your payment has been successfully submitted. We’ve sent you an email with all of the details of your order."
                }
                className={"bg-slate-400 p-2 rounded-lg hover:bg-slate-500"}
              /> */}
              <button onClick={() => handleDeleteTodoApp(item.Id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
