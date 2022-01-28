const app = Vue.createApp({
    data: () => ({
        todos: [],
        todoText: '',
        color: ''
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
                const date = new Date().getMinutes() < 10 ? 
                new Date().getHours() + ':0' + new Date().getMinutes() : 
                new Date().getHours() + ':' + new Date().getMinutes()
                this.todos.push({
                    name: this.todoText,
                    edit: false,
                    editText: this.todoText,
                    items: [],
                    date,
                    color: this.color
                })
                this.todoText = ''
                console.log(this.color)
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
        },
        itemUp(index) {
            let t = this.todo.items[index - 1]
            this.todo.items[index - 1] = this.todo.items[index]
            this.todo.items[index] = t
            localStorage.local = JSON.stringify(this.todos)
        },
        itemDown(index) {
            let t = this.todo.items[index + 1]
            this.todo.items[index + 1] = this.todo.items[index]
            this.todo.items[index] = t
            localStorage.local = JSON.stringify(this.todos)
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
            <button v-if='index' @click="itemUp(index)" style="border: none; background: none;"><i class="fas fa-arrow-up"></i></button>
            <button v-if='index !== todo.items.length - 1' @click="itemDown(index)" style="border: none; background: none;"><i class="fas fa-arrow-down"></i></button>
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
        todoItemText: []
    }),
    methods: {
        addTodoItem(todo, index) {
            if (this.todoItemText[index] !== '') {
                todo.items.push({
                    text: this.todoItemText[index],
                    done: false,
                    editText: this.todoItemText,
                    edit: false,
                })
                localStorage.local = JSON.stringify(this.todos)
            }
        },
        delTodo(index) {
            this.todos.splice(index, 1)
            localStorage.local = JSON.stringify(this.todos)
        },
        editTodo(todo) {
            if (todo.editText !== '') {
                todo.name = todo.editText
                todo.edit = false
                localStorage.local = JSON.stringify(this.todos)
            }
        },
        todosFilter() {

        }
    },
    template: `
        <div class="card mb-3" v-for="(todo, index) in todosFilter">
        <div :style="{borderTop: todo.color + ' 10px solid !important'}" class="note d-flex justify-content-between p-3">
                <input @keypress.enter="addTodoItem(todo, index)" v-model="todoItemText[index]" class="form-control" type="text">
                <button @click="addTodoItem(todo, index)" style="border: none; background: none;">
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
                    <button @click="todo.edit = !todo.edit" style="border: none; background: none;"><i class="fas fa-pencil-alt"></i></button>
                    <button @click.stop.prevent="delTodo(index)" style="border: none; background: none;"><i class="pencil far fa-trash-alt"></i></button>
                </div>
            </div>
            <div class="d-flex justify-content-between" v-if="todo.edit">
            <input @keypress.enter="editTodo(todo)" v-model="todo.editText" class="form-control" type="text">
            <input type="color" @change="editTodo(todo)" class="form-control form-control-color" id="changeColor" v-model="todo.color" title="Choose your color">
            </div>
            

        </div>
            
            <ul class="list-group droppable list-group-flush">
                <todo-item 
                :todos="this.todos" 
                :todo="todo" 
                :item="item" 
                :index="index" 
                v-for="(item, index) in todos[index].items" 
                :key="item"
                ></todo-item>
            </ul>
        </div>
    `
})

app.mount('#app')