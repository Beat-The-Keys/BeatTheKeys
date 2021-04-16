import { React, useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import 'emoji-mart/css/emoji-mart.css'
import Button from 'react-bootstrap/Button';
import { Picker } from 'emoji-mart'

function IconPick(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
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
              <Picker set='apple' />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
        );
}

export default IconPick;