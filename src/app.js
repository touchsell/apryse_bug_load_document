import WebViewer from "@pdftron/webviewer"
import pdfDocument3 from "../assets/PDF interactif.pdf"
import pdfDocument4 from "../assets/PathFinder.pdf"
import pdfDocument2 from "../assets/Sommaire - 2 Formations.pdf"
import pdfDocument1 from "../assets/Sommaire - 4 Formations.pdf"

const element = document.getElementById('pdftron-webviewer')
const options = {
  licenseKey:
  'The App Lab SAS:OEM:Touch and Sell::B+:AMS(20281107):' +
  '7D54BBEFE6FF3B5A0048B353187F610F600DD27E2B8B508E435CA55E37128A31F5C7',
  path: process.env.PDFTRON_REMOTE_PATH ?? '',
  fullAPI: true,
  preloadWorker: 'pdf,office',

  disabledElements: [
    'linkAnnotationPopup', // Popup when hovering links
    'linkButton', // Link tool to add a link to an annotation
  ],
}

let instance
(async () => {
  instance = await WebViewer.Iframe(options, element)

  instance.Core.documentViewer.addEventListener('documentLoaded', () => {
    instance.UI.setLayoutMode(instance.UI.LayoutMode.Single)
  })
})()

const loadDocument = async (path) => {
  const doc = await instance.Core.createDocument(path, { useDownloader: false, xodOptions: { azureWorkaround: true } })
  await doc.getDocumentCompletePromise()

  await instance.Core.documentViewer.closeDocument()
  await instance.Core.documentViewer.loadDocument(doc)
}

const buttonClose = document.getElementById('button-close')
buttonClose.addEventListener('click', () => instance.Core.documentViewer.closeDocument())

const button1 = document.getElementById('button-load-document-1')
button1.addEventListener('click', () => loadDocument(pdfDocument1))

const button2 = document.getElementById('button-load-document-2')
button2.addEventListener('click', () => loadDocument(pdfDocument2))

const button3 = document.getElementById('button-load-document-3')
button3.addEventListener('click', () => loadDocument(pdfDocument3))

const button4 = document.getElementById('button-load-document-4')
button4.addEventListener('click', () => loadDocument(pdfDocument4))
