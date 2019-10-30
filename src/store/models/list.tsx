export class LoadingState {
    loading: boolean;
    refreshing: boolean;

    constructor(loading: boolean, refreshing: boolean) {
    this.loading = loading
    this.refreshing = refreshing
    }
}