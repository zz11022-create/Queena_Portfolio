const oracleCard = document.querySelector('.oracle-card');
const reading = document.querySelector('.oracle-reading');
const drawButton = document.querySelector('.oracle-draw');
const readings = [
  { title: 'The Star', note: 'Make space for the idea you keep coming back to.', x: '50.5%', y: '97.2%' },
  { title: 'The Fool', note: 'Try the smallest version first.', x: '2.2%', y: '3.1%' },
  { title: 'The Sun', note: 'Let a little joy into the next thing you make.', x: '82.4%', y: '97.2%' },
];
let drawIndex = 0;

drawButton.addEventListener('click', () => {
  const card = readings[drawIndex];
  drawIndex = (drawIndex + 1) % readings.length;
  oracleCard.dataset.card = card.title;
  oracleCard.style.setProperty('--card-x', card.x);
  oracleCard.style.setProperty('--card-y', card.y);
  reading.textContent = card.title + ' · ' + card.note;
  drawButton.firstChild.nodeValue = 'Draw again ';
});
