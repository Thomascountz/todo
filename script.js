$(function(){

	var $textBox = $('input#new-todo-textbox');
	var todos = JSON.parse(load("todos")) || { "inQueue"  : [], "complete" : [] };
	updateList();

	function updateList() {
		$('ul.list-items').html("");
		todos.complete.forEach(function(todo) {
			addToList(todo, "complete");
		});
		todos.inQueue.forEach(function(todo) {
			addToList(todo, "in-queue");
		});
	}

	function remove(todo, fromList) {
		let index = todos[fromList].indexOf(todo);
		return todos[fromList].splice(index, 1)[0];
	}

	function addTo(todo, toList) {
		todos[toList].push(todo);
		save("todos", JSON.stringify(todos));
	}

	function clearComplete(){
		todos.complete = [];
		save("todos", JSON.stringify(todos));
		updateList;
	}

	function addToList(todo, status) {
		var html = "<li class=" + status + ">" + todo + "</li>";
		$('ul.list-items').prepend(html);
	}

	// loads a key's value from localStorage
	function load(key) { 
		let response = localStorage[key];
		if (response !== undefined) {
			return response;
		} else {
			return false;
		}
	}

	// saves a value to a specified key in localStorage
	function save(key, value) {
		localStorage[key] = value;
	}

	// validates string length is > 0 and < 15
	function isValid(string, maxLength) {
		if (string.trim() === "" || string.length > maxLength) {
			return false;
		} else {
			return true;
		}
	}

	$textBox.focus();
	$textBox
		.focus(function() {
		$(this).removeClass('field-with-errors');
	}) // end textbox focus
		.keyup(function(){
		input = $(this).val();
		if (isValid(input, 15) || input.length === 0) {
			$textBox.removeClass('field-with-errors');
		} else {
			$textBox.addClass('field-with-errors');
		}
	}); // end textbox keyup

	$('#todo').on('submit', function(evt){
		evt.preventDefault();
		var todo = $textBox.val();
		if (isValid(todo, 15)) {
			$textBox.removeClass('field-with-errors');
			addToList(todo, "in-queue");
			$textBox.val("");
			todos.inQueue.push(todo);
			save("todos", JSON.stringify(todos));
		} else {
			$textBox.addClass('field-with-errors');
		}
	}); // end submit button click

	$('#clear-button').click(function(){
		clearComplete();
		updateList();
	}); // end clear button click

	$('ul.list-items')
		.on('click', 'li.in-queue', function(){
		let todo = $(this)[0].innerText;
		let newTodo = remove(todo, "inQueue");
		addTo(newTodo, "complete");
		$(this).removeClass("in-queue");
		$(this).addClass("complete");
	}) .on('click', 'li.complete', function(){
		let todo = $(this)[0].innerText;
		let newTodo = remove(todo, "complete")
		addTo(todo, "inQueue");
		$(this).removeClass("complete");
		$(this).addClass("in-queue");
	}); // end ul click

}); // end ready