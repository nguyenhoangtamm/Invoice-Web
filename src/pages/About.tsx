import React from 'react';
import { Panel, Container, Header, Content, IconButton } from 'rsuite';
import { InfoOutline } from '@rsuite/icons';

const About: React.FC = () => {
    return (
        <Container>
            <Header>
                <h2>About Us</h2>
            </Header>
            <Content>
                <Panel bordered>
                    <p>This application is designed for managing invoices efficiently.</p>
                    <p>Built with React and Rsuite for a modern user experience.</p>
                    <IconButton icon={<InfoOutline />} appearance="primary" size="lg">
                        Learn More
                    </IconButton>
                </Panel>
            </Content>
        </Container>
    );
};

export default About;