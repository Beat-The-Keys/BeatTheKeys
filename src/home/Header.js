import React from 'react'
import { useGoogleLogout } from 'react-google-login';
import styled from 'styled-components';
import {client_id} from '../LoginScreen'

export default function Header({prop}) {
    const {room, playerName, playerEmail, responseGoogleLogout} = prop[0]

    const {signOut} = useGoogleLogout({
        clientId: client_id,
        onLogoutSuccess: ()=>responseGoogleLogout(room),
        onFailure: ()=>alert('Error logging out, Try Again.'),
    })
    return (
        <Hav>
            <Code>Invite Code: {room}</Code>
            <Welcome>Hi, {playerName}! Welcome to your lobby.</Welcome>
            <Logout>
                <User>Logged In: {playerEmail} </User>
                <DropDown>
                    <span onClick={signOut}>Sign Out</span>
                </DropDown>
            </Logout>
        </Hav>
    )
}


const Hav = styled.nav`
top: 0;
right: 0;
left: 0;
height: 70px;
background-color: #090b13;
display: flex;
justify-content: space-between;
align-items: center;
padding: 0 36px;
z-index:3;
color:whitesmoke;
`;

const Code = styled.span`
padding: 0;
width: 100px;
margin-top:4px;
max-height: 70px;
display: inline-block;
`;

const Welcome = styled.div`
  align-items:center;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  justify-content: flex-end;
  margin: 0px;
  padding: 0px;
  position: relative;
  margin-right: auto;
  margin-left: auto;

  @media (max-width:667px){
    display:none;
  }
`;

const User = styled.span`
  height: 50%
`;

const DropDown = styled.div`
  position: absolute;
  top: 40px;
  right: 50px;
  background: rgb(19,19,19);;
  border: 1px solid rgba(151,151,151,0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size:14px;
  letter-spacing: 3px;
  opacity: 0
`;

const Logout = styled.div`
  position: relative;
  height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover{
      ${DropDown}{
          opacity: 1;
          transition-duration: 1s;
      }
  }
`;