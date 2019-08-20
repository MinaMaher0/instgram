let state = {
    uid: '',
    name:'',
    usrName: '',
    bio: '',
    imgURL:'https://firebasestorage.googleapis.com/v0/b/instgram-e9105.appspot.com/o/profile.png?alt=media&token=d569df03-0030-4813-9ba1-2384d8b2770c',
    route: 'login',
}
const listeners = [];

export default {
    getState() {
        return state;
    },
    setState(newState) {
        state = { ...state, ...newState };
        listeners.forEach(listener => listener());
    },
    onChange(newListener) {
        listeners.push(newListener);
        return () => listeners.filter(listener => listener !== newListener);
      },
};
