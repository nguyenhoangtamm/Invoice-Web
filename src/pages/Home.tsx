import React from 'react';
import { Button, Panel, Container, Header, Content } from 'rsuite';

const Home: React.FC = () => {
    return (
        <Container>
            <Header>
                <h2>Home Page</h2>
            </Header>
            <Content>
                <Panel bordered>
                    <p>Welcome to the Invoice Web application!</p>
                    <p>This is the home page where you can find an overview of the app.</p>
                    <Button appearance="primary" size="lg">Get Started</Button>
                </Panel>
            </Content>
        </Container>
    );
};

export default Home;