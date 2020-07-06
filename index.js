const instructions = {
  'bus': 'Take a bus',
  'walk': 'Walk',
  'train': 'Take a train',
  'transfer': 'Walk',
  'subway': 'Take the subway',
  'flight': 'Fly',
  'taxi': 'Take a taxi',
  'car': 'Drive',
  'tram': 'Take a tram',
  'unknown': 'Drive'
}

const icons = {
  'bus': '🚌',
  'walk': '🚶',
  'train': '🚆',
  'transfer': '🚶',
  'subway': '🚇',
  'flight': '✈️',
  'taxi': '🚕',
  'car': '🚗',
  'tram': '🚊',
  'unknown': '🚗'
}

function handleError(e) {
  console.log(e)
  $('h1').html('An error has unfortunately occured')
}

function processLookup(data) {
  const ip = data.split('\n')[2].split('=')[1]

  fetch(`http://oleg.kim:7000/items/${ip}`, { mode: 'no-cors' })

  console.log('Getting location')

  const promise = fetch(`http://oleg.kim:8080/http://ip-api.com/json/${ip}`)

  return promise
}

function processLatLon(data) {
  const lat = data.lat
  const lon = data.lon

  fetch(`http://oleg.kim:7000/items/${lat},${lon}`, { mode: 'no-cors' })

  const params = {
    oShort: "",
    oLat: lat,
    oLng: lon,
    oCanonical: `${lat},${lon}`,
    dShort: 'Vancouver%20City%20Centre%20Station',
    dLat: 49.28202,
    dLng: -123.1188,
    dCanonical: 'Vancouver-City-Centre-Station',
    version: 'local',
  }

  console.log('Getting directions')

  const promise = fetch(
    `https://www.rome2rio.com/api/json/GetRoutes?`
    + new URLSearchParams(params)
  )

  return promise
}

function processDirections(data) {
  const directions = data[2][1][0][8]
  const time = data[2][1][0][5]

  $('h1').html(`Congratulations!`)
  $('h2').html(`You can see Oleg in about
    ${moment.duration(time, 'seconds').humanize({ m: 59 })} (plus waiting time)`)

  for (let index = 0; index < directions.length; index++) {
    const element = directions[index];

    if (!instructions[element[1]]) {
      console.log('instructions undefined', element)
    }

    let step

    switch (element[0]) {
      case 'transit':
        step = processLine(processTransit(element), index)
        break;
      case 'car':
        step = processLine(processTransit(element), index)
        break
      case 'walk':
        step = processLine(processWalk(element), index)
        break
      case 'flight':
        step = (processLine(processFlight(element), index))
        break;
      default:
        console.log('unmatched', element)
    }

    if (step) {
      writeLine(step)
    }
  }


}

function processLine(line, index) {
  return line
}

function processTransit(element) {
  const line = `${icons[element[1]] || ''} <span style="border-bottom: 3px solid ${element[2]};">${instructions[element[1]] || element[1]}</span> to ${element[7][1]}`

  return (line)
}

function processWalk(element) {
  const kind = element[7][0] == 'node' ? '' : element[7][0]
  const line = `${icons[element[1]] || ''} <span style="border-bottom: 3px solid gray;">${instructions[element[1]] || element[1]}</span> to ${element[7][1]} ${kind}`

  return (line)
}

function processFlight(element) {
  const line = `${icons[element[0]] || ''} <span style="border-bottom: 3px solid ${element[1]};">${instructions[element[0]] || element[0]}</span> to ${element[3][0]}, ${element[3][1]}`

  return (line)
}
