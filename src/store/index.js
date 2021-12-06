import Vue from "vue";
import Vuex from 'vuex'
import app from './modules/app'
import settings from './modules/settings'
import table from './modules/table'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        table,
        user,
        app,
        settings
    },
    getters
})