// TodoList.js

import React, { Component } from "react";
import TodoItems from "./TodoItems";
import { getTodos, addTodo, deleteTodo } from "./api";

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  async componentDidMount() {
    try {
      const todos = await getTodos();
      this.setState({ items: todos });
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  async addItem(e) {
    e.preventDefault(); //avoid refresh page
    if (this._inputElement.value !== "") {
      const newItem = {
        title: this._inputElement.value,
        completed: false,
      };

      try {
        const addedTodo = await addTodo(newItem);
        this.setState((prevState) => ({
          items: [...prevState.items, addedTodo],
        }));
        this._inputElement.value = "";
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  }

  async deleteItem(key) {
    try {
      await deleteTodo(key);
      this.setState((prevState) => ({
        items: prevState.items.filter((item) => item.id !== key),
      }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  render() {
    return (
      <div className='todoListMain'>
        <div className='header'>
          <form onSubmit={this.addItem}>
            <input
              ref={(a) => (this._inputElement = a)}
              placeholder='Enter task'
            />
            <button type='submit'>Add</button>
          </form>
          <TodoItems entries={this.state.items} delete={this.deleteItem} />
        </div>
      </div>
    );
  }
}

export default TodoList;
