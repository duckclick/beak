console.log('frame.js')

const onMessage = (event) => {
  if (event.origin !== 'http://localhost:7276') {
    return
  }

  console.log(`FRAME received event`)
  const message = JSON.parse(event.data)

  switch (message.cmd) {
    case 'renderFrame': {
      const head = document.querySelector('head')

      if (head.innerHTML !== message.payload.head) {
        head.innerHTML = message.payload.head
      }

      const body = document.querySelector('body')
      const root = body.querySelector('#__duckclick-root__')
      body.innerHTML = message.payload.body

      Object
        .keys(message.payload.body_attributes)
        .forEach((attr) => {
          body.setAttribute(attr, message.payload.body_attributes[attr])
        })

      body.appendChild(root)
      break
    }
  }
}

window.addEventListener('message', onMessage, false)
