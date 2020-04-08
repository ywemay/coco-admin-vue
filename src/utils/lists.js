export function handleItemSelect(listItems, anId) {
  if (listItems.indexOf(anId) === -1) {
    listItems.push(anId)
  } else {
    listItems = listItems.filter(val => {
      return val !== anId
    })
  }
  return listItems
}
