import { React, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'emoji-mart/css/emoji-mart.css';
import { Picker,  Emoji } from 'emoji-mart';
import {socket} from '../LoginScreen';
import styled from 'styled-components';

function IconPick({prop}){
    const {user, playerName, playerIcon, room, playerEmail} = prop[0];
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function emojiUpdate(emoji) {
      let emojiID = emoji.id;
      socket.emit('iconToDB', {emojiID, playerEmail, room, playerName});
      handleClose()
    }

    return(
        <div>
          <center>
            <Div current={user === playerEmail} onClick={()=>{if(user === playerEmail){handleShow()}}}>
              <Emoji emoji={playerIcon} set='apple' size={32} native={true}/> {user}
            </Div>
            <Modal
              className="coustom_modal"
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
            <Header closeButton>
              <Modal.Title>Pick an Emoji</Modal.Title>
            </Header>
            <Body>
            <center>
              <Picker
                  title="Pick your emoji…"
                  emoji="point_up"
                  onSelect={emoji => emojiUpdate(emoji)}
              />
              </center>
            </Body>
          </Modal>
          </center>
        </div>
        );
}

export default IconPick;

const Header = styled(Modal.Header)`
  padding: 0.4rem 2rem;
`;

const Body = styled(Modal.Body)`
	padding: 0.2rem;
`;

const Div = styled.div`
  cursor: ${props=>props.current ? "pointer" : "auto"};
`;
