import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

import {debounce} from 'lodash';

const styles = StyleSheet.create({
    input: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignSelf: 'stretch',
        height: 48,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 16,
        paddingTop: 8,
        paddingRight: 16,
        paddingBottom: 8,
        paddingLeft: 16,
        margin: 16,
    },
});

export type TopSearchProps = {
    placeholder?: string;
    delay?: number;
    onChange: (value: string) => void;
};

export default class TopSearch extends React.Component<TopSearchProps> {
    onChangeTextDelayed: (value: string) => void;
    constructor(props: TopSearchProps) {
        super(props);
        this.onChangeTextDelayed = debounce(this.props.onChange, props.delay ? props.delay : 300);
    }

    render() {
        return (
            <TextInput
                placeholder={this.props.placeholder}
                style={styles.input}
                onChangeText={this.onChangeTextDelayed}
            />
        );
    }
}
