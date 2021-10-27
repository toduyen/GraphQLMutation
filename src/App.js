import './App.css';
import {useQuery, gql , useMutation} from "@apollo/client";
import React,{useCallback , useState} from 'react';



// Câu lệnh truy vấn tới máy chủ GraphQL yêu cầu hiển thị dữ liệu
const GET_DATA = gql`
  query {
    todos {
      id,
      type
    }
  }
`;


// Câu lệnh truy vấn tới máy chủ GraphQL yêu cầu thêm dữ liệu
const ADD_TODO = gql`
  mutation AddTodo($type: String!){
    addTodo(type: $type){
      id,
      type
    }
  }
`;


// Câu lệnh truy vấn tới máy chủ GraphQL yêu cầu cập nhật dữ liệu
const UPDATE_TODO = gql`
  mutation UpdateTodo($id : String! , $type : String!){
    updateTodo(id: $id , type: $type){
      id,
      type
    }
  }
`;

// handle Cập nhật dữ liệu
function App_Update(){
  const [updateTodo] = useMutation(UPDATE_TODO);
  const {loading , error , data} = useQuery(GET_DATA);
  if(loading){return('loading...')}
  if(error){return('error')}
  const handleUpdte = (id , input) => {
    updateTodo({variables: {id:id , type:input.value}})
  }
  return data.todos.map(({id , type}) => {
        let input;
        return(
          <div key={id}>
            <p>{loading ? "Loading" : type}</p>
              <input type="text" ref={(node) => {input = node}}/>
              <button onClick={() => handleUpdte(id , input)}>{loading ? "loading..." : "Update"}</button>
          </div>
        )
    })
  }
// handle thêm mới todo
function Add_todos(){
  const [inputs, setinput] = useState({});
  const [addTodo] = useMutation(ADD_TODO,{
    update(cache, { data: { addTodo } }) {
      cache.modify({
        fields: {
          todos(existingTodos = []) {
            const newTodoRef = cache.writeFragment({
              data: addTodo,
              fragment: gql`
                fragment NewTodo on Todo {
                  id
                  type
                }
              `
            });
            return [...existingTodos, newTodoRef];
          }
        }
      });
    }
  });
  const onchangeHandle = useCallback(
    ({target: {name , value}}) => setinput(state => ({...state, [name]: value}),[])
  );
  const handleAddToDo = () => {
    addTodo({variables: {type: inputs.text1}});
  }
  return(
        <React.Fragment>
          <input type="text" name="text1" onChange={onchangeHandle}></input>
          <button type="button" onClick={handleAddToDo}>ADD</button>
        </React.Fragment>
  )
}


function App() {
    return (
        <div className="App">
          <h1>mutation</h1>
          <Add_todos/>
          <hr/>
          <App_Update/>
      
        </div>
    );
}

export default App;
