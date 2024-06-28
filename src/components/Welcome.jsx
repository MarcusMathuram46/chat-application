import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Robot from "../assets/robot.gif"
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(()=>{
    const fetchWelcome = async()=>{
      try {
        const userData = localStorage.getItem(import.meta.env.VITE_APP_LOCALHOST_KEY);
        if (userData) {
          const { username } = JSON.parse(userData);
          setUserName(username);
        } else {
          console.error('User data not found in localStorage');
          // Handle the case where user data is not found, e.g., redirect to login
        }
      } catch (error) {
        console.error('Error fetching welcome data:', error);
        // Handle the error, e.g., show an error message or retry fetching
      }
      // setUserName(await JSON.parse(localStorage.getItem(import.meta.env.VITE_APP_LOCALHOST_KEY)).username)
    }
    fetchWelcome();
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>Welcome, <span>{userName}!</span></h1>
      <h3>Please select a chat to start messaging</h3>    
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
