import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/ApiRoutes";
import { io } from "socket.io-client";
import styled from "styled-components";
import Contacts from './../components/Contacts';
import ChatContainer from "../components/ChatContainer";
import Welcome from './../components/Welcome';
import axios from "axios";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect( () => {
    const fetchChat = async()=>{
      if (!localStorage.getItem("import.meta.env.VITE_APP_LOCALHOST_KEY")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("import.meta.env.VITE_APP_LOCALHOST_KEY")));
      }
      fetchChat();
    }
  }, []);
  useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("addUser", currentUser._id);
    }
  },[currentUser])
  useEffect(()=>{
    const fetchedChat=async()=>{
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        }else{
          navigate("/setAvatar");
        }
      }
      fetchedChat();
    }
  }, [currentUser])
  const handleChatChange=(chat)=>{
    setCurrentChat(chat);
  }
  return(
    <>
    <Container>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ):(
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </Container>
  </>
  )  
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
