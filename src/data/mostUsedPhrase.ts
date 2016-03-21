import * as _ from 'lodash';

function mostUsedPhrase(Messages, amount: number, callback: Function): void {
  Messages.find({}, (err, data) => {
    const words = _.chain(data)
     .map('message')
     .value();
     const phraseCount = _.reduce(words, (acc, cur) => {
       acc[cur] = (acc[cur] || 0) + 1;
       return acc;
     }, {});

     const keys = _.keys(phraseCount);
     const arr = _.map(keys, (key) => ({phrase: key, count: phraseCount[key]}));
     callback(_.sortBy(arr, 'count').reverse().slice(0, amount));
  });
}

export default mostUsedPhrase;
