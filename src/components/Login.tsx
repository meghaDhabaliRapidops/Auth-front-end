import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

export interface LoginProps {
  email: string;
  password?: string;
  name?: string;
}


// hgfdhgcd
function Login() {
  const navigate = useNavigate();
  const [inputValues, setInputValue] = useState<LoginProps>({
    email: "",
    password: "",
  });

  const [validation, setValidation] = useState<LoginProps>({
    email: "",
    password: "",
  });

  const [user, setUser] = useState<any>([]);

  //handle submit updates
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInputValue({ ...inputValues, [name]: value });
  }

  const checkValidation = () => {
    let errors = validation;

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
      errors.password = "password is required";
    }
    setValidation(errors);
  };

  useEffect(() => {
    checkValidation();
  }, [inputValues]);

  // useEffect(() => {
  //   document.title = "Login Page";
  //   const isLogedOut = window.localStorage.getItem("logged_out");
  //   console.log("isLogedOut", isLogedOut);
  //   if(isLogedOut == null) {
  //     navigate("/dashboard");
  //   }
  //   else {
  //     navigate("/login");
  //   }
  // }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginAdmin(inputValues);
  };

  const loginAdmin = async (inputs: LoginProps) => {
    const headers = {
      "Content-type": "application/json",
    };
    axios
      .post(`http://localhost:4000/api/login`, inputs, {
        headers,
        withCredentials: true,
      })
      .then((result) => {
        console.log("resultttt", result);
        if (result.data !== "") {
          setInputValue({
            email: "",
            password: "",
          });
          alert("User logged successfully");
         window.localStorage.removeItem("logged_out");
          navigate("/dashboard");
        } else {
          alert("Incorrect username or password");
          console.log(result.data);
        }
      })
      .catch((error) => {
        console.log("inside error part");
        console.log(error);
        alert("User does not exist");
        navigate("/login");
      });
  };


  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleAuth(codeResponse);
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  function googleAuth(codeResponse: any) {
    console.log(codeResponse);
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log("res.data", res.data);
          const googleCreds = {
            email: res.data.email,
            name: res.data.name,
          };
          loginAdmin(googleCreds);
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className="center">
      <div className="title login">Login Form</div>
      <form className="login" action="/" method="POST" onSubmit={handleSubmit}>
        <div className="col-md-12">
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
        <div> {validation.email && <span>{validation.email}</span>}</div>
        <div className="col-md-12">
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
          <div>
            {" "}
            {validation.password && <span>{validation.password}</span>}
          </div>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </div>
        <div className="col-12">
          <span>Does not have an account?</span>
          <Link to="/register">Click here</Link>
        </div>
      </form>
      <button onClick={() => login()}>Sign in with Google </button>
    </div>
  );
}

export default Login;
