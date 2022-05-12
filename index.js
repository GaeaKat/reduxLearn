function createStore(reducer) {
    // The store should have four parts
    //1, The state
    //2. Get the state
    //3.Listen to changes
    //4. Update the state
    let state;
    let listeners = [];

    const getState = () => state

    const subscribe = (listener) => {

        listeners.push(listener)
        return  () =>
        {
            listeners = listeners.filter((l) => l !== listener)
        }
    }
    const dispatch = (action) => {
        state = reducer(state,action)
        listeners.forEach((listener) => listener())
    }

    return {
        getState,
        subscribe,
        dispatch
    }
}
const ADD_TODO="ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";

const addTodoAction = (todo) => ({
    type: ADD_TODO,
    todo
});

const removeTodoAction = (id) => ({
    type: REMOVE_TODO,
    id
})

const toggleTodoAction = (id) => ({
    type: TOGGLE_TODO,
    id
})

function todos(state=[], action) {
    switch (action.type) {
        case ADD_TODO:
            return state.concat([action.todo]);
        case REMOVE_TODO:
            return state.filter(todo => todo.id !== action.id);
        case TOGGLE_TODO:
            return state.map(todo => todo.id!==action.id ? todo : Object.assign({}, todo, {complete: !todo.complete}) )
        default:
            return state;
    }
}

const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

const addGoalAction = (goal) => ({
    type: ADD_GOAL,
    goal
});

const removeGoalAction = (id) => ({
    type: REMOVE_GOAL,
    id
});

function goals(state=[], action) {
    switch(action.type) {
        case ADD_GOAL:
            return state.concat([action.goal]);
        case REMOVE_GOAL:
            return state.filter(goal => goal.id !== action.id);
        default:
            return state;
    }
}

function app(state = {}, action) {
    return {
        todos: todos(state.todos,action),
        goals: goals(state.goals,action)
    }
}
const store = createStore(app);
store.subscribe(() => {
    console.log("The new state is ",store.getState());
})
// store.dispatch(addTodoAction({
//     id:0,
//         name: 'Learn Redux',
//         complete: false
//     }));
// store.dispatch(addTodoAction({
//         id:1,
//         name: 'Read a book',
//         complete: true
//     }));
// store.dispatch(addTodoAction({
//         id:3,
//         name: 'Learn Redux again',
//         complete: false
//     }));
//
// store.dispatch(addTodoAction({
//         id:4,
//         name: 'Read a different book',
//         complete: true
//     }));
//
// store.dispatch(removeTodoAction(3));
// store.dispatch(toggleTodoAction(4));
// store.dispatch(addGoalAction({
//     id: 0,
//         name: 'Learn Everything',
//         complete: false
//     }));
function generateID() {
    return Math.random().toString(36).substring(2)+(new Date()).getTime().toString(36);
        }

function addTodo() {
    const input = document.getElementById('todo');
    const name = input.value;
    input.value='';
    store.dispatch(addTodoAction({
        name,
        complete: false,
        id: generateID()
    }));
}

function addGoal() {
    const input = document.getElementById('goal');
    const name = input.value;
    input.value='';
    store.dispatch(addGoalAction({
        name,
        id: generateID()
    }));
}

document.getElementById('todoBtn').addEventListener('click',addTodo)
document.getElementById('goalBtn').addEventListener('click',addGoal)


function createRemoveButton (onClick) {
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = 'X';
    removeBtn.addEventListener('click', onClick);
    return removeBtn;
}
function addTodoToDOM(todo) {
    const node = document.createElement('li');
    const text = document.createTextNode(todo.name);

    const removeBtn = createRemoveButton(()=> {store.dispatch(removeTodoAction(todo.id))});

    node.appendChild(text);
    node.appendChild(removeBtn);
    node.style.textDecoration= todo.complete ? 'line-through': 'none';
    node.addEventListener('click' , () => {
        store.dispatch(toggleTodoAction(todo.id));
    })
    document.getElementById('todos')
        .appendChild(node);
}

function addGoalToDOM(goal) {
    const node = document.createElement('li');
    const text = document.createTextNode(goal.name);
    const removeBtn = createRemoveButton(()=> {store.dispatch(removeGoalAction(goal.id))});

    node.appendChild(text);
    node.appendChild(removeBtn);
    document.getElementById('goals')
        .appendChild(node);
}

store.subscribe(() => {
    const { goals, todos } = store.getState();
    document.getElementById('goals').innerHTML='';
    document.getElementById('todos').innerHTML='';
    goals.forEach(addGoalToDOM);
    todos.forEach(addTodoToDOM);
})
