// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// import image preloader
// import { preloader } from './preloader.js'

// @see https://mdbootstrap.com/docs/standard/extended/back-to-top/
let mybutton = document.getElementById('btn-back-to-top')

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction()
}

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = 'block'
  } else {
    mybutton.style.display = 'none'
  }
}

function backToTop() {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener('click', backToTop)
