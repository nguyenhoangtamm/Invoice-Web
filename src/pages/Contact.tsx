import React from 'react';
import { Panel, Container, Header, Content, Form, ButtonGroup, Button } from 'rsuite';

const Contact: React.FC = () => {
    return (
        <Container>
            <Header>
                <h2>Contact Us</h2>
            </Header>
            <Content>
                <Panel bordered>
                    <p>Get in touch with us for any inquiries.</p>
                    <Form fluid>
                        <Form.Group controlId="name">
                            <Form.ControlLabel>Name</Form.ControlLabel>
                            <Form.Control name="name" />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control name="email" type="email" />
                        </Form.Group>
                        <Form.Group>
                            <ButtonGroup>
                                <Button appearance="primary">Send</Button>
                                <Button appearance="default">Cancel</Button>
                            </ButtonGroup>
                        </Form.Group>
                    </Form>
                </Panel>
            </Content>
        </Container>
    );
};

export default Contact;