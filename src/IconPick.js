import { React, useState, useEffect  } from 'react';
import { Modal } from 'react-bootstrap';
import 'emoji-mart/css/emoji-mart.css';
import Button from 'react-bootstrap/Button';
import { Picker,  Emoji } from 'emoji-mart';
import {socket} from './LoginScreen';

function IconPick(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [icon, setIcon] = useState("");
    const [email, setEmail] = useState("");

    function emojiUpdate(emoji) {
      setIcon(emoji.id);
      let emojiID = emoji.id;
      socket.emit('iconToDB', {emojiID, email});
    }

    useEffect(() => {
      socket.on('iconFromDB', (data) => {
        if(data.icon !== null)
          setIcon(data.icon);
        setEmail(data.email);
      });

  }, [icon]);

    return(
        <>
         <center>
          <Button variant="primary" onClick={handleShow} size="lg">
            Select Icon
          </Button>
         </center>

          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Pick an Emoji</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Picker
                  title="Pick your emoji…"
                  emoji="point_up"
                  onSelect={emoji => emojiUpdate(emoji)}
              />
              <div>
                <h1>
                  You Picked: <Emoji emoji={icon} set='apple' size={32} native={true}/>
                </h1>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <h3> Your Icon: <Emoji emoji={icon} set='apple' size={32} native={true}/> </h3>
        </>
        );
}

export default IconPick;
