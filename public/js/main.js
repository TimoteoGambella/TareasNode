window.addEventListener("DOMContentLoaded", e=>{
    updateTodos()
})

const mapCheckBoxes = ()=>{
    document.querySelectorAll(".complete-checkbox").forEach(item=>{
        item.addEventListener("click", async e => {
            const id = e.target.parentNode.parentNode.id
            let classes = e.target.parentNode.parentNode.childNodes[3].className.replace("completed","").trim()
            const completed = e.target.checked
            
            const res = await updateTodo(id, completed)

            if(res.response==="success"){
                if(completed){
                    e.target.parentNode.parentNode.childNodes[3].className+="completed"
                }else{
                    e.target.parentNode.parentNode.childNodes[3].className+="classes"
                }
            }
        })
    })
    document.querySelectorAll(".actions-container a").forEach(item=>{
        item.addEventListener("click", async e => {
            const id = e.target.parentNode.parentNode.id

            const res = await deleteTodo(id)

            if(res.response==="success"){
                updateTodos()
            }
        })
    })
}
const updateTodos = ()=>{
    fetch('https://tareas-node-liard.vercel.app/getall')
    .then(res => res.json())
        .then(data=>{
            console.log(data)
            if(data.response==="success"){
                const todos = data.data
                document.getElementById("todos").innerHTML=""
                todos.forEach(tod => {
                    document.getElementById("todos").innerHTML+=`
                        <div class="todo" id="${tod._id}">
                            <div class="checkbox-container">
                                <input type="checkbox" class="complete-checkbox" ${(tod.completed?"checked":"")} />
                            </div>
                            <div class="text-container ${tod.completed?"completed":""}">
                                ${tod.text}
                            </div>
                            <div class="actions-container">
                                <a> X </a>
                            </div>
                        </div>
                    `
                });
                mapCheckBoxes()
            }
        })
        .catch(err=>{
            console.log(err)
        })
}

const updateTodo = async (id,completed)=>{
    const res = await fetch("https://tareas-node-liard.vercel.app/completed/" + id + "/" + completed)
        .then(res=>res.json())
    
        return res
}

const deleteTodo = async (id)=>{
    const res = await fetch("https://tareas-node-liard.vercel.app/delete/" + id)
        .then(res=>res.json())
    
        return res
}



document.getElementById("formulario").addEventListener("submit", e=>{
    e.preventDefault()
    const text = document.getElementById("text").value
    if(text===""){
        return false
    }
    
    fetch("https://tareas-node-liard.vercel.app/add", {
        method:'POST',
        headers:{'Content-type': 'application/json'},
        body: JSON.stringify({text: text})
    }).then(res=>res.json())
        .then(data=>{
            if(data.response==="success"){
                updateTodos()
                document.getElementById("text").value=""
            }
    })
})