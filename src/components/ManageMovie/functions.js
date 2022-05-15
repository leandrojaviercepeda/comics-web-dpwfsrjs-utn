export function getMovieCharacters (characters, casting, known=true) {
  if (!Array.isArray(characters) && !Array.isArray(casting)) return []
  const castingCharactersNames = []
  for (const item of casting) {
      const data = item.character.split(" / ")
      if (Array.isArray(data)) {
          for (const el of data) {
              const loweEl = el.toLowerCase()
              if (castingCharactersNames.indexOf(loweEl) < 0) {
                  castingCharactersNames.push(loweEl)
              }
          }
      } else {
          const lowerData = data.toLowerCase()
          if (castingCharactersNames.indexOf(lowerData) < 0) {
              castingCharactersNames.push(lowerData)
          }
      }
  }

  if (!known) return [...castingCharactersNames.filter(castCharacter => !(characters.map(character => character.character_name.toLowerCase())).includes(castCharacter))]
  return [...characters.filter(character => castingCharactersNames.some(castCharacter => castCharacter.includes(character.character_name.toLowerCase())))]
}