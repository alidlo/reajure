import {r, h, c} from "./core"

type Todo = {id: string
             title: string,
             done: boolean}

type TodoAction = (o: Todo) => void

const id = () => Math.random().toString(36).substr(2, 9)

const todo = 
  h<{todo: Todo, 
     onUpdate: TodoAction, 
     onRemove: TodoAction}>(p => {
       const [editing, setEditing] = r.useState(false),
             [title, setTitle]     = r.useState(p.todo.title),
             [done, setDone]       = r.useState(p.todo.done),
             submitTitle = (e: any) => {
               e.preventDefault()
               p.onUpdate({...p.todo, title, done})
               setEditing(false)},
             submitDone = (e: any) => {
               p.onUpdate({...p.todo, title, done: e.target.checked})
               setDone(e.target.checked)}
       return c.vw(
         {onDoublePress: () => setEditing(true)},
         // TODO checkbox
         // c.ipt({
         //   // type: "checkbox",
         //   // checked: done,
         //   onChange: submitDone}),
         !editing 
           ? c.vw({style: ["flxdR"]},
                  c.lbl({style: ["flx1"]}, title),
                  c.btn({style: ["ml2", "mnw3"], onPress: () => p.onRemove(p.todo)}, "Destroy"))
           : c.ipt({value: title,
                    onChange: (e: any) => setTitle(e.target.value),
                    onBlur: submitTitle}))})
        
  
const newTodo =
 h<{onCreate: Function}>(p => {
   const [title, setTitle] = r.useState(""),
         onSubmit = () => {
           if (title.length) {
             p.onCreate({id: id(), title, done: false})
             setTitle("")}}
   return c.vw(
     // TODO form.
     {style: ["flxdR", "mb3"]},
     c.ipt({value: title,
            onChange: (e: any) => setTitle(e.target.value),
            placeholder: "What needs to be done?"}),
     c.btn({style: ["ml2", "mnw3"], 
            onPress: onSubmit}, "New"))})
           
const todoList = 
  h<{todos: Todo[], 
     onUpdate: Function, 
     onRemove: Function}>(p => {
       return c.vw(
         p.todos
           .sort((a, b) => (a.id < b.id ? -1 : 1))
           .map(o => c.vw({style: ["mb2"]},
                          todo({key: o.id,
                                onRemove: () => p.onRemove(o),
                                onUpdate: p.onUpdate,
                                todo: o}))))})
             
export const app = 
  h(() => {
    const [todos, setTodos] = r.useState([] as any)
    return c.vw(
      {style: ["flxdC", "aiC"]},
      c.lbl({style: ["mv3"]}, "All Todos"),
      c.vw(
        {style: ["w6"]},
        newTodo({onCreate: (o: Todo) => setTodos([o].concat(todos))}),
        todoList({todos, 
                  onUpdate: (o1: Todo) => setTodos(todos.map((o2: Todo) => o1.id === o2.id ? {...o1, ...o2} : o2)),
                  onRemove: (o1: Todo) => setTodos(todos.filter((o2: Todo) => o1.id !== o2.id))})
      ))})

