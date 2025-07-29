const input = "Belajar Golang adalah belajar membuat backend yang scalable dengan Golang";
function countWordFrequency(text) {
    return text.toLowerCase()
               .split(/\s+/)
               .reduce((freq, word) => {
                   const cleanWord = word.replace(/[^\w]/g, '');
                   if (cleanWord) {
                       freq[cleanWord] = (freq[cleanWord] || 0) + 1;
                   }
                   return freq;
               }, {});
}
console.log(countWordFrequency(input));