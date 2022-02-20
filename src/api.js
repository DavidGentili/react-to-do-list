const deffer = (fun) => {
    return new Promise((res) => {
        setTimeout(() => {
            res(fun);
        },1500)
    })
}

export default {
    items: {
        fetch : () => deffer(JSON.parse(localStorage.getItem('listItems') || '[]')),
        update: (items) => deffer(localStorage.setItem('listItems',JSON.stringify(items)))
    },
    id: {
        fetch : () => deffer(JSON.parse(localStorage.getItem('counterId') || '[]')),
        update: (id) => deffer(localStorage.setItem('counterId',JSON.stringify(id)))   
    }
}   