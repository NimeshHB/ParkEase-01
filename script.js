document.querySelectorAll('.assign-btn').forEach(button => {
    button.addEventListener('click', () => {
        const row = button.parentElement.parentElement;
        row.cells[1].innerHTML = '<span class="occupied"></span> Occupied';
        row.cells[2].innerHTML = 'User ' + Math.floor(Math.random() * 1000);
        row.cells[3].innerHTML = '<button class="release-btn">Release</button>';
        button.remove();
    });
});

document.querySelectorAll('.release-btn').forEach(button => {
    button.addEventListener('click', () => {
        const row = button.parentElement.parentElement;
        row.cells[1].innerHTML = '<span class="available"></span> Available';
        row.cells[2].innerHTML = 'None';
        row.cells[3].innerHTML = '<button class="assign-btn">Assign</button>';
        button.remove();
    });
});