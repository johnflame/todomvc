import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
import 'todomvc-app-css/index.css'
/* eslint-disable no-new */
const todos = new Vue({
  el: '#app',
  render: h => h(App)
})

window.addEventListener('hashchange', function(){    //路由  
  let hashName = location.hash.replace(/#\/?/, '').toLowerCase();
  const filtersA = ['all', 'active', 'completed'];
  if (filtersA.includes(hashName)) {
    todos.$children["0"].visibility = hashName  
  }
  else {
    location.hash = '';
    todos.$children["0"].visibility = 'all';
  }
})