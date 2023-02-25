import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation, useQueryClient } from 'react-query';

export interface LoginProps {
  email: string;
  password?: string;
  name?: string;
}

function useConnect() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>([]);

  //handle submit updates
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
        if (result.data !== "") {
          alert("User logged successfully");
          window.localStorage.removeItem("logged_out");
          navigate("/dashboard");
        } else {
          alert("Incorrect username or password");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Incorrect username or password");
        navigate("/login");
      });
  };

  const { mutate, isLoading } = useMutation(loginAdmin, {
    onSuccess: data => {
       console.log(data);
       const message = "success"
       //alert(message)
 },
   onError: () => {
        alert("there was an error")
 },
   onSettled: () => {
      //queryClient.invalidateQueries('create')
 }
 });

  const handleSubmit = (values: any) => {
    console.log("values", values);
    console.log("inside handle submit");
    if (values.email.trim() === "" || values.password === "") {
      alert("Both fields are required");
    } else {
      console.log("inside else part");
      mutate(values);
    }
  };


  const loginGoogleUser = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleAuth(codeResponse);
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  function googleAuth(codeResponse: any) {
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
          const googleCreds = {
            email: res.data.email,
            name: res.data.name,
          };
          loginAdmin(googleCreds);
        })
        .catch((err) => console.log(err));
    }
  }

  return {
    handleSubmit,
    loginGoogleUser,
  };
}

export default useConnect;
