import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "sonner";
const Register = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/register`,
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );
      if (response.data) {
        navigate("/dashboard");
        toast.success("Account created succesfully !!");
        dispatch(setCredentials(response.data));
      } else {
        toast.error("Something went wrong!!");
        console.log("error");
      }
    } catch (error) {
      toast.error("Something went wrong!!");
      setLoading(false);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
              Manage all your task in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
              <span>Task Manager</span>
            </p>
          </div>
        </div>

        {/* right side */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div className="">
              <p className="text-blue-600 text-3xl font-bold text-center">
                Create new Account !
              </p>
            </div>
            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="full Name"
                type="test"
                name="name"
                label="Full Name"
                className="w-full rounded-full"
                register={register("name", {
                  required: "name is required!",
                })}
                error={errors.name ? errors.name.message : ""}
              />
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />

              <Textbox
                placeholder="your password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-full"
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />
              {loading ? (
                <>
                  <Button
                    label="Submit"
                    className="w-full h-10 bg-gray-200 cursor-wait rounded-full"
                  />
                </>
              ) : (
                <Button
                  type="submit"
                  label="Submit"
                  className="w-full h-10 bg-blue-700 text-white rounded-full"
                />
              )}
              <div className="text-center">
                Already have an account ?{" "}
                <Link to="/login">
                  <span className="underline">Login</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
