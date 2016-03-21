import * as _ from 'lodash';

function mostUsedWord(Messages, amount: number, callback: Function): void {
  Messages.find({}, (err, data) => {
    const words = _.chain(data)
     .map('message')
     .map(_.words)
     .flatten()
     .value();
     const wordCount = _.reduce(words, (acc, cur) => {
       acc[cur] = (acc[cur] || 0) + 1;
       return acc;
     }, {});

     const keys = _.keys(wordCount);
     const arr = _.map(keys, (key) => ({word: key, count: wordCount[key]}));
     callback(_.sortBy(arr, 'count').reverse().slice(0, amount));
  });
}

export default mostUsedWord;
