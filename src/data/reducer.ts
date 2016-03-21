import * as _ from 'lodash';

interface ICounter {
  count: number;
}

function reduce(array: Array<any>, name: string, amount: number): Array<ICounter> {
 const counts = _.reduce(array, (acc, cur) => {
   acc[cur] = (acc[cur] || 0) + 1;
   return acc;
 }, {});
 const keys = _.keys(counts);
 const data = _.map(keys, (key) => ({
   [name]: key, count: counts[key]
 }));
 return _.sortBy(data, 'count').reverse().slice(0, amount);
}

export default reduce;
