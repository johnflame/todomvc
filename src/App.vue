<template>
<section class="todoapp">
  <header class="header">
    <h1>{{Title}}</h1>
    <input class="new-todo"
      autofocus autocomplete="off"
      placeholder="What needs to be done?" v-model.trim="newTodo"  @keyup.enter="addTodo">
  </header>
  <section class="main" v-cloak>
    <input class="toggle-all" type="checkbox" 
	v-show="todoList.length"
    v-model="isAll" >
    <ul class="todo-list">
      <li class="todo" 
      v-for="(todo,index) in filterTodoList" 
      :key="todo.id" 
      :class="{completed:todo.isCompleted,editing:todo.isEdit}">
        <div class="view">
          <input class="toggle" type="checkbox"  @click="toggle(todo)" v-model="todo.isCompleted">
          <label @dblclick="changeText(todo)">{{todo.msg}}</label>
          <button class="destroy" @click="rmTodo(index)"></button>
        </div>
        <input class="edit" type="text" 
        v-model.trim="editText"
        v-myfocus 
        @keyup.enter="completeEdit(todo)" 
        @keyup.esc="cancelEdit(todo)"
        @blur="cancelEdit(todo)">
      </li>
    </ul>
  </section>
  <footer class="footer"  v-show="todoList.length" v-cloak>
    <span class="todo-count">
      <strong>{{remaining.length}}</strong> {{remaining.length > 1 ? 'items' : 'item'}} left
    </span>
    <ul class="filters">
      <li><a href="#/all" :class="{ selected: visibility === 'all' }">All</a></li>
      <li><a href="#/active" :class="{ selected: visibility ==='active'}">Active</a></li>
      <li><a href="#/completed" :class="{ selected: visibility ==='completed'}">Completed</a></li>
    </ul>
    <button class="clear-completed" 
	v-show="todoList.length-remaining.length"
	@click="clearCompleted" >
      Clear completed
    </button>
  </footer>
</section>
</template>

<script>
import Store from './store'
export default {
  name: "App",
  data() {
    return {
      Title: "myTodos",
      newTodo: "",
      todoList: Store.fetch(),
      editText: "",
      visibility:"all",
    };
  },
  watch:{
      todoList: {
            handler:function(todoList){Store.save(todoList)},
			deep: true,
			}
  },
  methods: {
    addTodo() {
      //添加一个todo
      if (this.newTodo) {
        //如果newTodo不为空
        this.todoList.push({
          //向数组数添加一个对象
          id: Symbol(), //用一个Symbol类型为id，作为key
          msg: this.newTodo, //msg为newTodo的值
          isCompleted: false, //状态为未完成
          isEdit: false //不是编辑状态
        });
        this.newTodo = "";
      }
    },
    toggle(todo) {
      //切换todo的状态(完成or未完成)
      todo.isCompleted = !todo.isCompleted;
    },
    rmTodo(index) {
      //点击X按钮删除该todo
      this.todoList.splice(index, 1);
    },
    changeText(todo) {
      //双击 todo出现修改它内容的输入框
      todo.isEdit = true; //把编辑状态变为true
      this.editText = todo.msg; //把修改框中的内容与todo的原内容相匹配
    },
    completeEdit(todo) {
      //完成todo的修改
      if (this.editText) {
        todo.msg = this.editText; //把todo的内容改为修改后的内容
        this.editText = ""; //把编辑器中的内容清空
        todo.isEdit = false; //把编辑状态变为false
      }
    },
    cancelEdit(todo) {
      //取消todo的修改
      this.editText = "";
      todo.isEdit = false;
    },
    clearCompleted() {
      this.todoList = this.todoList.filter(todo => {
        //过滤出todoList中未完成的todo,再将todoList指向该新数组
        todo.isCompleted === false;
      });
    }
  },
  computed: {
    remaining() {
      return this.todoList.filter(todo => {
        return !todo.isCompleted;
      });
    },
    filterTodoList() {
      switch (this.visibility) {
        case 'all':
          return this.todoList;
        case 'active':
          return this.remaining;
        case 'completed':
          return this.todoList.filter(todo => {
            return todo.isCompleted;
          });
      }
    },
    isAll: {
      get: function() {
        //若未完成为0，则返回true
        return this.remaining.length === 0;
      },
      set: function(value) {
        //若点击checkbox，其值发生改变，将其值赋予每个todo的isCompleted
        this.todoList.forEach(function(todo) {
          todo.isCompleted = value;
        });
      }
    }
  },
  directives: {
    //自定义指令v-myfocus，自动获得焦点
    myfocus(el) {
      el.focus();
    }
  }
};
</script>

<style lang="scss" >
[v-cloak] {
  display: none;
}
</style>
