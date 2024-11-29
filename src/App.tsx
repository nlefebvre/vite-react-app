import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { signOut } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';
import ScoreEntry from "./scoreEntry/ScoreEntry";
import TopThree from "./stats/topThree/TopThree";


const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  useEffect(() => {
    const fetchAttrs = async () => {
      const attrs = await fetchUserAttributes();
      setName(attrs.preferred_username ?? '');
    }
    fetchAttrs();
  })

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }


  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>{name} todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>
            {todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
        <button onClick={async () => await signOut()}>logout</button>
        <TopThree />
        <ScoreEntry />
      </div>
    </main>
  );
}

export default App;
