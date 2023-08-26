'use client';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../Provider';
import { useRouter } from 'next/navigation';

export default function signup() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/users/signup',
        {
          username,
          email,
          password,
        }
      );
      router.push(`/otp/${data.token}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userInfo) {
      window.location.href = '/chat';
    }
  }, [userInfo]);

  return (
    <div className="d-flex align-items-center justify-content-center mt-5 mb-5">
      <div className="container-size border rounded shadow p-3">
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-4" controlId="loginEmail">
            <Form.Label>Email </Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="loginName">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
            />
          </Form.Group>

          <div className="mt-3 mb-3">
            <div>Password must be at least 8 characters long.</div>
            <div>password must have an uppercase character.</div>
            <div>password must have a lowercase character.</div>
            <div>Password must have special characters.</div>
            <div>Password must have numbers.</div>
          </div>

          <Button type="submit" className="mb-4 w-100">
            Sign in
          </Button>

          <div className="text-center">
            <p>
              Already a member? <a href="/">Login</a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
