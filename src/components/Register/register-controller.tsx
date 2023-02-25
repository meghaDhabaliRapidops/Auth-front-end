import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from 'react-query';

export interface RegisterProps {
  fullName: string;
  email: string;
  password: string;
}

function useConnect() {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    mutate(values);
  };

  const addStudent = async (values: any) => {
    const headers = {
      "Content-type": "application/json",
    };
    axios
      .post(`http://localhost:4000/api/students`, values, {
        headers,
        withCredentials: true,
      })
      .then((result) => {
        if (result.data !== "") {
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
        console.log(err.message);
      });
  };

  const { mutate, isLoading } = useMutation(addStudent, {
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

  return {
    handleSubmit,
  };
}

export default useConnect;
