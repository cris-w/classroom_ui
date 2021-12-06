export default {
    state: {
        isCollapse: false
    },
    mutations: {
        collapseMenu(state, value) {
            state.isCollapse = !state.isCollapse
        }
    }
}