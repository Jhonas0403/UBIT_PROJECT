import { ToDO } from "./ToDo.js";

console.log("estoy aca");
window.addEventListener("load", (ev) => {
  let container = document.querySelector("#root ul");

  document.querySelector("#mainForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const form = ev.target;

    const textarea = form.querySelector("textarea")
    const button = form.querySelector("[type='submit']");
    button.disabled = true;

    let todo = new ToDO({title:textarea.value})
    todo.save().then(()=>{
        textarea.value="";
        button.disabled=false;

        let li = buildDOMEElement(todo);
        container.prepend(li);
    });

    return false;
  });

  ToDO.all().then((todos) => {
    todos.forEach((todo) => {
      let node = buildDOMEElement(todo);
      container.prepend(node);
      
    });
  });

  let buildDOMEElement = (todo) => {
    let li = document.createElement("li");
    li.innerHTML = `<h1>${todo.title}</h1>
    <button class="close">X</button>`;

    li.querySelector(".close").addEventListener("click", (ev) => {
      todo.destroy();
      li.remove();
    });

    editInPlace(li.querySelector("h1"), todo);

    return li;
  };

  let editInPlace = (node, todo, propertyName) => {
    node.addEventListener("click", (ev) => {
      let inputText = document.createElement("textarea");
      inputText.value = node.innerHTML;
      inputText.autofocus = true;
      node.replaceWith(inputText);

      inputText.addEventListener("change", (ev) => {
        inputText.replaceWith(node);
        todo.title = ev.target.value;
        node.innerHTML = todo.title;
        todo.save().then((r) => console.log(r));
      });
    });
  };
});
