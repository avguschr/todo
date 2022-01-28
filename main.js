const app = Vue.createApp({
    data: () => ({
        todos: [],
        todoText: '',
    }),

    mounted () {
        // localStorage.clear()
        if (localStorage.local) {
            this.todos = typeof JSON.parse(localStorage.local) === "number" ? [JSON.parse(localStorage.local)] : JSON.parse(localStorage.local)
        }
    },

    methods: {
        addTodo() {
            if (this.todoText !== '') {
                this.todos.push({
                    name: this.todoText,
                    edit: false,
                    editText: '',
                    items: [],
                    date: new Date().getHours() + ':' + new Date().getMinutes()
                })
                this.todoText = ''
                localStorage.local = JSON.stringify(this.todos)
            }
        },
    },
})

app.component('todo-item', {
    props: ['item', 'index', 'todo', 'todos'],
    methods: {
        delTodoItem(index) {
            this.todo.items.splice(index, 1)
            localStorage.local = JSON.stringify(this.todos)
        },
        doneItem() {
            this.item.done = !this.item.done
            localStorage.local = JSON.stringify(this.todos)
        },
        editItem() {
            if (this.item.editText !== '') {
                this.item.text = this.item.editText
                this.item.editText = ''
                this.item.edit = false
                localStorage.local = JSON.stringify(this.todos)
            }
        }
    },
    template: `
        <li class="list-group-item">
            <div class="d-flex justify-content-between mb-2">
                <div>
               <input @change.stop.prevent="doneItem" class="form-check-input me-1" type="checkbox" value="" aria-label="..." :checked="item.done">
                {{ item.text }}
            </div>
            <div>
                <button @click="item.edit = !item.edit" style="border: none; background: none;"><i class="fas fa-pencil-alt"></i></button>
            <button @click.stop.prevent="delTodoItem(this.index)" style="border: none; background: none;"><i class="far fa-trash-alt"></i></button>
            </div>
            </div>
            <input @keypress.enter="editItem" v-model="item.editText" v-if="item.edit" class="form-control" type="text">           
        </li>
        
    `
})

app.component('todo', {
    props: {
        todos: Array
    },
    data: () => ({
        todoItemText: ''
    }),
    methods: {
        addTodoItem(todo) {
            if (this.todoItemText !== '') {
                todo.items.push({
                    text: this.todoItemText,
                    done: false,
                    editText: '',
                    edit: ''
                })
                this.todoItemText = ''
                localStorage.local = JSON.stringify(this.todos)
            }
        },
    },
    template: `
        <div class="card mb-3" v-for="(todo, index) in todos">
        <div class="d-flex justify-content-between p-3">
                <input @keypress.enter="addTodoItem" v-model="todoItemText" class="form-control" type="text">
                <button @click="addTodoItem(todo)" style="border: none; background: none;">
                    <i class="fas fa-plus"></i>
                </button>
        </div>
        <div class="card-body ">
            <div class="d-flex justify-content-between">
                <div>
                    <h5 class="card-title">{{ todo.name }}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">{{ todo.date }}</h6>
                </div>
                <div>
                    <button @click="item.edit = !item.edit" style="border: none; background: none;"><i class="fas fa-pencil-alt"></i></button>
                    <button @click.stop.prevent="delTodoItem(this.index)" style="border: none; background: none;"><i class="pencil far fa-trash-alt"></i></button>
                </div>
            </div>
            <input class="form-control" type="text">
        </div>
            
            <ul class="list-group list-group-flush">
                <todo-item :todos="this.todos" :todo="todo" :item="item" :index="index" v-for="(item, index) in todos[index].items" :key="item"></todo-item>
            </ul>
        </div>
    `
})

app.mount('#app')