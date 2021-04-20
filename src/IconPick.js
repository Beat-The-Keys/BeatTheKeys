import { React, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'emoji-mart/css/emoji-mart.css';
import Button from 'react-bootstrap/Button';
import { Picker } from 'emoji-mart';

function IconPick(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [icon, setIcon] = useState("");
    
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
                  onSelect={emoji => SetIcon(emoji.native)}
              />
              <div>
                <h1>
                  You Picked: {icon}
                </h1>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <h3> Your Icon: {icon} </h3>
        </>
        );
}

export default IconPick;
