const toggleMenu = () => {
  const item = document.getElementById('nav-links');
  if (item.classList.contains('display')) {
    item.classList.remove('display');
  } else {
    item.classList.add('display');
  }
}