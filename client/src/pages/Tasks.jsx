import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
// import { tasks } from "../assets/data";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import axios from "axios";
import { useSelector } from "react-redux";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = params?.status || "";
  const [tasks, setTasks] = useState([]);
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/`
      );
      if (response) {
        // console.log(response);
        const filteredTasks = response.data.tasks.filter(
          (task) => task.createdBy === user._id && task.isTrashed === false
        );
        if (status === "in-progress") {
          const proTasks = filteredTasks?.filter(
            (task) => task.stage === "in progress"
          );
          setTasks(proTasks);
        } else if (status === "completed") {
          const proTasks = filteredTasks?.filter(
            (task) => task.stage === "completed"
          );
          setTasks(proTasks);
        } else if (status === "todo") {
          const proTasks = filteredTasks?.filter(
            (task) => task.stage === "todo"
          );
          setTasks(proTasks);
        } else {
          setTasks(filteredTasks);
        }
        // setTasks(response.data.tasks);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [open, status]);

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle
              label="In Progress"
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle label="completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={tasks} />
        ) : (
          <div className="w-full">
            <Table tasks={tasks} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
