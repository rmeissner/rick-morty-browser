import 'react-native';
import React from 'react';
import App from '../../src';
// Fetch is not available in jest
global.fetch = require('node-fetch');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { CLIENT_RENEG_WINDOW } from 'tls';

// This is an integration test and uses real api calls
describe('App', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
