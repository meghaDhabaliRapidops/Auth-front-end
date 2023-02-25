import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Form } from "antd";
import useConnect from "./login-controller";

function Login() {
  const { handleSubmit, loginGoogleUser } = useConnect();

  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <div className="center">
      <div className="title login">Login Form</div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Sign in
          </Button>
        </Form.Item>
      </Form>
      <Button onClick={() => loginGoogleUser()}>Sign in with Google</Button>

      <div>
        <span>Does not have an account?</span>
        <Link to="/register">Click here</Link>
      </div>
    </div>
  );
}

export default Login;
