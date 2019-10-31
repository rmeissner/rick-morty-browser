import * as React from 'react';
import {Character} from '../store/models';
import {Text, StyleSheet, View, Image} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    title: {
        marginRight: 16,
        marginLeft: 16,
        fontSize: 18,
        alignItems: 'center',
        color: '#65A7C5',
    },
    status: {
        marginRight: 16,
        marginLeft: 16,
        fontSize: 12,
        alignItems: 'center',
        color: '#65A7C5',
    },
    image: {
        width: 48,
        height: 48,
    },
});

type PropsType = {
    character: Character;
};

export const CharacterEntryComponent = (props: PropsType) => {
    return (
        <View style={styles.container}>
            <Image source={{uri: props.character.imageUrl}} style={styles.image} />
            <View>
                <Text style={styles.title}>{props.character.name}</Text>
                <Text style={styles.status}>{props.character.status}</Text>
            </View>
        </View>
    );
};
