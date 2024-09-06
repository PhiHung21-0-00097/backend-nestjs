import { Types } from 'mongoose';

export function formatDate(date: Date): string {
  let hours: any = date.getHours();
  let minutes: any = date.getMinutes();

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  let day: any = date.getDate();
  let month: any = date.getMonth() + 1;
  const year = date.getFullYear();

  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;
  return hours + ':' + minutes + ' - ' + day + '/' + month + '/' + year;
}
export function areObjectIdArraysDifferent(
  array1: Types.ObjectId[],
  array2: Types.ObjectId[],
): boolean {
  if (array1.length !== array2.length) {
    return true;
  }

  const set1 = new Set(array1.map((id) => id.toString()));
  const set2 = new Set(array2.map((id) => id.toString()));

  for (const id of set1) {
    if (!set2.has(id)) {
      return true;
    }
  }

  for (const id of set2) {
    if (!set1.has(id)) {
      return true;
    }
  }

  return false;
}
export async function getRemovedManagers(
  bodyManager: Types.ObjectId[],
  currentManager: Types.ObjectId[],
) {
  const bodyManagerIds = bodyManager.map((id) => id.toString());
  const currentManagerIds = currentManager.map((id) => id.toString());
  const removedManagers = currentManagerIds.filter(
    (id) => !bodyManagerIds.includes(id),
  );

  return removedManagers.map((id) => new Types.ObjectId(id));
}
