'use client';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { Context } from './Provider';

export default function login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/users/login',
        {
          username: email,
          password: password,
        }
      );

      if (data.success) {
        ctxDispatch({ type: 'USER_SIGNIN', payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
        window.location.href = '/';
      }
    } catch (err: any) {
      alert(err.response.data);
    }
  };

  useEffect(() => {
    if (userInfo) {
      window.location.href = '/chat';
    }
  }, [userInfo]);

  return (
    <div className="d-flex align-items-center justify-content-center container-height">
      <div className="container-size border rounded shadow p-3">
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-4" controlId="loginName">
            <Form.Label>Email or username</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </Form.Group>

          <Button type="submit"  className="mb-4 w-100">
            Sign in
          </Button>

          <div className="text-center">
            <p>
              Not a member? <a href="/signup">Register</a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
