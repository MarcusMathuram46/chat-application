import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/ApiRoutes";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import Welcome from "../components/Welcome";
import axios from "axios";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const userData = localStorage.getItem(
          import.meta.env.VITE_APP_LOCALHOST_KEY
        );
        if (!userData) {
          navigate("/login");
        } else {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error, e.g., redirect to login page or show an error message
        navigate("/login");
      }
      // if (!localStorage.getItem(import.meta.env.VITE_APP_LOCALHOST_KEY)) {
      //   navigate("/login");
      // } else {
      //   setCurrentUser(await JSON.parse(localStorage.getItem(import.meta.env.VITE_APP_LOCALHOST_KEY)));
      // }import ChatContainer from './../components/ChatContainer';

      fetchChat();
    };
  }, [navigate]);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("addUser", currentUser._id);
    }
  }, [currentUser]);
  useEffect(() => {
    const fetchedContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(
            `${allUsersRoute}/${currentUser._id}`
          );
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
      // if(currentUser){
      //   if(currentUser.isAvatarImageSet){
      //     const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
      //     setContacts(data.data);
      //   }else{
      //     navigate("/setAvatar");
      //   }
      // }
    };
    fetchedContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </Container>
  );
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
