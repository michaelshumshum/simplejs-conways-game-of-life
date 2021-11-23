const widthElement = document.getElementById('width')
const heightElement = document.getElementById('height')
const startStopButton = document.getElementById('startstop')
const resetButton = document.getElementById('reset')
const grid = document.getElementById('grid');
width = 1
height = 1
start = false

cells = []
alive = []

animationFrameID = null
startTime = null
previousTime = null

function gridTemplate(count) {
  var x = (100 / count).toString();
  var row = '';
  for (let i = 0; i < count; i++) {
    row += x + '% '
  }
  return row;
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function startStop() {
  if (start) {
    grid.addEventListener('mousedown', editCell)

    for (let k = 0; k < cells.length; k++) {
      cells[k].style.border = '0.1em solid black'
    }

    start = false
    startStopButton.innerHTML = 'Start'
    grid.style.cursor = 'pointer'
    window.cancelAnimationFrame(animationFrameID)
  } else {
    grid.removeEventListener('mousedown', editCell)
    start = true
    startTime = null
    previousTime = null
    startStopButton.innerHTML = 'Stop'
    grid.style.cursor = 'default'
    animationFrameID = window.requestAnimationFrame(step)
  }
}

function step(timestamp) {
  if (startTime == null) {
    startTime = timestamp
    for (let k = 0; k < cells.length; k++) {
      cells[k].style.border = null
    }
  }

  if (previousTime !== timestamp) {
    simulation()
    sleep(50)
  }
  previousTime = timestamp
  animationFrameID = window.requestAnimationFrame(step)
}

function getNeighbors(cell) {
  var index = cells.indexOf(cell)
  let l = [
    cells[index + 1],
    cells[index - 1],
    cells[index + 1 + parseInt(width)],
    cells[index - 1 + parseInt(width)],
    cells[index + 1 - parseInt(width)],
    cells[index - 1 - parseInt(width)],
    cells[index + parseInt(width)],
    cells[index - parseInt(width)],
  ]
  return l
}

function getAliveNeighbors(cell) {
  let index = cells.indexOf(cell)
  var aliveNeighbors = 0
  let neighbors = getNeighbors(cell)
  for (let i = 0; i < neighbors.length; i++) {
    if (alive.includes(neighbors[i])) aliveNeighbors += 1
  }
  return aliveNeighbors
}

function simulation() {
  cells = Array.prototype.slice.call(document.querySelectorAll('.grid-item'))
  alive = Array.prototype.slice.call(document.querySelectorAll('.grid-item.enabled'))
  var willDie = []
  var willPopulate = []
  var simulated = []

  for (let i = 0; i < alive.length; i++) {
    var cell = alive[i]
    var aliveNeighbors = getAliveNeighbors(cell)
    if (aliveNeighbors != 2 && aliveNeighbors != 3) willDie.push(cell)
    if (aliveNeighbors > 0) {
      var neighbors = getNeighbors(cell)
      for (let o = 0; o < neighbors.length; o++) {
        if (alive.includes(neighbors[o]) || simulated.includes(neighbors[o])) continue
        if (getAliveNeighbors(neighbors[o]) == 3) willPopulate.push(neighbors[o])
        simulated.push(neighbors[o])
      }
    }
    simulated.push(cell)
  }
  for (let i = 0; i < willDie.length; i++) {
    willDie[i].classList.remove('enabled')
    willDie[i].style.background = 'white'
  }
  for (let i = 0; i < willPopulate.length; i++) {
    willPopulate[i].classList.add('enabled')
    willPopulate[i].style.background = 'lightgreen'
  }
}

function gridDimensions(e) {
  if (start) startStop()
  if (e.target.id == 'width') {
    if (!isNaN(parseInt(e.target.value))) width = e.target.value
  } else if (e.target.id == 'height') {
    if (!isNaN(parseInt(e.target.value))) height = e.target.value
  }
  if (height < width) {
    grid.style.height = (80 * (height / width)).toString() + 'em';
    grid.style.width = '80em';
  } else if (width < height) {
    grid.style.width = (80 * (width / height)).toString() + 'em';
    grid.style.height = '80em';
  } else {
    grid.style.height = '80em';
    grid.style.width = '80em';
  }
  grid.innerHTML = '';
  grid.style.gridTemplateRows = gridTemplate(height);
  grid.style.gridTemplateColumns = gridTemplate(width);
  for (let i = 0; i < width * height; i++) {
    var element = document.createElement('div')
    element.classList.add('grid-item')
    element.style.border = '0.1em solid black'
    element.style.cursor = 'pointer'
    grid.appendChild(element);
  }
}

function editCell(e) {
  var cell = e.target
  if (cell.classList.contains('enabled')) {
    cell.classList.remove('enabled')
    cell.style.background = 'white'
  } else {
    cell.classList.add('enabled')
    cell.style.background = 'lightgreen'
  }
}

heightElement.addEventListener('input', gridDimensions);
widthElement.addEventListener('input', gridDimensions);
resetButton.addEventListener('click', gridDimensions)
startStopButton.addEventListener('click', startStop)
grid.addEventListener('mousedown', editCell)