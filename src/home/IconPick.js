import { React, useState, useEffect  } from 'react';
import { Modal } from 'react-bootstrap';
import 'emoji-mart/css/emoji-mart.css';
import { Picker,  Emoji } from 'emoji-mart';
import {socket} from '../LoginScreen';
import styled from 'styled-components';

function IconPick({prop}){
    const {user, playerName} = prop[0];
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [icon, setIcon] = useState("");
    const [email, setEmail] = useState("");

    function emojiUpdate(emoji) {
      setIcon(emoji.id);
      let emojiID = emoji.id;
      socket.emit('iconToDB', {emojiID, email});
      handleClose()
    }

    useEffect(() => {
      socket.on('iconFromDB', (data) => {
        if(data.icon !== null)
          setIcon(data.icon);
        setEmail(data.email);
      });

  }, [icon]);

    return(
        <div>
          <center>
            <Div current={user === playerName} onClick={()=>{if(user === playerName){handleShow()}}}>
              <Emoji emoji={icon} set='apple' size={32} native={true}/> {user}
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
              <h3>
                You Picked: <Emoji emoji={icon} set='apple' size={32} native={true}/>
              </h3>
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