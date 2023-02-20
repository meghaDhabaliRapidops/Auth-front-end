import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import states from "../state.json";
import axios from "axios";


export interface RegisterProps {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender?: string;
  state?: string;
  city?: string;
  zip?: string;
  date?: string;
}

function Register() {
  
  const [dob, setDOB] = useState(null);
  const navigate = useNavigate();

  const [inputValues, setInputValue] = useState<RegisterProps>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    state:
      states.states[0].state === "Select State" ? "" : states.states[0].state,
    city: "",
    zip: "",
    date: "",
  });


  const [validation, setValidation] = useState<RegisterProps>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    state: "",
  });


  useEffect(() => {
    document.title = "Register Page";
  }, []);

  //handle submit updates
  function handleChange(event: ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
    const { name, value } = event.target;
    setInputValue({ ...inputValues, [name]: value });
  }

  const onDateChange = (date: any) => {
    const myDate = new Date(date).toISOString().slice(0, 10);
    console.log("dateeeeeeeeeeeeee", date);
    setDOB(date);
    setInputValue({ ...inputValues, date: date });
  };

  const checkValidation = () => {
    let errors = validation;

    //first Name validation
    if (!inputValues.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else {
      errors.fullName = "";
    }

    // email validation
    if (!inputValues.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(inputValues.email)
    ) {
      errors.email = "Please enter a valid email address";
    } else {
      errors.email = "";
    }

    //password validation
    const password = inputValues.password;
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be longer than 6 characters";
    } else if (password.length >= 20) {
      errors.password = "Password must shorter than 20 characters";
    } else if (!/^(?=.*[a-z]).{6,20}$/.test(inputValues.password)) {
      errors.password = "Password must contain at least one lowercase";
    } else if (!/^(?=.*[A-Z]).{6,20}$/.test(inputValues.password)) {
      errors.password = "Password must contain at least one capital letter";
    } else if (!/^(?=.*[0-9]).{6,20}$/.test(inputValues.password)) {
      errors.password = "Password must contain at least a number";
    } else {
      errors.password = "";
    }

    //matchPassword validation
    if (!inputValues.confirmPassword) {
      errors.confirmPassword = "Password confirmation is required";
    } else if (inputValues.confirmPassword !== inputValues.password) {
      errors.confirmPassword = "Password does not match confirmation password";
    } else {
      errors.confirmPassword = "";
    }
    setValidation({ ...errors });
  };

  useEffect(() => {
    checkValidation();
  }, [inputValues]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addStudent();
  };

  const addStudent = async () => {
    const headers = {
      "Content-type": "application/json",
    };
    axios
      .post(`http://localhost:4000/api/students`, inputValues, {
        headers,
        withCredentials: true,
      })
      .then((result) => {
        console.log("resultttt", result);
        if (result.data !== "") {
          setInputValue({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "Male",
            state: states.states[0].state,
            city: "",
            zip: "",
            date: "",
          });
          setDOB(null);
          alert("User Registered successfully");
          navigate("/login");
        } else {
          alert("User is not registered");
          console.log(result.data);
        }
      })
      .catch((err) => {
        alert("User already exist.");
        navigate("/login");
        // console.log("inside catch",err);
        // console.log(err.message);
      });
  };

  return (
    <div className="center">
      <div className="title register">Register Form</div>

      <form
        className="row g-3"
        action="/"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="col-md-6">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            id="fullName"
            onChange={(e) => handleChange(e)}
            value={inputValues.fullName}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            onChange={(e) => handleChange(e)}
            value={inputValues.email}
            required
          />
        </div>
        <div className="col-md-6">
          {validation.fullName && <span>{validation.fullName}</span>}
          {/* <span>{validation.fullName}</span> */}
        </div>
        <div className="col-md-6">
          {validation.email && <span>{validation.email}</span>}
        </div>

        <div className="col-md-6">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            onChange={(e) => handleChange(e)}
            value={inputValues.password}
            autoComplete="on"
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="inputPassword4" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            id="confirmPassword"
            onChange={(e) => handleChange(e)}
            value={inputValues.confirmPassword}
            autoComplete="on"
            required
          />
        </div>
        <div className="col-md-6">
          {validation.password && <span>{validation.password}</span>}
        </div>
        <div className="col-md-6">
          {validation.confirmPassword && (
            <span>{validation.confirmPassword}</span>
          )}
        </div>
        <div className="col-6">
          <div>
            <label htmlFor="inputAddress" className="form-label">
              Gender
            </label>
          </div>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                value="Male"
                name="gender"
                checked={inputValues.gender === "Male"}
                onChange={(e) => handleChange(e)}
              />{" "}
              <label className="form-check-label" htmlFor="inlineRadio1">
                Male
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                value="Female"
                name="gender"
                checked={inputValues.gender === "Female"}
                onChange={(e) => handleChange(e)}
              />{" "}
              <label className="form-check-label" htmlFor="inlineRadio2">
                Female
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                value="Other"
                name="gender"
                checked={inputValues.gender === "Other"}
                onChange={(e) => handleChange(e)}
              />{" "}
              <label className="form-check-label" htmlFor="inlineRadio2">
                Other
              </label>
            </div>
          </div>
        </div>
        <div className="col-6">
          <label htmlFor="inputAddress2" className="form-label">
            DOB
          </label>
          <DatePicker
            selected={dob}
            maxDate={new Date()}
            className="w-full form-control"
            isClearable={true}
            onChange={(date) => onDateChange(date)}
          />
        </div>
        <div className="col-md-5">
          <label htmlFor="inputCity" className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="inputCity"
            name="city"
            value={inputValues.city}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="inputState" className="form-label">
            State
          </label>

          <select
            className="form-select"
            value={inputValues.state}
            name="state"
            onChange={(e) => handleChange(e)}
          >
            {states.states.map((item, i) => {
              return (
                // <option key={i} value={item.state} name={item.state}>

                <option key={i} value={item.state}>
                  {item.state}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="inputZip" className="form-label">
            Zip
          </label>
          <input
            type="number"
            className="form-control"
            id="inputZip"
            name="zip"
            value={inputValues.zip}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="col-12">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="gridCheck"
            />
            <label className="form-check-label" htmlFor="gridCheck">
              Check me out
            </label>
          </div>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Sign up
          </button>
        </div>
        <div className="col-12">
          <span>Already have an account?</span>
          <Link to="/login">Click here</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
