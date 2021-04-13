import { React, useState, useEffect } from 'react';
import {Toast} from 'react-bootstrap';

export default function JoinToast({userName}) {
    const [showToast, setToast] = useState(true);
    console.log('userName')
  return (
    <div>
        <Toast onClose={() => setToast(false)} show={showToast} delay={2000} autohide>
          <Toast.Header>
            <strong className="mr-auto">Multiplayer Room Admin</strong>
            <small>Now</small>
          </Toast.Header>
          <Toast.Body>{userName} Joined the Room</Toast.Body>
        </Toast>

    </div>
  );
}