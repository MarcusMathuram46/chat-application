import React from 'react'
import { BiPowerOff } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { logoutRoute } from '../utils/ApiRoutes';
import axios from 'axios';

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async()=>{
    try{
      const id = await JSON.parse(localStorage.getItem(import.meta.env.VITE_APP_LOCALHOST_KEY)._id);
      const data = await axios.get(`${logoutRoute}/${id}`);
      if (data.status === 200) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Logout request failed:", data);
        // Handle failure scenario, if necessary
      }
      // if(data.status === 200){
      //   localStorage.clear();
      //   navigate("/login");
    }catch(error){
      console.error(error);
    }
  }
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  )
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;