import {ListGroup, Form} from 'react-bootstrap';
import { React, useRef} from 'react';
import styled from 'styled-components';
import IconPick from './IconPick';
import {socket} from '../login/LoginScreen';

export default function UserList({prop}) {
  const {activePlayers, playerName, room, playerEmail, readyPlayers} = prop[0];
  const playerCheckboxRef = useRef(null);

  function playerChangedReady() {
    socket.emit('playerChangedReady', {playerEmail, 'isReady': playerCheckboxRef.current.checked, room});
  }

  //print all the users from all the room
  return (
    <List>
        {Object.keys(activePlayers).map((user, index)=>(
          <ListGroup.Item key={index}>
            <IconPick prop={[{user, playerName, "playerIcon":activePlayers[user][1], room, playerEmail}]}/>
            { playerEmail === user
             ? <center><Form.Check label={"Ready"} checked={readyPlayers.includes(user)} onClick={playerChangedReady} ref={playerCheckboxRef}/></center>
             : <center><Form.Check label={"Ready"} disabled checked={readyPlayers.includes(user)}/></center>
            }
          </ListGroup.Item>
        ))}
    </List>
  );
}

const List = styled(ListGroup)`
  display:flex;
  width: fit-content;
`;