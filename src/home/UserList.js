import {ListGroup} from 'react-bootstrap';
import styled from 'styled-components';
import IconPick from './IconPick';

export default function UserList({prop}) {
  const {activePlayers, playerName, room, playerEmail} = prop[0]

  //print all the users from all the room
  return (
    <List>
        {Object.keys(activePlayers).map((user, index)=>(
          <ListGroup.Item key={index}>
            <IconPick prop={[{user, playerName, "playerIcon":activePlayers[user][1], room, playerEmail}]}/>
          </ListGroup.Item>
        ))}
    </List>
  );
}

const List = styled(ListGroup)`
  display:flex;
  width: fit-content;
`;