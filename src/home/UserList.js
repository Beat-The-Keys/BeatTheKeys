import {ListGroup} from 'react-bootstrap';
import styled from 'styled-components';

export default function UserList({users}) {
  //print all the users from all the room
  return (
    <List>
        {users.map((user, index)=>(<ListGroup.Item key={index}>{user}</ListGroup.Item>))}
    </List>
  );
}

const List = styled(ListGroup)`
  display:flex;
  flex-direction:row;
  width: fit-content;
`;