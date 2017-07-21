// Creates a custom sheet and returns a function for updating it with provided css text
let getCustomSheetUpdater = () => {
  let sheet = document.createElement('style');
  sheet.type = 'text/css';
  window.customSheet = sheet;
  (document.head || document.getElementsByTagName('head')[0]).appendChild(sheet);

  return (cssText) => {sheet.appendChild(document.createTextNode(cssText));}
}

//returns a function to update the font-size relative to a specific element
function createRelativeFontUpdater(relativeContainer, selector, fontRatio) {
  let customSheetUpdater = getCustomSheetUpdater();
  return (() =>{
    let containerWidth = relativeContainer.getBoundingClientRect().width;
    let newFontSize = containerWidth / fontRatio;
    let cssText = `${selector} { font-size: ${newFontSize}px; }`
    customSheetUpdater(cssText);
  })
}

export {createRelativeFontUpdater, getCustomSheetUpdater}
