/* Main game file: main.js */
/* Game: [Your Game Name Here] */
/* Authors: [Your Name(s) Here] */
/* Description: [Flu spread with vaccination] */
/* Citations: [List any resources, libraries, tutorials, etc you used here] */
/* AI Use: describe what you asked, what it gave you, and what you changed. */
/* Mark AI-generated sections: // AI-generated: ... // end AI-generated   */

import "./style.css";
import { GameInterface } from 'simple-canvas-library';

let gi = new GameInterface();


/* --- STATE ------------------------------------------------------------ */

let infectionRate = 0.5;
let population = [];
let roundCount = 0;
let infectedPerRound = [1];
let vaccinationRate = 0.3; // 30% chance of being vaccinated
let populationSize = 100; // default population size


/* --- COORDINATE HELPER ------------------------------------------------
 *
 * Positions in your simulation are "percent coordinates": x and y
 * run from 0 to 100, where (0,0) is the top-left of any region.
 * percentToPixels() converts those to actual canvas pixels for a
 * given bounds object: { top, bottom, left, right }
 *
 * Examples (bounds = { top:0, bottom:400, left:0, right:800 }):
 *   percentToPixels(  0,   0, bounds) --> { x:   0, y:   0 }
 *   percentToPixels(100, 100, bounds) --> { x: 800, y: 400 }
 *   percentToPixels( 50,  50, bounds) --> { x: 400, y: 200 }
 *
 * @param {number} x
 * @param {number} y
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 * @returns {{x:number, y:number}}
 */
function percentToPixels(x, y, bounds) {
  return {
    x: bounds.left + (x / 100) * (bounds.right - bounds.left),
    y: bounds.top + (y / 100) * (bounds.bottom - bounds.top),
  };
}


/* --- DRAWING: SIMULATION ----------------------------------------------
 *
 * Draw your agents inside the simulation area.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 * @param {number} elapsed - ms since simulation started
 */
function drawSimulation(ctx, bounds, elapsed) {
  // Draw a border around the simulation area...
  let topLeft = percentToPixels(0, 0, bounds);
  let bottomRight = percentToPixels(100, 100, bounds);
  ctx.strokeStyle = 'orange';
  ctx.lineWidth = 2;
  ctx.strokeRect(topLeft.x, topLeft.y,
    bottomRight.x - topLeft.x,
    bottomRight.y - topLeft.y);
  // Example: utility function to draw a person as a circle
  function drawPerson(px, py, color) {
    let { x, y } = percentToPixels(px, py, bounds);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Now we draw some people...
  // (in your real code you'll replace this with a loop)
  // like...
  // Draw some people from the population array, using their x and y coordinates and infected status to determine their color
  for (let person of population) {
    let color = 'green';
    if (person.state === 'infected') {
      color = 'red';
    } else if (person.state === 'vaccinated') {
      color = 'blue';
    }
    drawPerson(person.x, person.y, color);
  }
}



/* --- DRAWING: GRAPH ---------------------------------------------------
 *
 * Draw a bar chart in the graph area.
 * data[] is a list of values (e.g. infectedPerRound).
 * dataMax is the largest possible value (e.g. population.length).
 *
 * This is a good CREATE task candidate -- try calling it with
 * fake data to see how changing the arguments changes the output.
 *
 * @param {number[]} data
 * @param {number} dataMax
 * @param {CanvasRenderingContext2D} ctx
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 */
function drawGraph(data, dataMax, ctx, bounds) {

  // Axes
  let topLeft = percentToPixels(0, 0, bounds);
  let bottomLeft = percentToPixels(0, 100, bounds);
  let bottomRight = percentToPixels(100, 100, bounds);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(bottomLeft.x, bottomLeft.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.stroke();

  // YOUR CODE HERE
  // Hint: let pct = (data[i] / dataMax) * 100;

}


/* --- DRAWING: HUD -----------------------------------------------------
 *
 * Optional text overlay. Delete if you don't need it.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
function drawHUD(ctx, width, height) {

  // YOUR CODE HERE
  ctx.textAlign = 'left';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'red';
  let text = `Simulation - Infection Rate: ${infectionRate.toFixed(2)}`;
  ctx.font = '16pt sans-serif';
  ctx.strokeText(text, 15, 25);
  ctx.fillText(text, 15, 25);

}


/* --- REGISTERED DRAWING CALLBACKS -------------------------------------
 * You shouldn't need to change these.
 * Adjust the bounds values if you want to resize the regions.
 */

gi.addDrawing(function ({ ctx, width, height, elapsed }) {
  let simBounds = {
    top: 30,
    bottom: height / 2 - 10,
    left: 10,
    right: width - 10,
  };
  drawSimulation(ctx, simBounds, elapsed);
});

gi.addDrawing(function ({ ctx, width, height }) {
  let graphBounds = {
    top: height / 2 + 10,
    bottom: height - 50,
    left: 50,
    right: width - 50,
  };
  drawGraph([], 1, ctx, graphBounds);  // <- replace [] and 1 with your real data
});

gi.addDrawing(function ({ ctx, width, height }) {
  drawHUD(ctx, width, height);
});


/* --- SIMULATION LOGIC -------------------------------------------------
 *
 * Write functions to update your population each round.
 * Your CREATE task function must have a parameter that affects
 * its behavior, sequencing, selection (if/else), iteration (loop),
 * and an explicit call with arguments somewhere in your code.
 */

// YOUR CODE HERE
// This code was helped written by Gemini
function runNextRound() {
  // Variable to determine how close 2 people need to be to spread the infection
  let infectionDistance = 5; 
  let newInfections = 0; // Count new infections this round
  // Loop through everyone in the population 
  for(let i = 0; i < population.length; i++) {
    let personA = population[i];
    // Only infected people can spread the infection
    if (personA.state === 'infected') {
      // Loop through everyone else in the population to see if they get infected
      for (let j = 0; j < population.length; j++) {
        let personB = population[j];
      // Only healthy people can get infected
      // This code was helped written by Github Copilot
        if (personB.state === 'healthy') {
          // Calculate distance between personA and personB
          let dx = personA.x - personB.x;
          let dy = personA.y - personB.y;
          let distance = Math.sqrt(dx*dx + dy*dy);
          // If they are close enough, try to infect based on infectionRate
          if (distance < infectionDistance) {
            if (Math.random() < infectionRate) {
              personB.state = 'infected';
              newInfections++;
            }
          }
        }
      }
    }
  }
  infectedPerRound.push(newInfections);
  roundCount++;
}

// Adds people to the population array with random coordinates, and infects one person
function generatePopulation (size) {
  population = [];
  for (let i = 0; i < size; i++) {
    // This code was helped written by ChatGPT
    // Randomly decide if the person is vaccinated based on the vaccination rate
    let isVaccinated = Math.random() < vaccinationRate;
    // Create states for persons: 'healthy', 'infected', 'vaccinated'
    // Start everyone as healthy then change to some persons to vaccinated randomly
    let state = 'healthy';
    // If the person is vaccinated, change their state to 'vaccinated'
    if (isVaccinated) {
      state = 'vaccinated';
    }
    // Add the person to the population array with random corrdinates and state
    population.push({
      x: Math.random()*100,
      y: Math.random()*100,
      state: state
    });
  }
  // So infect one random person
  // This code was helped written by Githit Copilot
  // Choose one random person to start infected so we can start the simulation
  let randomIndex = Math.floor(Math.random() * population.length);
  population[randomIndex].state = 'infected';
}
// Generate initial population
generatePopulation(populationSize); 


  /* --- CONTROLS --------------------------------------------------------- */

let topBar = gi.addTopBar();

topBar.addButton({
  text: 'Next Round',
  onclick: function () {
    window.alert('Replace me: call your simulation update function');
  }
});
// Slider that updates infectionRate variable
topBar.addSlider({
  label: 'Infection Rate',
  min: 0, max: 1, step: 0.01,
  value: infectionRate,
  oninput: function (value) { infectionRate = value; }
});
// Slider that determines population size
topBar.addSlider({
  label: 'Initial Population',
  min: 16, max: 2048,
  oninput: function (value) {
    // This code was helped written by GitHub Copilot
    populationSize = value;
    generatePopulation(populationSize); // Regenerate population with new size
  }
});
// Slider that updates vaccinationRate variable
topBar.addSlider({
  label: 'Vaccination Rate',
  min: 0, max: 1, step: 0.01,
  // This code was helped written by ChatGPT
  value: vaccinationRate,
  oninput: function (value) { vaccinationRate = value; 
  // Regenerate population with current size and vaccination rate
  generatePopulation(populationSize); 
  }
});
   

topBar.addButton({
  text: 'Reset',
  onclick: function () {
    // Regenerate population with current size and vaccination rate
    generatePopulation(populationSize); 
  }
});

// TODO: add sliders or inputs for your own parameters here


gi.run();