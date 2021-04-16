import {ListGroup} from 'react-bootstrap';

export default function UserList({users}) {
  //print all the users from all the room
  return (
    <ListGroup>
        {users.map((user, index)=>(<ListGroup.Item key={index}>{user}</ListGroup.Item>))}
    </ListGroup>
  );
}