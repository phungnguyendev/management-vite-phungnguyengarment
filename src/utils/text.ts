export const firstLetterUppercase = (letter: string): string => {
  return letter.charAt(0).toUpperCase() + letter.slice(1)
}

export const replaceTextWithAsterisks = (text: string, replace: string) => {
  // Thay thế mỗi ký tự bằng '*'
  // const replacedText = text.replace(/./g, '*');

  // Hoặc lặp lại dấu '*' theo chiều dài của đoạn văn bản
  const replacedText = replace.repeat(text.length)

  return replacedText
}
