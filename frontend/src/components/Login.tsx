"use client";

import { API_URL } from '@/utils/constant';
import axios from 'axios';
import React from 'react'

export const Login = () => {

  const handleOnClikLogin = async () => {
    try {
      console.log('handleOnClickInfosJDebit');
      // Create an instance of Axios with the `withCredentials` option set to true
      const axiosInstance = axios.create({
        withCredentials: true,
      });

      const response = await fetch(API_URL.LOGIN, {
        method: 'POST',
        body: JSON.stringify({
          username: "unif"
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        console.log('ok');

      } else {
        console.error('Response error:', response.statusText);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  return (
    <div>
      <button
        className='btn btn-circle btn-secondary'
        onClick={handleOnClikLogin}
      >
        Login
      </button>
    </div>
  )
}
