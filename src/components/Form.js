import DotLoader from "react-spinners/DotLoader";
import { useState, useEffect } from "react";
import api from '../services/api';
import Card from './Card'

function Form() {
    
    let [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState("all")
    const [title, setTitle] = useState("");
    const [info, setInfo] = useState("");
    const [allTask, setallTask] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        const response = await api.post('/todolist', {
            title,
            info,
            priority: false
        });

        setTitle("");
        setInfo("");

        if (selectedValue !== 'all') {
            getTasks();
        } else {
            setallTask([...allTask, response.data])
        }
        setSelectedValue("all");
        setLoading(false);
    }

    useEffect(() => {
        getTasks();
    }, []);

    async function getTasks(){
        setLoading(true);
        const response = await api.get('/todolist');
        setallTask(response.data);
        setLoading(false);
    }

    async function loadTasks(option) {
        setLoading(true);
        const params = { priority: option };
        const response = await api.get('/priorities', { params });
        if (response) {
            setallTask(response.data);
        }
        setLoading(false);
    }

    function handleChange(e) {
        setLoading(true);
        setSelectedValue(e.target.value);
        if (e.target.value !== 'all') {
            loadTasks(e.target.value === 'true');
        } else {
            getTasks();
        }
        setLoading(false);
    }

    useEffect(() => {
        function enableSubmitButton() {
            let button = document.getElementById('submit');
            button.style.background = '#FFD3CA';
            button.style.cursor = 'not-allowed';
            if (title && info) {
                button.style.background = '#83E408';
                button.style.cursor = 'pointer';
            }
        }
        enableSubmitButton();
    }, [title, info]);

    async function handleDelete(id) {
        setLoading(true);
        const deletedTask = await api.delete(`/todolist/${id}`);

        if (deletedTask) {
            setallTask(allTask.filter(task => task._id !== id));
        }
        setLoading(false);
    }

    async function handleChangePriority(id) {
        setLoading(true);
        const changePriorityTask = await api.post(`/priorities/${id}`);

        if (changePriorityTask && selectedValue !== 'all') {
            loadTasks(selectedValue);
        } else if (changePriorityTask) {
            getTasks();
        }
        setLoading(false);
    }

    return(
        <div className="form">
            <main className="main">
                <div className="mainleft">
                    <form onSubmit={handleSubmit} className="mainleft-form">
                        <strong> Anotações diárias </strong>
                        <label> Título </label>
                        <input 
                        type="text" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        placeholder="Fazer compras num supermercado!"
                        />
                        <label> Conteúdo </label>
                        <textarea 
                        value={info} 
                        onChange={e => setInfo(e.target.value)}
                        required
                        placeholder="Comprar 500 gramas de Thor Ragnarok, junto com duas cabeças de Madame Teia."
                        />
                        <button 
                        type="submit" 
                        id="submit"> Enviar </button>
                        <div className="mainleft-form-radiobtn">
                            <input 
                            name="filter" 
                            type="radio" 
                            checked={  selectedValue === 'all' }
                            value={'all'}
                            onChange={handleChange}
                            />
                            <label> Todas </label>
                            <input 
                            name="filter" 
                            type="radio"
                            checked={ selectedValue === 'true' }
                            value={'true'}
                            onChange={handleChange}
                            />
                            <label> Com prioridade </label>
                            <input 
                            name="filter" 
                            type="radio"
                            checked={ selectedValue === 'false' }
                            value={'false'}
                            onChange={handleChange}
                            />
                            <label> Sem prioridade </label>
                        </div>
                    </form>
                </div>
                <div className="mainright">
                    { allTask.map(item => (
                        <Card 
                        key={item._id} 
                        props={item}
                        handleDelete={handleDelete}
                        handleUpdate={handleChangePriority}
                        />
                        )
                    )}
                </div>
            </main>
            <DotLoader color="#3d3d3d" 
            loading={loading}
            cssOverride={{position: 'absolute'}}
            size={30}
            />
        </div>
    )
}

export default Form;