// Toggles the display class of the element with the id nav-links
const toggleMenu = () => {
  const item = document.getElementById('nav-links');
  if (item.classList.contains('display')) {
    item.classList.remove('display');
  } else {
    item.classList.add('display');
  }
}