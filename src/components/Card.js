import { FaTrashAlt } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useState } from "react";
import api from '../services/api'

function Card({props, handleDelete, handleUpdate }) {

        const [changeTask, setChangeTask] = useState("");

        function handleEdit(e) {
            e.style.cursor = 'text';
        }

        async function handleSave(e, info) {
            e.style.cursor = 'default';
            if (changeTask && changeTask !== info) {
                await api.post(`/contents/${props._id}`, {
                    info: changeTask,
                });
            }
        }
        
    return(
    <div className={props.priority ? 'mainright-card priority' : 'mainright-card'}>
        <div className="card-left">
            <label> {props.title} </label>
            <textarea 
            defaultValue={props.info}
            onClick={e => handleEdit(e.target, props.priority)} // Ao clicar
            onChange={e => setChangeTask(e.target.value)} // Ao mudar
            onBlur={e => handleSave(e.target, props.info)} // Ao sair 
            />
            <p> {Intl.DateTimeFormat('pt-BR').format(new Date(props.date))} </p>
        </div>
        <div className="card-right">
            <span title="Excluir anotação">
                <FaTrashAlt size={15}
                onClick={() => handleDelete(props._id)}
                />
            </span>
            <span title="Editar prioridade">
                <IoInformationCircleOutline 
                size={15}
                onClick={() => handleUpdate(props._id)}
                />
            </span>
        </div>
    </div>
    )
}

export default Card;    