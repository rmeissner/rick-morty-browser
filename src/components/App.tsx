/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React from 'react'
import { connect } from "react-redux";
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { StateType } from '../store/state';
import { charactersInfoSelector, moreCharactersAction, refreshCharactersAction, loadingStateSelector } from '../store/adapters';
import { Character, CharactersInfo } from '../store/models';
import { CharacterEntryComponent } from './CharacterEntry';
import { LoadingState } from '../store/models/list';
import { tsImportEqualsDeclaration, isTemplateElement } from '@babel/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loadingIndicator: {
    padding: 16
  },
  list: {
    alignSelf: 'stretch'
  }
});

type PropsType = {
  charactersInfo: CharactersInfo,
  loadingState: LoadingState,
  dispatchRefresh: () => void,
  dispatchLoadMore: (next: string) => void
};
class AppModel extends React.Component<PropsType> {
  componentDidMount() {
    this.props.dispatchRefresh()
  }

  refresh = () => {
    if (this.props.loadingState.refreshing) return
    this.props.dispatchRefresh()
  }

  loadMore = () => {
    if (this.props.loadingState.loading) return // Already loading more
    if (this.props.charactersInfo.next.length == 0) return // No more data
    this.props.dispatchLoadMore(this.props.charactersInfo.next)
  }

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.props.loadingState.loading) return null;
    return (
      <ActivityIndicator style={styles.loadingIndicator} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.props.charactersInfo.characters}
          keyExtractor={(item, _) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loadingState.refreshing}
              onRefresh={this.refresh}
            />
          }
          renderItem={({item}) => (<CharacterEntryComponent character={item} />)}
          onEndReachedThreshold={0.4}
          onEndReached={this.loadMore}
          ListFooterComponent={this.renderFooter} />
      </View>
    );
  }
}


const mapStateToProps = (state: StateType) => ({
  charactersInfo: charactersInfoSelector(state),
  loadingState: loadingStateSelector(state)
});

const mapDispatchToProps = {
  dispatchRefresh: refreshCharactersAction,
  dispatchLoadMore: moreCharactersAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppModel);