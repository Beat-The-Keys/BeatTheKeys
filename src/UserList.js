import { React, useState, useEffect } from 'react';
import {ListGroup} from 'react-bootstrap';

export default function UserList({users}) {
  return (
    <ListGroup>
        {users.map((user)=>(<ListGroup.Item>{user}</ListGroup.Item>))}
    </ListGroup>
  );
}